<?php

namespace Database\Seeders;

use App\Models\Event;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear eventos de ejemplo usando la factory
        Event::factory(15)->create();

        // Crear algunos eventos específicos con datos realistas
        Event::create([
            'nombre' => 'Taller de Compostaje Urbano',
            'fecha' => now()->addDays(7),
            'ubicacion' => 'Parque Central, Madrid',
            'descripcion' => 'Aprende a crear tu propio compost en casa. Ideal para reducir residuos y crear abono natural para tus plantas.',
            'tipo_actividad' => 'Taller',
            'organizador' => 'EcoMadrid',
            'capacidad_maxima' => 25,
            'estado' => 'activo',
            'comments_count' => 0,
        ]);

        Event::create([
            'nombre' => 'Conferencia: Sostenibilidad en la Ciudad',
            'fecha' => now()->addDays(14),
            'ubicacion' => 'Centro Cultural, Barcelona',
            'descripcion' => 'Charlas sobre iniciativas sostenibles en entornos urbanos. Expertos compartirán experiencias y mejores prácticas.',
            'tipo_actividad' => 'Conferencia',
            'organizador' => 'Green Barcelona',
            'capacidad_maxima' => 100,
            'estado' => 'activo',
            'comments_count' => 0,
        ]);

        Event::create([
            'nombre' => 'Limpieza de Playa',
            'fecha' => now()->addDays(3),
            'ubicacion' => 'Playa de la Barceloneta, Barcelona',
            'descripcion' => 'Únete a nuestra iniciativa de limpieza de playas. Ayudemos a mantener nuestras costas limpias y proteger la vida marina.',
            'tipo_actividad' => 'Voluntariado',
            'organizador' => 'Mar Limpio',
            'capacidad_maxima' => 50,
            'estado' => 'activo',
            'comments_count' => 0,
        ]);

        Event::create([
            'nombre' => 'Mercado de Productos Locales',
            'fecha' => now()->addDays(5),
            'ubicacion' => 'Plaza Mayor, Valencia',
            'descripcion' => 'Mercado de productos frescos y locales. Apoya a productores locales y reduce la huella de carbono de tus alimentos.',
            'tipo_actividad' => 'Mercado',
            'organizador' => 'Valencia Local',
            'capacidad_maxima' => 200,
            'estado' => 'activo',
            'comments_count' => 0,
        ]);

        Event::create([
            'nombre' => 'Webinar: Energías Renovables',
            'fecha' => now()->addDays(10),
            'ubicacion' => 'Online (Zoom)',
            'descripcion' => 'Descubre las últimas tendencias en energías renovables y cómo implementarlas en tu hogar o negocio.',
            'tipo_actividad' => 'Webinar',
            'organizador' => 'Energía Verde',
            'capacidad_maxima' => 150,
            'estado' => 'activo',
            'comments_count' => 0,
        ]);
    }
}
