import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Pencil, Trash2, Check, X, MessageSquarePlus, Save, Upload, AlertTriangle, Tag, Users, User, Activity, Edit } from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Comment {
  id: number;
  evento_id: number;
  contenido: string;
  created_at: string;
  updated_at: string;
  usuario: string;
  editado: boolean;
  activo: boolean;
}

interface Event {
  id: number;
  nombre: string;
  fecha: string;
  ubicacion: string;
  descripcion: string;
  hora?: string;
  imagen?: string | File;
  tipo_actividad?: string;
  organizador?: string;
  capacidad_maxima?: number;
  estado: "activo" | "inactivo";
  comments?: Comment[];
}

interface Props {
  event: Event;
  auth?: {
    user?: {
      id: number;
      name: string;
      email: string;
    }
  }
}

type EditableEventFields = Omit<Event, 'id' | 'comments'>;
type EditableFieldName = keyof EditableEventFields;

export default function EventEdit({ event, auth }: Props) {
  // Estado de edición de campos del evento
  const [editingField, setEditingField] = useState<EditableFieldName | null>(null);
  const [formData, setFormData] = useState<Event>({ ...event });
  const [pendingChanges, setPendingChanges] = useState<Partial<EditableEventFields>>({});
  const [imageError, setImageError] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Comentarios
  const [comments, setComments] = useState<Comment[]>(event?.comments || []);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [commentDraft, setCommentDraft] = useState<string>("");
  const [newComment, setNewComment] = useState<string>("");

  if (!event) return <p>Evento no encontrado.</p>;

  // Validación de imagen
  const validateImage = (file: File): string | null => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
      return "Solo se permiten archivos de imagen (PNG, JPG, JPEG, GIF)";
    }

    if (file.size > maxSize) {
      return "El archivo debe ser menor a 5MB";
    }

    return null;
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Handlers de evento
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    let processedValue: string | number = value;
    if (name === 'capacidad_maxima') {
      processedValue = parseInt(value) || 0;
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));
    setPendingChanges((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handleSelectChange = (name: EditableFieldName, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setPendingChanges((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError("");

    if (!file) {
      setFormData((prev) => ({ ...prev, imagen: undefined }));
      setPendingChanges((prev) => ({ ...prev, imagen: undefined }));
      setPreviewUrl(null);
      return;
    }

    const error = validateImage(file);
    if (error) {
      setImageError(error);
      e.target.value = "";
      return;
    }

    try {
      const base64 = await convertToBase64(file);
      setFormData((prev) => ({ ...prev, imagen: base64 }));
      setPendingChanges((prev) => ({ ...prev, imagen: base64 }));
      setPreviewUrl(base64);
    } catch (error) {
      setImageError("Error al procesar la imagen");
      console.error("Error converting to base64:", error);
    }
  };

  const saveField = (fieldName: EditableFieldName) => {
    const pendingValue = pendingChanges[fieldName];
    if (pendingValue === undefined) return;

    const data = new FormData();

    if (fieldName === 'imagen' && typeof pendingValue === 'string' && pendingValue.startsWith('data:')) {
      // Para base64, enviamos directamente el string
      data.append('imagen', pendingValue);
    } else {
      data.append(fieldName, String(pendingValue));
    }

    data.append('_method', 'patch');

    router.post(`/events/${event.id}`, data, {
      preserveScroll: true,
      onSuccess: (page: any) => {
        // Actualizar datos del evento y comentarios
        if (page.props.event) {
          setFormData({ ...page.props.event });
          setComments(page.props.event.comments || []);
        }

        // Limpiar cambios pendientes para este campo
        const newPending = { ...pendingChanges };
        delete newPending[fieldName];
        setPendingChanges(newPending);
        setEditingField(null);
        setPreviewUrl(null);
      },
      onError: (errors) => {
        console.error('Error al actualizar:', errors);
      }
    });
  };

  const cancelEdit = (fieldName: EditableFieldName) => {
    const originalValue = event[fieldName];
    setFormData((prev) => ({ ...prev, [fieldName]: originalValue }));

    const newPending = { ...pendingChanges };
    delete newPending[fieldName];
    setPendingChanges(newPending);
    setEditingField(null);
    setPreviewUrl(null);
    setImageError("");
  };

  const formatCommentDate = (dateString: string) => {
    try {
      const date = new Date(dateString.includes('T') ? dateString : dateString.replace(' ', 'T'));
      return format(date, "dd/MM/yyyy HH:mm");
    } catch (error) {
      return 'Fecha no válida';
    }
  };

  // Acciones de comentarios
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

    router.post("/comments", {
      evento_id: event.id,
      contenido: contenido,
      usuario: auth?.user?.name || "Administrador",
    }, {
      preserveScroll: true,
      onSuccess: (page: any) => {
        if (page.props.event && page.props.event.comments) {
          setComments(page.props.event.comments);
        }
        setNewComment("");
      },
      onError: (errors) => {
        console.error('Error al crear comentario:', errors);
        if (errors.error) {
          alert(errors.error);
        }
      }
    });
  };

  const saveEditComment = (id: number) => {
    const contenido = commentDraft.trim();
    if (!contenido) return;

    router.patch(`/comments/${id}`, {
      contenido: contenido,
      editado: true
    }, {
      preserveScroll: true,
      onSuccess: (page: any) => {
        if (page.props.event && page.props.event.comments) {
          setComments(page.props.event.comments);
        }
        setEditingCommentId(null);
        setCommentDraft("");
      },
      onError: (errors) => {
        console.error('Error al actualizar comentario:', errors);
        if (errors.error) {
          alert(errors.error);
        }
      }
    });
  };

  const deleteComment = (id: number) => {
    if (!confirm("¿Marcar este comentario como inactivo?")) return;

    router.delete(`/comments/${id}`, {
      preserveScroll: true,
      onSuccess: (page: any) => {
        if (page.props.event && page.props.event.comments) {
          setComments(page.props.event.comments);
        }
      },
      onError: (errors) => {
        console.error('Error al desactivar comentario:', errors);
        if (errors.error) {
          alert(errors.error);
        }
      }
    });
  };

  // Estilos de botones
  const btnBase = "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";
  const btnGhostGray = `${btnBase} border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 focus:ring-gray-300`;
  const btnGhostRed = `${btnBase} border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 focus:ring-red-300`;
  const btnGhostBlue = `${btnBase} border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 focus:ring-blue-300`;
  const btnGhostGreen = `${btnBase} border border-green-200 bg-green-50 hover:bg-green-100 text-green-700 focus:ring-green-300`;
  const btnPrimary = "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 shadow-sm";

  const renderEditableField = (
    fieldName: EditableFieldName,
    label: string,
    icon: React.ReactNode,
    type: string = "text",
    isSelect: boolean = false,
    selectOptions?: { value: string; label: string }[]
  ) => {
    const isEditing = editingField === fieldName;
    const hasPendingChanges = pendingChanges[fieldName] !== undefined;

    const renderFieldValue = () => {
      const fieldValue = formData[fieldName];

      if (fieldName === 'fecha' && fieldValue && typeof fieldValue === 'string') {
        return format(parseISO(fieldValue), "EEEE, d 'de' MMMM yyyy", { locale: es });
      }

      if (fieldName === 'capacidad_maxima') {
        return `${fieldValue || 0} personas`;
      }

      if (fieldValue === undefined || fieldValue === null) {
        return 'No especificado';
      }

      return String(fieldValue);
    };

    return (
      <div className="relative">
        <p className="text-md font-medium text-gray-500">{label}</p>
        {isEditing ? (
          <div className="mt-1 space-y-2">
            {isSelect ? (
              <Select
                value={String(formData[fieldName] || "")}
                onValueChange={(value) => handleSelectChange(fieldName, value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectOptions?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="relative">
                <input
                  type={type}
                  name={fieldName}
                  value={String(formData[fieldName] || "")}
                  onChange={handleChange}
                  autoFocus
                  className={`w-full border rounded-md px-3 py-2 pr-10 focus:ring focus:ring-blue-300 ${(type === 'date' || type === 'time') ? 'cursor-pointer' : ''}`}
                  onClick={(type === 'date' || type === 'time') ? (e) => {
                    (e.target as HTMLInputElement).showPicker?.();
                  } : undefined}
                />
                {(type === 'date' || type === 'time') && (
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    {type === 'date' ? <Calendar className="h-4 w-4 text-gray-500" /> : <Clock className="h-4 w-4 text-gray-500" />}
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => saveField(fieldName)}
                className={btnGhostGreen}
                type="button"
                disabled={!hasPendingChanges}
              >
                <Save className="w-4 h-4" />
                Guardar
              </button>
              <button
                onClick={() => cancelEdit(fieldName)}
                className={btnGhostGray}
                type="button"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-1 flex items-center text-lg text-gray-800">
              {icon}
              {renderFieldValue()}
            </div>
            <button
              className="absolute top-0 right-0 p-1 text-gray-500 hover:text-gray-700"
              onClick={() => setEditingField(fieldName)}
              type="button"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    );
  };

  /// Función especial para renderizar el campo de imagen
  const renderImageField = () => {
    const isEditing = editingField === 'imagen';
    const hasPendingChanges = pendingChanges.imagen !== undefined;

    const currentImageSrc = (() => {
      if (previewUrl) {
        return previewUrl;
      }
      if (formData.imagen instanceof File) {
        return URL.createObjectURL(formData.imagen);
      }
      if (typeof formData.imagen === 'string') {
        return formData.imagen;
      }
      return null;
    })();

    return (
      <div className="md:w-1/3 flex flex-col gap-4">
        {/* Contenedor de la imagen */}
        <div className="aspect-[4/3] overflow-hidden rounded-xl border bg-gray-100 flex items-center justify-center relative">
          {currentImageSrc ? (
            <img
              src={currentImageSrc}
              alt={formData.nombre}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400">Imagen del evento</span>
          )}
        </div>

        {/* Controles de edición de la imagen */}
        <div className="flex flex-col gap-2">
          {!isEditing ? (
            <button
              onClick={() => setEditingField('imagen')}
              className={btnPrimary}
              type="button"
            >
              <Upload className="w-4 h-4" />
              Cambiar imagen
            </button>
          ) : (
            <>
              {/* Contenedor del input de archivo y los botones */}
              <label className="p-3 bg-white rounded-xl shadow hover:bg-gray-100 cursor-pointer flex items-center justify-center border border-gray-200 text-gray-700 font-medium">
                <Upload className="w-4 h-4 mr-2" />
                Seleccionar nuevo archivo
                <input
                  type="file"
                  accept="image/png,image/jpg,image/jpeg,image/gif"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>

              {/* Muestra la advertencia y el error debajo del input */}
              {imageError && (
                <div className="flex items-center gap-2 text-red-600 text-xs p-2 rounded bg-red-50 border border-red-200">
                  <AlertTriangle className="w-4 h-4" />
                  {imageError}
                </div>
              )}
              {!imageError && (
                <div className="flex items-center gap-2 text-gray-600 text-xs">
                  <AlertTriangle className="w-4 h-4" />
                  Solo PNG, JPG, JPEG, GIF - Máx 5MB
                </div>
              )}

              {/* Botones de guardar y cancelar */}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => saveField('imagen')}
                  className={btnGhostGreen}
                  type="button"
                  disabled={!hasPendingChanges}
                >
                  <Save className="w-4 h-4" />
                  Guardar
                </button>
                <button
                  onClick={() => cancelEdit('imagen')}
                  className={btnGhostGray}
                  type="button"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Head title={`Editar ${event.nombre}`} />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Link
          href="/events"
          className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Link>

        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${event.estado === 'activo'
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
          }`}>
          {event.estado === 'activo' ? '● Activo' : '● Inactivo'}
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 space-y-6">
        {/* Card con imagen + detalles */}
        <Card className="p-6 flex flex-col md:flex-row gap-6">
          {/* Imagen con nueva funcionalidad */}
          {renderImageField()}

          {/* Detalles derecha */}
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderEditableField('nombre', 'Event Name', <Pencil className="w-5 h-5 mr-2 text-gray-500" />)}
            {renderEditableField('fecha', 'Event Date', <Calendar className="w-5 h-5 mr-2 text-gray-500" />, 'date')}
            {renderEditableField('hora', 'Event Time', <Clock className="w-5 h-5 mr-2 text-gray-500" />, 'time')}
            {renderEditableField('ubicacion', 'Event Venue', <MapPin className="w-5 h-5 mr-2 text-gray-500" />)}
            {renderEditableField('organizador', 'Organizer', <User className="w-5 h-5 mr-2 text-gray-500" />)}
            {renderEditableField('tipo_actividad', 'Activity Type', <Tag className="w-5 h-5 mr-2 text-gray-500" />)}
            {renderEditableField('capacidad_maxima', 'Max Capacity', <Users className="w-5 h-5 mr-2 text-gray-500" />, 'number')}
            {renderEditableField('estado', 'Status', <Activity className="w-5 h-5 mr-2 text-gray-500" />, 'text', true, [
              { value: 'activo', label: 'Activo' },
              { value: 'inactivo', label: 'Inactivo' }
            ])}
          </div>
        </Card>

        {/* Descripción */}
        <Card className="relative">
          <CardHeader>
            <CardTitle>Event Description</CardTitle>
          </CardHeader>
          <CardContent>
            {editingField === 'descripcion' ? (
              <div className="space-y-2">
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  autoFocus
                  className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-blue-300"
                  rows={4}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveField('descripcion')}
                    className={btnGhostGreen}
                    type="button"
                    disabled={!pendingChanges.descripcion}
                  >
                    <Save className="w-4 h-4" />
                    Guardar
                  </button>
                  <button
                    onClick={() => cancelEdit('descripcion')}
                    className={btnGhostGray}
                    type="button"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700">{formData.descripcion}</p>
            )}
          </CardContent>
          <button
            className="absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-700"
            onClick={() => setEditingField('descripcion')}
            type="button"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </Card>

        {/* Layout de Mapa + Comentarios lado a lado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mapa */}
          {formData.ubicacion && (
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Event Map</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-72 w-full rounded-xl border overflow-hidden">
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(formData.ubicacion as string)}&output=embed`}
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

          {/* Moderación de Comentarios */}
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Comentarios (moderación)</CardTitle>
                <span className="text-sm text-gray-500">{comments.length} total</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col">
              {/* Agregar comentario */}
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
              <div className="flex-1 max-h-96 overflow-y-auto pr-2 space-y-3">
                {comments.length > 0 ? (
                  comments.map((c) => {
                    const isEditing = editingCommentId === c.id;
                    return (
                      <div key={c.id} className="p-3 bg-gray-50 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-gray-700 font-medium">{c.usuario}</div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            {!c.activo && (
                              <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs">
                                Inactivo
                              </span>
                            )}
                            {c.editado && (
                              <span className="flex items-center gap-1">
                                <Edit className="w-3 h-3" />
                                editado
                              </span>
                            )}
                            <span>{formatCommentDate(c.created_at)}</span>
                          </div>
                        </div>

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
                              {c.activo && (
                                <button
                                  onClick={() => deleteComment(c.id)}
                                  className={btnGhostRed}
                                  type="button"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Desactivar
                                </button>
                              )}
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
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No hay comentarios aún.</p>
                    <p className="text-sm">¡Agrega el primer comentario!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}