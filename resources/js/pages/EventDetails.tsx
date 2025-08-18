import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { format, parseISO} from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft } from 'lucide-react';

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

export default function EventDetails({ event }: Props) {
    if (!event) return <p>Evento no encontrado.</p>;

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
                                {event.hora ?? "00:00:00"}
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

                {/* Mapa */}
                {event.ubicacion && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Event Map</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="h-72 w-full rounded-xl border overflow-hidden">
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
            </div>
        </>
    );
}
