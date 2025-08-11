<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faqs = [
            [
                'pregunta' => '¿Qué son los eventos sostenibles?',
                'respuesta' => 'Los eventos sostenibles son actividades que se organizan considerando el impacto ambiental, social y económico. Se caracterizan por minimizar el uso de recursos naturales, promover la participación comunitaria y generar beneficios duraderos para la sociedad.',
                'categoria' => 'Sostenibilidad',
                'orden' => 1,
                'activo' => true,
            ],
            [
                'pregunta' => '¿Cómo puedo participar en un evento?',
                'respuesta' => 'Para participar en un evento, simplemente regístrate en nuestra plataforma, busca eventos en tu área de interés y haz clic en "Participar". Recibirás confirmación por email y podrás acceder a toda la información del evento.',
                'categoria' => 'Participación',
                'orden' => 2,
                'activo' => true,
            ],
            [
                'pregunta' => '¿Los eventos son gratuitos?',
                'respuesta' => 'La mayoría de nuestros eventos son gratuitos, pero algunos pueden tener un costo mínimo para cubrir materiales o gastos de organización. El precio siempre se indica claramente en la descripción del evento.',
                'categoria' => 'General',
                'orden' => 3,
                'activo' => true,
            ],
            [
                'pregunta' => '¿Qué debo llevar a un evento?',
                'respuesta' => 'Depende del tipo de evento. Para eventos al aire libre, recomendamos ropa cómoda, calzado adecuado, agua y protección solar. Para talleres, solo necesitas tu entusiasmo y ganas de aprender.',
                'categoria' => 'Eventos',
                'orden' => 4,
                'activo' => true,
            ],
            [
                'pregunta' => '¿Puedo cancelar mi participación?',
                'respuesta' => 'Sí, puedes cancelar tu participación hasta 24 horas antes del evento. Esto nos ayuda a organizar mejor y dar oportunidad a otros participantes en la lista de espera.',
                'categoria' => 'Participación',
                'orden' => 5,
                'activo' => true,
            ],
            [
                'pregunta' => '¿Cómo se organizan los eventos?',
                'respuesta' => 'Los eventos son organizados por miembros de la comunidad, organizaciones locales y voluntarios comprometidos con la sostenibilidad. Cada evento tiene un coordinador responsable que supervisa la logística y asegura que todo funcione correctamente.',
                'categoria' => 'Eventos',
                'orden' => 6,
                'activo' => true,
            ],
            [
                'pregunta' => '¿Qué pasa si llueve el día del evento?',
                'respuesta' => 'En caso de mal tiempo, los eventos al aire libre pueden ser reprogramados o movidos a un lugar cubierto. Siempre te notificaremos con anticipación sobre cualquier cambio.',
                'categoria' => 'Eventos',
                'orden' => 7,
                'activo' => true,
            ],
            [
                'pregunta' => '¿Puedo sugerir ideas para nuevos eventos?',
                'respuesta' => '¡Absolutamente! Nos encanta recibir sugerencias de la comunidad. Puedes enviar tus ideas a través de nuestro formulario de contacto o hablando directamente con los organizadores en cualquier evento.',
                'categoria' => 'Participación',
                'orden' => 8,
                'activo' => true,
            ],
            [
                'pregunta' => '¿Cómo se garantiza la seguridad en los eventos?',
                'respuesta' => 'La seguridad es nuestra prioridad. Todos los eventos cuentan con protocolos de seguridad, personal capacitado y planes de emergencia. Además, seguimos las recomendaciones de las autoridades locales.',
                'categoria' => 'General',
                'orden' => 9,
                'activo' => true,
            ],
            [
                'pregunta' => '¿Los eventos son accesibles para personas con discapacidad?',
                'respuesta' => 'Sí, nos esforzamos por hacer que todos nuestros eventos sean accesibles. Si tienes necesidades específicas, contáctanos con anticipación para que podamos hacer los ajustes necesarios.',
                'categoria' => 'Participación',
                'orden' => 10,
                'activo' => true,
            ],
        ];

        foreach ($faqs as $faq) {
            Faq::create($faq);
        }

        // Crear algunas FAQs adicionales usando la factory
        Faq::factory(5)->create();
    }
} 