import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Search, Filter, Plus, HelpCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Event {
  id: number;
  nombre: string;
  fecha: string;
  ubicacion: string;
  descripcion: string;
  tipo_actividad: string;
  organizador: string;
  capacidad_maxima: number;
  estado: string;
  comments_count?: number;
}

interface Props {
  events: Event[];
}

export default function EventsIndex({ events }: Props) {
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [faqs, setFaqs] = useState<any[]>([]);
  const [showFaqs, setShowFaqs] = useState(false);

  const eventTypes = Array.from(new Set(events.map(event => event.tipo_actividad).filter(Boolean)));
  const eventStatuses = ['activo', 'cancelado', 'completado'];

  const fetchFAQs = async () => {
    try {
      const response = await fetch('/api/faqs/public');
      const data = await response.json();
      if (data.success) {
        setFaqs(data.data.slice(0, 3)); // Solo las primeras 3 FAQs
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  useEffect(() => {
    let filtered = events;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(event => event.tipo_actividad === selectedType);
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(event => event.estado === selectedStatus);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, selectedType, selectedStatus]);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const getStatusBadge = (status: string) => {
    const variants = {
      activo: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800',
      completado: 'bg-blue-100 text-blue-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-purple-100 text-purple-800';
    }
  };

  return (
    <>
      <Head title="Eventos Sostenibles" />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Eventos Sostenibles</h1>
            <p className="text-gray-600 mt-2">
              Descubre y participa en eventos que promueven la sostenibilidad
            </p>
          </div>
          <Button asChild>
            <Link href="/events/create">
              <Plus className="w-4 h-4 mr-2" />
              Crear Evento
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Actividad
              </label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {eventTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  {eventStatuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
                  setSelectedStatus('all');
                }}
                className="w-full"
              >
                <Filter className="w-4 h-4 mr-2" />
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Mostrando {filteredEvents.length} de {events.length} eventos
          </p>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron eventos
            </h3>
            <p className="text-gray-600">
              Intenta ajustar los filtros o crear un nuevo evento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getStatusBadge(event.estado)}>
                      {event.estado.charAt(0).toUpperCase() + event.estado.slice(1)}
                    </Badge>
                    {event.tipo_actividad && (
                      <Badge variant="secondary" className={getTypeBadge(event.tipo_actividad)}>
                        {event.tipo_actividad}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl line-clamp-2">{event.nombre}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {event.descripcion}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {format(new Date(event.fecha), 'EEEE, d \'de\' MMMM, yyyy', { locale: es })}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="line-clamp-1">{event.ubicacion}</span>
                    </div>

                    {event.capacidad_maxima && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        Capacidad: {event.capacidad_maxima} personas
                      </div>
                    )}

                    {event.organizador && (
                      <p className="text-sm text-gray-600">
                        Organizado por: {event.organizador}
                      </p>
                    )}

                    {event.comments_count !== undefined && (
                      <p className="text-sm text-gray-600">
                        {event.comments_count} comentario{event.comments_count !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button asChild variant="outline" className="flex-1">
                      <Link href={`/events/${event.id}`}>
                        Ver Detalles
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1">
                      <Link href={`/admin/events/${event.id}/edit`}>
                        Editar
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* FAQs Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Preguntas Frecuentes
            </h2>
            <p className="text-gray-600">
              Resolvemos tus dudas sobre eventos sostenibles
            </p>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {faqs.map((faq, index) => (
                <div key={faq.id} className="text-center">
                  <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <HelpCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    {faq.pregunta}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {faq.respuesta}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-6">
              <Button
                variant="outline"
                onClick={() => setShowFaqs(!showFaqs)}
                className="mr-4"
              >
                {showFaqs ? 'Ocultar' : 'Ver más'} FAQs
              </Button>
              <Button asChild>
                <Link href="/faqs">
                  Ver todas las FAQs
                </Link>
              </Button>
            </div>

            {showFaqs && (
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {faq.pregunta}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {faq.respuesta}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 