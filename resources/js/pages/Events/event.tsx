import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/text-area";
import { Calendar, MapPin, Pencil, Upload } from "lucide-react";

type EventData = {
  nombre: string;
  fecha: string;
  ubicacion: string;
  descripcion: string;
  imagen?: File | null;
};

interface EventFormProps {
  mode: "create" | "edit";
  initialData?: EventData;
  onSubmit: (data: EventData) => void;
}

export default function Event({ mode, initialData, onSubmit }: EventFormProps) {
  const [formData, setFormData] = useState<EventData>(
    initialData || {
      nombre: "",
      fecha: "",
      ubicacion: "",
      descripcion: "",
      imagen: null,
    }
  );

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData?.imagen ? URL.createObjectURL(initialData.imagen) : null
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFormData((p) => ({ ...p, imagen: file }));
    if (file) setPreviewUrl(URL.createObjectURL(file));
    else setPreviewUrl(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Header dinámico */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {mode === "create" ? "Create Event" : "Edit Event"}
          </h1>
          <Button type="submit" className="rounded-2xl px-6">
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
                <div className="mt-3">
                  <input
                    id="imagen"
                    type="file"
                    accept="image/*"
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
                  className="pr-10"
                />
                <Calendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                />
                <MapPin className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
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
    </form>
  );
}
