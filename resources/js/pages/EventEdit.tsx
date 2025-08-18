import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Pencil } from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft } from "lucide-react";

interface Event {
  id: number;
  nombre: string;
  fecha: string; // formato ISO string
  ubicacion: string;
  descripcion: string;
  hora?: string;
  imagen?: string;
}

interface Props {
  event?: Event;
}

export default function EventEdit({ event }: Props) {
  if (!event) return <p>Evento no encontrado.</p>;

  // Estado de edición
  const [editingField, setEditingField] = useState<string | null>(null);
  const [formData, setFormData] = useState<Event>({ ...event });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setFormData((prev) => ({ ...prev, imagen: url }));
    }
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
      </div>

      <div className="container mx-auto px-4 py-4 space-y-6">
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
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    formData.ubicacion
                  )}&output=embed`}
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
      </div>
    </>
  );
}
