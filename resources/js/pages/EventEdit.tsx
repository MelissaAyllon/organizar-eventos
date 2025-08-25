import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Pencil, Trash2, Check, X, MessageSquarePlus } from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft } from "lucide-react";

interface Comment {
  id: number;
  contenido: string;        // ← backend field
  usuario?: string;         // optional for UI only (not persisted)
  created_at?: string;      // ← Eloquent timestamp
}

interface Event {
  id: number;
  nombre: string;
  fecha: string; // formato ISO string
  ubicacion: string;
  descripcion: string;
  hora?: string;
  imagen?: string;
  comentarios?: Comment[];
}

interface Props {
  event?: Event;
}

export default function EventEdit({ event }: Props) {
  // Estado de edición de campos del evento
  const [editingField, setEditingField] = useState<string | null>(null);
  const [formData, setFormData] = useState<Event>(event ? { ...event } : {} as Event);

  // ----- Comentarios (moderación) -----
  // Datos de ejemplo
  const sampleComments: Comment[] = [
    { id: 1, usuario: "Ana", contenido: "✨ Muy buen evento, me encantó la organización." },
    { id: 2, usuario: "Luis", contenido: "📌 Espero que lo repitan el próximo año." },
    { id: 3, usuario: "María", contenido: "👏 Excelente ambiente y actividades." },
    { id: 4, usuario: "Jorge", contenido: "🎶 La música estuvo increíble." },
    { id: 5, usuario: "Valentina", contenido: "🍔 La comida fue deliciosa, gran selección." },
  ];

  const [comments, setComments] = useState<Comment[]>(
    event?.comentarios ?? sampleComments
  );
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [commentDraft, setCommentDraft] = useState<string>("");
  const [newComment, setNewComment] = useState<string>("");

  if (!event) return <p>Evento no encontrado.</p>;

  // Handlers de evento
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setFormData((prev) => ({ ...prev, imagen: url }));
    }
  };

  // ----- Acciones de comentarios -----
  const startEditComment = (c: Comment) => {
    setEditingCommentId(c.id);
    setCommentDraft(c.contenido);
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setCommentDraft("");
  };

  const addComment = () => {
    const contenido = newComment.trim();
    if (!contenido) return;

    // Optimista
    const temp: Comment = {
      id: Date.now(),
      usuario: "Organización",
      contenido,
      created_at: new Date().toISOString(),
    };
    setComments((prev) => [temp, ...prev]);
    setNewComment("");

    router.post(
      "/api/comment",
      { evento_id: event.id, contenido }, // ← backend expects these names
      {
        preserveScroll: true,
        onError: () => {
          // rollback si falla
          setComments((prev) => prev.filter((c) => c.id !== temp.id));
        },
        // onSuccess: puedes refetch o reemplazar temp por el creado real
      }
    );
  };

  const saveEditComment = (id: number) => {
    const contenido = commentDraft.trim();
    if (!contenido) return;

    // Optimista
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, contenido } : c)));
    setEditingCommentId(null);
    setCommentDraft("");

    router.patch(`/api/comment/${id}`, { contenido }, { preserveScroll: true });
  };

  const deleteComment = (id: number) => {
    if (!confirm("¿Eliminar este comentario?")) return;
    setComments((prev) => prev.filter((c) => c.id !== id));
    // Conectar al backend
    // router.delete(route('events.comments.destroy', { event: event.id, comment: id }));
  };

  // Estilos de botones “bonitos”
  const btnBase =
    "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";
  const btnGhostGray = `${btnBase} border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 focus:ring-gray-300`;
  const btnGhostRed = `${btnBase} border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 focus:ring-red-300`;
  const btnGhostBlue = `${btnBase} border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 focus:ring-blue-300`;
  const btnPrimary =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 shadow-sm";

  return (
    <>
      <Head title={`Editar ${event.nombre}`} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link
            href="/events"
            className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Link>
        </div>

        <div className="space-y-6">
          {/* Card con imagen + detalles */}
          <Card className="p-6 flex flex-col md:flex-row gap-6">
            {/* Imagen izquierda */}
            <div className="md:w-1/3 aspect-[4/3] overflow-hidden rounded-xl border bg-gray-100 flex items-center justify-center relative">
              {formData.imagen ? (
                <img
                  src={formData.imagen}
                  alt={formData.nombre}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">Imagen del evento</span>
              )}
              <label className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100 cursor-pointer">
                <Pencil className="w-4 h-4 text-gray-600" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {/* Detalles derecha */}
            <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div className="relative">
                <p className="text-md font-medium text-gray-500">Event Name</p>
                {editingField === "nombre" ? (
                  <input
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    onBlur={() => setEditingField(null)}
                    autoFocus
                    className="mt-1 w-full border rounded-md px-3 py-2"
                  />
                ) : (
                  <p className="mt-1 text-lg font-semibold text-gray-800">
                    {formData.nombre}
                  </p>
                )}
                <button
                  className="absolute top-0 right-0 p-1 text-gray-500 hover:text-gray-700"
                  onClick={() => setEditingField("nombre")}
                  type="button"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>

              {/* Fecha */}
              <div className="relative">
                <p className="text-md font-medium text-gray-500">Event Date</p>
                {editingField === "fecha" ? (
                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha.split("T")[0]}
                    onChange={handleChange}
                    onBlur={() => setEditingField(null)}
                    autoFocus
                    className="mt-1 w-full border rounded-md px-3 py-2"
                  />
                ) : (
                  <div className="mt-1 flex items-center text-lg text-gray-800">
                    <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                    {format(parseISO(formData.fecha), "yyyy-MM-dd", { locale: es })}
                  </div>
                )}
                <button
                  className="absolute top-0 right-0 p-1 text-gray-500 hover:text-gray-700"
                  onClick={() => setEditingField("fecha")}
                  type="button"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>

              {/* Ubicación */}
              <div className="relative">
                <p className="text-md font-medium text-gray-500">Event Venue</p>
                {editingField === "ubicacion" ? (
                  <input
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleChange}
                    onBlur={() => setEditingField(null)}
                    autoFocus
                    className="mt-1 w-full border rounded-md px-3 py-2"
                  />
                ) : (
                  <div className="mt-1 flex items-center text-lg text-gray-800">
                    <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                    {formData.ubicacion}
                  </div>
                )}
                <button
                  className="absolute top-0 right-0 p-1 text-gray-500 hover:text-gray-700"
                  onClick={() => setEditingField("ubicacion")}
                  type="button"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>

              {/* Hora */}
              <div className="relative">
                <p className="text-md font-medium text-gray-500">Event Time</p>
                {editingField === "hora" ? (
                  <input
                    type="time"
                    name="hora"
                    value={formData.hora ?? "00:00:00"}
                    onChange={handleChange}
                    onBlur={() => setEditingField(null)}
                    autoFocus
                    className="mt-1 w-full border rounded-md px-3 py-2"
                  />
                ) : (
                  <div className="mt-1 flex items-center text-lg text-gray-800">
                    <Clock className="w-5 h-5 mr-2 text-gray-500" />
                    {formData.hora ?? "00:00:00"}
                  </div>
                )}
                <button
                  className="absolute top-0 right-0 p-1 text-gray-500 hover:text-gray-700"
                  onClick={() => setEditingField("hora")}
                  type="button"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>

          {/* Descripción */}
          <Card className="relative">
            <CardHeader>
              <CardTitle>Event Description</CardTitle>
            </CardHeader>
            <CardContent>
              {editingField === "descripcion" ? (
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  onBlur={() => setEditingField(null)}
                  autoFocus
                  className="w-full border rounded-md px-3 py-2"
                  rows={4}
                />
              ) : (
                <p className="text-gray-700">{formData.descripcion}</p>
              )}
            </CardContent>
            <button
              className="absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-700"
              onClick={() => setEditingField("descripcion")}
              type="button"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </Card>

          {/* Mapa */}
          {formData.ubicacion && (
            <Card>
              <CardHeader>
                <CardTitle>Event Map</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-72 w-full rounded-xl border overflow-hidden">
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(formData.ubicacion)}&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          )}

          {/* --------- Moderación de Comentarios --------- */}
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Comentarios (moderación)</CardTitle>
                <span className="text-sm text-gray-500">{comments.length} total</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Agregar comentario (opcional) */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <MessageSquarePlus className="w-4 h-4" />
                  Agregar comentario
                </label>
                <div className="flex items-start gap-2">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={2}
                    className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                    placeholder="Escribe un comentario (oficial/organizador)..."
                  />
                  <button onClick={addComment} className={btnPrimary} type="button">
                    Publicar
                  </button>
                </div>
              </div>

              {/* Lista con scroll */}
              <div className="mt-2 max-h-96 overflow-y-auto pr-2 space-y-3">
                {comments.map((c) => {
                  const isEditing = editingCommentId === c.id;
                  return (
                    <div key={c.id} className="p-3 bg-gray-50 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-gray-700 font-medium">{c.usuario ?? "—"}</div>
                        {c.created_at && (
                          <div className="text-xs text-gray-500">
                            {format(new Date(c.created_at.replace(" ", "T")), "yyyy-MM-dd HH:mm")}
                          </div>
                        )}
                      </div>

                      {/* Cuerpo / edición */}
                      {!isEditing ? (
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">{c.contenido}</p>
                      ) : (
                        <textarea
                          value={commentDraft}
                          onChange={(e) => setCommentDraft(e.target.value)}
                          rows={3}
                          className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                          autoFocus
                        />
                      )}

                      {/* Acciones */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {!isEditing ? (
                          <>
                            <button
                              onClick={() => startEditComment(c)}
                              className={btnGhostGray}
                              type="button"
                            >
                              <Pencil className="w-4 h-4" />
                              Editar
                            </button>
                            <button
                              onClick={() => deleteComment(c.id)}
                              className={btnGhostRed}
                              type="button"
                            >
                              <Trash2 className="w-4 h-4" />
                              Eliminar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => saveEditComment(c.id)}
                              className={btnGhostBlue}
                              type="button"
                            >
                              <Check className="w-4 h-4" />
                              Guardar
                            </button>
                            <button
                              onClick={cancelEditComment}
                              className={btnGhostGray}
                              type="button"
                            >
                              <X className="w-4 h-4" />
                              Cancelar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
                {comments.length === 0 && (
                  <p className="text-sm text-gray-500">No hay comentarios aún.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
