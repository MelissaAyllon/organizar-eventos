import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, ArrowLeft, Eye, CornerUpLeft } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface Event {
  id: number;
  nombre: string;
  fecha: string; // ISO
  ubicacion: string;
  descripcion: string;
  hora?: string;
  imagen?: string;
}

interface Props {
  event?: Event;
}

export default function EventDetails({ event }: Props) {
  const [showAllComments, setShowAllComments] = useState(false);

  if (!event) return <p>Evento no encontrado.</p>;

  // Comentarios de ejemplo
  const comentarios = [
    { usuario: 'Ana', texto: '✨ Muy buen evento, me encantó la organización.' },
    { usuario: 'Luis', texto: '📌 Espero que lo repitan el próximo año.' },
    { usuario: 'María', texto: '👏 Excelente ambiente y actividades.' },
    { usuario: 'Jorge', texto: '🎶 La música estuvo increíble.' },
    { usuario: 'Valentina', texto: '🍔 La comida fue deliciosa, gran selección.' },
    { usuario: 'Pedro', texto: '🙌 Voluntarios súper atentos y amables.' },
    { usuario: 'Sofía', texto: '🧼 Los baños estaban limpios todo el tiempo.' },
    { usuario: 'Diego', texto: '🗺️ La señalética ayudó un montón a ubicarse.' },
    { usuario: 'Lucía', texto: '📷 Tomé fotos hermosas, la iluminación perfecta.' },
    { usuario: 'Carlos', texto: '🚗 Estacionamiento amplio, sin demoras al salir.' },
    { usuario: 'Elena', texto: '🕒 Todo a tiempo, agenda bien cumplida.' },
    { usuario: 'Mateo', texto: '🎁 Los sorteos estuvieron divertidos.' },
  ];

  const VISIBLE_COMMENTS = 3;
  const displayed = showAllComments ? comentarios : comentarios.slice(0, VISIBLE_COMMENTS);

  // estilos de botones
  const btnBase =
    'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2';
  const btnGhostBlue =
    `${btnBase} border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 focus:ring-blue-300`;
  const btnGhostGray =
    `${btnBase} border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 focus:ring-gray-300`;
  const btnPrimary =
    'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 shadow-sm';

  return (
    <>
      <Head title={event.nombre} />

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
          <div className="md:w-1/3 aspect-[4/3] overflow-hidden rounded-xl border bg-gray-100 flex items-center justify-center">
            {event.imagen ? (
              <img src={event.imagen} alt={event.nombre} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400">Imagen del evento</span>
            )}
          </div>

          {/* Detalles derecha */}
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-md font-medium text-gray-500">Event Name</p>
              <p className="mt-1 text-lg font-semibold text-gray-800">{event.nombre}</p>
            </div>

            <div>
              <p className="text-md font-medium text-gray-500">Event Date</p>
              <div className="mt-1 flex items-center text-lg text-gray-800">
                <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                {format(parseISO(event.fecha), "EEEE, d 'de' MMMM yyyy", { locale: es })}
              </div>
            </div>

            <div>
              <p className="text-md font-medium text-gray-500">Event Venue</p>
              <div className="mt-1 flex items-center text-lg text-gray-800">
                <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                {event.ubicacion}
              </div>
            </div>

            <div>
              <p className="text-md font-medium text-gray-500">Event Time</p>
              <div className="mt-1 flex items-center text-lg text-gray-800">
                <Clock className="w-5 h-5 mr-2 text-gray-500" />
                {event.hora ?? '00:00:00'}
              </div>
            </div>
          </div>
        </Card>

        {/* Descripción */}
        <Card>
          <CardHeader>
            <CardTitle>Event Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{event.descripcion}</p>
          </CardContent>
        </Card>

        {/* Mapa + Comentarios lado a lado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mapa */}
          {event.ubicacion && (
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Event Map</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-100 w-full rounded-xl border overflow-hidden">
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(event.ubicacion)}&output=embed`}
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

          {/* Comentarios */}
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Comentarios</CardTitle>
                <span className="text-sm text-gray-500">{comentarios.length} comentarios</span>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              {/* Vista expandida: botón Volver arriba-izquierda */}
              {showAllComments && (
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowAllComments(false)}
                    className={btnGhostGray}
                    aria-label="Volver a vista normal"
                  >
                    <CornerUpLeft className="w-4 h-4" />
                    Volver
                  </button>
                </div>
              )}

              {/* Input + fila de botones (solo en vista normal) */}
              {!showAllComments && (
                <>
                  <textarea
                    className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                    placeholder="Escribe un comentario..."
                    rows={3}
                  ></textarea>

                  {/* fila con Ver todos (izquierda) y Publicar (derecha) */}
                  <div className="mt-1 flex items-center justify-between">
                    <button
                      onClick={() => setShowAllComments(true)}
                      className={btnGhostBlue}
                      aria-label="Ver todos los comentarios"
                    >
                      <Eye className="w-4 h-4" />
                      Ver todos
                    </button>

                    <button className={btnPrimary}>
                      Publicar
                    </button>
                  </div>
                </>
              )}

              {/* Lista de comentarios */}
              <div
                className={
                  showAllComments
                    ? 'mt-2 space-y-2 max-h-96 overflow-y-auto pr-2'
                    : 'mt-2 space-y-2'
                }
              >
                {displayed.map((c, i) => (
                  <div key={i} className="p-3 bg-gray-100 rounded-lg shadow-[inset_0_1px_0_rgba(255,255,255,.4)]">
                    <p className="text-sm text-gray-800">{c.texto}</p>
                    <span className="text-xs text-gray-500">— {c.usuario}</span>
                  </div>
                ))}

                {/* Indicador de que hay más (solo en vista normal) */}
                {!showAllComments && comentarios.length > VISIBLE_COMMENTS && (
                  <p className="text-xs text-gray-500 mt-1">Hay más comentarios…</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
