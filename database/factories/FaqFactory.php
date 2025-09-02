<?php

namespace Database\Factories;

use App\Models\Faq;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Faq>
 */
class FaqFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $preguntas = [
            '¿Qué son los eventos sostenibles?',
            '¿Cómo puedo participar en un evento?',
            '¿Los eventos son gratuitos?',
            '¿Qué debo llevar a un evento?',
            '¿Puedo cancelar mi participación?',
            '¿Cómo se organizan los eventos?',
            '¿Qué pasa si llueve el día del evento?',
            '¿Puedo sugerir ideas para nuevos eventos?',
            '¿Cómo se garantiza la seguridad en los eventos?',
            '¿Los eventos son accesibles para personas con discapacidad?',
            '¿Qué tipos de actividades se organizan?',
            '¿Cómo puedo ser voluntario?',
            '¿Hay eventos para niños?',
            '¿Qué beneficios tiene participar?',
            '¿Cómo me mantengo informado de nuevos eventos?'
        ];

        $respuestas = [
            'Los eventos sostenibles son actividades que se organizan considerando el impacto ambiental, social y económico.',
            'Para participar, simplemente regístrate en nuestra plataforma y busca eventos en tu área de interés.',
            'La mayoría de nuestros eventos son gratuitos, pero algunos pueden tener un costo mínimo.',
            'Depende del tipo de evento, pero recomendamos ropa cómoda y ganas de aprender.',
            'Sí, puedes cancelar tu participación hasta 24 horas antes del evento.',
            'Los eventos son organizados por miembros de la comunidad y organizaciones locales.',
            'En caso de mal tiempo, los eventos pueden ser reprogramados o movidos a un lugar cubierto.',
            '¡Absolutamente! Nos encanta recibir sugerencias de la comunidad.',
            'La seguridad es nuestra prioridad con protocolos y personal capacitado.',
            'Sí, nos esforzamos por hacer que todos nuestros eventos sean accesibles.',
            'Organizamos talleres, conferencias, voluntariados, mercados y muchas actividades más.',
            'Puedes contactarnos a través de nuestro formulario o en cualquier evento.',
            'Sí, tenemos eventos especialmente diseñados para familias y niños.',
            'Participar te permite aprender, conectar con la comunidad y contribuir al medio ambiente.',
            'Puedes suscribirte a nuestro newsletter o seguirnos en redes sociales.'
        ];

        return [
            'pregunta' => $this->faker->randomElement($preguntas),
            'respuesta' => $this->faker->randomElement($respuestas) . ' ' . $this->faker->paragraph(2),
        ];
    }
} 