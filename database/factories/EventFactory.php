<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tiposActividad = [
            'Taller', 'Conferencia', 'Seminario', 'Webinar', 'Voluntariado', 
            'Mercado', 'Charla', 'Curso', 'Excursión', 'Limpieza'
        ];
        
        $organizadores = [
            'EcoMadrid', 'Green Barcelona', 'Valencia Sostenible', 'Sevilla Verde',
            'Bilbao Eco', 'Málaga Natural', 'Zaragoza Verde', 'Murcia Sostenible',
            'Las Palmas Eco', 'Santa Cruz Verde', 'Asociación EcoLocal', 'Fundación Verde'
        ];
        
        $ubicaciones = [
            'Parque Central, Madrid', 'Centro Cultural, Barcelona', 'Plaza Mayor, Valencia',
            'Jardín Botánico, Sevilla', 'Parque de Doña Casilda, Bilbao', 'Paseo del Parque, Málaga',
            'Plaza del Pilar, Zaragoza', 'Jardín del Malecón, Murcia', 'Parque Doramas, Las Palmas',
            'Plaza de España, Santa Cruz', 'Online (Zoom)', 'Online (Teams)'
        ];

        return [
            'nombre' => $this->faker->randomElement([
                'Taller de ', 'Conferencia: ', 'Seminario sobre ', 'Webinar: ', 
                'Limpieza de ', 'Mercado de ', 'Charla sobre ', 'Curso de '
            ]) . $this->faker->randomElement([
                'Compostaje Urbano', 'Sostenibilidad en la Ciudad', 'Energías Renovables',
                'Productos Locales', 'Reciclaje Creativo', 'Huertos Urbanos', 'Movilidad Sostenible',
                'Consumo Responsable', 'Biodiversidad Urbana', 'Economía Circular'
            ]),
            'fecha' => $this->faker->dateTimeBetween('now', '+3 months'),
            'ubicacion' => $this->faker->randomElement($ubicaciones),
            'descripcion' => $this->faker->paragraph(3) . ' ' . $this->faker->randomElement([
                'Ideal para reducir residuos y crear un impacto positivo en el medio ambiente.',
                'Únete a nuestra iniciativa para promover la sostenibilidad en la comunidad.',
                'Aprende prácticas sostenibles que puedes implementar en tu día a día.',
                'Contribuye a crear un futuro más verde y sostenible para todos.',
                'Descubre nuevas formas de cuidar nuestro planeta de manera práctica.'
            ]),
            'tipo_actividad' => $this->faker->randomElement($tiposActividad),
            'organizador' => $this->faker->randomElement($organizadores),
            'capacidad_maxima' => $this->faker->numberBetween(10, 200),
            'estado' => $this->faker->randomElement(['activo', 'activo', 'activo', 'inactivo']), // Más probabilidad de activo
            'comments_count' => $this->faker->numberBetween(0, 50),
        ];
    }
}
