import React from 'react';
import EventsIndex from './Events/Index';

const Events: React.FC = () => {
    const events = [
        {
            id: 1,
            nombre: 'Eco-Conferencia 2025',
            fecha: '2025-09-20',
            ubicacion: 'Ciudad Verde',
            descripcion: 'Una conferencia sobre sostenibilidad.',
            tipo_actividad: 'conferencia',
            organizador: 'Green Org',
            capacidad_maxima: 300,
            estado: 'activo',
            comments_count: 5,
        },
        // You can add more mock events here...
    ];

    return <EventsIndex events={events} />;
};

export default Events;
