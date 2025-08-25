import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/text-area";
import { Calendar, MapPin, Pencil, Tag, Upload, Clock, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type EventData = {
  nombre: string;
  fecha: string;
  ubicacion: string;
  descripcion: string;
  imagen?: string | null; // Base64 string
  tipo_actividad: string;
  organizador: string;
  capacidad_maxima: number;
  estado: "activo" | "inactivo";
  hora: string;
};

interface EventFormProps {
  mode: "create" | "edit";
  initialData?: EventData;
  onSubmit: (data: EventData) => void;
}

export default function Event({ mode, initialData, onSubmit }: EventFormProps) {
  const [formData, setFormData] = useState<EventData>(
    initialData ?? {
      nombre: "",
      fecha: "",
      ubicacion: "",
      descripcion: "",
      imagen: null,
      tipo_actividad: "",
      organizador: "",
      capacidad_maxima: 1,
      estado: "activo",
      hora: "",
    }
  );

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData?.imagen ? initialData.imagen : null
  );
  const [imageError, setImageError] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError("");
    
    if (!file) {
      setFormData((prev) => ({ ...prev, imagen: null }));
      setPreviewUrl(null);
      return;
    }

    const error = validateImage(file);
    if (error) {
      setImageError(error);
      e.target.value = ""; // Limpiar input
      return;
    }

    try {
      const base64 = await convertToBase64(file);
      setFormData((prev) => ({ ...prev, imagen: base64 }));
      setPreviewUrl(base64);
    } catch (error) {
      setImageError("Error al procesar la imagen");
      console.error("Error converting to base64:", error);
    }
  };

  const handleEstadoChange = (value: "activo" | "inactivo") => {
    setFormData((prev) => ({ ...prev, estado: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos requeridos
    if (!formData.nombre || !formData.fecha || !formData.ubicacion || !formData.descripcion) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    // Asegurar que todos los campos estén incluidos
    const submitData: EventData = {
      nombre: formData.nombre,
      fecha: formData.fecha,
      ubicacion: formData.ubicacion,
      descripcion: formData.descripcion,
      imagen: formData.imagen,
      tipo_actividad: formData.tipo_actividad,
      organizador: formData.organizador,
      capacidad_maxima: Number(formData.capacidad_maxima),
      estado: formData.estado,
      hora: formData.hora,
    };

    console.log("Enviando datos:", submitData); // Debug
    onSubmit(submitData);
  };

  return (
    <div className="space-y-6">
      {/* Header dinámico */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {mode === "create" ? "Create Event" : "Edit Event"}
        </h1>
        <Button onClick={handleSubmit} className="rounded-2xl px-6">
          {mode === "create" ? "Save" : "Update"}
        </Button>
      </div>

      {/* Imagen + Campos */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Imagen */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardContent className="p-3">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border bg-muted/30 flex items-center justify-center">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Upload className="w-6 h-6 mb-2" />
                    <span>Upload image</span>
                  </div>
                )}
              </div>
              <div className="mt-3 space-y-2">
                <input
                  id="imagen"
                  type="file"
                  accept="image/png,image/jpg,image/jpeg,image/gif"
                  onChange={handleImage}
                  className="hidden"
                />
                <Label
                  htmlFor="imagen"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted/50"
                >
                  <Upload className="w-4 h-4" />
                  Choose file
                </Label>
                {imageError && (
                  <div className="flex items-center gap-2 text-red-600 text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    {imageError}
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  PNG, JPG, JPEG, GIF - Max 5MB
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campos */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nombre */}
          <div>
            <Label className="mb-1 block">Event Name</Label>
            <div className="relative">
              <Input
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Event name"
                className="pr-10"
                required
              />
              <Pencil className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Fecha */}
          <div>
            <Label className="mb-1 block">Event Date</Label>
            <div className="relative">
              <Input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className="pr-10 cursor-pointer"
                required
                onClick={(e) => {
                  e.currentTarget.showPicker?.();
                }}
              />
              <Calendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Hora */}
          <div>
            <Label className="mb-1 block">Event Time</Label>
            <div className="relative">
              <Input
                type="time"
                name="hora"
                value={formData.hora}
                onChange={handleChange}
                className="pr-10 cursor-pointer"
                onClick={(e) => {
                  e.currentTarget.showPicker?.();
                }}
              />
              <Clock className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Ubicación */}
          <div>
            <Label className="mb-1 block">Event Venue</Label>
            <div className="relative">
              <Input
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
                placeholder="Venue / address"
                className="pr-10"
                required
              />
              <MapPin className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Organizador */}
          <div>
            <Label className="mb-1 block">Organizer</Label>
            <div className="relative">
              <Input
                name="organizador"
                value={formData.organizador}
                onChange={handleChange}
                placeholder="Organizer name"
                className="pr-10"
                required
              />
            </div>
          </div>

          {/* Tipo de actividad */}
          <div>
            <Label className="mb-1 block">Activity Type</Label>
            <div className="relative">
              <Input
                name="tipo_actividad"
                value={formData.tipo_actividad}
                onChange={handleChange}
                placeholder="Workshop, Talk, Meetup…"
                className="pr-10"
                required
              />
              <Tag className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Capacidad máxima */}
          <div>
            <Label className="mb-1 block">Max Capacity</Label>
            <Input
              type="number"
              name="capacidad_maxima"
              value={formData.capacidad_maxima}
              onChange={handleChange}
              min={1}
              required
            />
          </div>

          {/* Estado */}
          <div>
            <Label className="mb-1 block">Status</Label>
            <Select
              value={formData.estado}
              onValueChange={(v) =>
                handleEstadoChange(v as "activo" | "inactivo")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Descripción */}
      <div className="space-y-2">
        <Label>Event Description</Label>
        <Textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows={4}
          placeholder="Write a short description..."
          className="rounded-xl"
          required
        />
      </div>

      {/* Mapa dinámico */}
      {formData.ubicacion && (
        <Card>
          <CardContent className="p-6">
            <div className="h-64 w-full rounded-xl border overflow-hidden">
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
  );
}