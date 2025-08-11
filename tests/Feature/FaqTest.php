<?php

namespace Tests\Feature;

use App\Models\Faq;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FaqTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Crear un usuario para las pruebas con email verificado
        $this->user = User::factory()->create([
            'email_verified_at' => now(), // Asegurar que el email esté verificado
        ]);
    }

    /** @test */
    public function puede_ver_faqs_publicas()
    {
        // Crear algunas FAQs
        Faq::factory(3)->activa()->create();

        $response = $this->get('/api/faqs/public');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        '*' => ['id', 'pregunta', 'respuesta', 'categoria', 'orden', 'activo']
                    ]
                ]);
    }

    /** @test */
    public function puede_ver_faqs_por_categoria()
    {
        // Crear FAQs de diferentes categorías
        Faq::factory()->categoria('Eventos')->activa()->create();
        Faq::factory()->categoria('Participación')->activa()->create();

        $response = $this->get('/api/faqs/categoria/Eventos');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data'
                ])
                ->assertJsonCount(1, 'data');
    }

    /** @test */
    public function puede_ver_categorias_disponibles()
    {
        // Crear FAQs con diferentes categorías
        Faq::factory()->categoria('Eventos')->create();
        Faq::factory()->categoria('Participación')->create();
        Faq::factory()->categoria('Sostenibilidad')->create();

        $response = $this->get('/api/faqs/categorias');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data'
                ]);
    }

    /** @test */
    public function usuario_autenticado_puede_ver_lista_completa_de_faqs()
    {
        $this->actingAs($this->user);

        Faq::factory(5)->create();

        $response = $this->get('/api/faqs');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data',
                    'pagination'
                ]);
    }

    /** @test */
    public function usuario_autenticado_puede_crear_faq()
    {
        $this->actingAs($this->user);

        $faqData = [
            'pregunta' => '¿Nueva pregunta de prueba?',
            'respuesta' => 'Esta es una respuesta de prueba para la nueva pregunta.',
            'categoria' => 'Prueba',
            'orden' => 1,
            'activo' => true,
        ];

        $response = $this->post('/api/faqs', $faqData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data'
                ]);

        $this->assertDatabaseHas('faqs', $faqData);
    }

    /** @test */
    public function usuario_autenticado_puede_actualizar_faq()
    {
        $this->actingAs($this->user);

        $faq = Faq::factory()->create();
        $updateData = [
            'pregunta' => 'Pregunta actualizada',
            'respuesta' => 'Respuesta actualizada',
        ];

        $response = $this->put("/api/faqs/{$faq->id}", $updateData);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data'
                ]);

        $this->assertDatabaseHas('faqs', $updateData);
    }

    /** @test */
    public function usuario_autenticado_puede_eliminar_faq()
    {
        $this->actingAs($this->user);

        $faq = Faq::factory()->create();

        $response = $this->delete("/api/faqs/{$faq->id}");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'message'
                ]);

        $this->assertDatabaseMissing('faqs', ['id' => $faq->id]);
    }

    /** @test */
    public function usuario_autenticado_puede_cambiar_estado_de_faq()
    {
        $this->actingAs($this->user);

        $faq = Faq::factory()->activa()->create();

        $response = $this->patch("/api/faqs/{$faq->id}/toggle-status");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data'
                ]);

        $this->assertDatabaseHas('faqs', [
            'id' => $faq->id,
            'activo' => false
        ]);
    }

    /** @test */
    public function usuario_autenticado_puede_reordenar_faqs()
    {
        $this->actingAs($this->user);

        $faq1 = Faq::factory()->create(['orden' => 1]);
        $faq2 = Faq::factory()->create(['orden' => 2]);

        $reorderData = [
            'faqs' => [
                ['id' => $faq1->id, 'orden' => 3],
                ['id' => $faq2->id, 'orden' => 1],
            ]
        ];

        $response = $this->post('/api/faqs/reordenar', $reorderData);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'message'
                ]);

        $this->assertDatabaseHas('faqs', [
            'id' => $faq1->id,
            'orden' => 3
        ]);

        $this->assertDatabaseHas('faqs', [
            'id' => $faq2->id,
            'orden' => 1
        ]);
    }

    /** @test */
    public function usuario_no_autenticado_no_puede_acceder_a_rutas_protegidas()
    {
        $faq = Faq::factory()->create();

        // Intentar crear FAQ
        $response = $this->post('/api/faqs', []);
        $response->assertRedirect('/login');

        // Intentar actualizar FAQ
        $response = $this->put("/api/faqs/{$faq->id}", []);
        $response->assertRedirect('/login');

        // Intentar eliminar FAQ
        $response = $this->delete("/api/faqs/{$faq->id}");
        $response->assertRedirect('/login');
    }

    /** @test */
    public function validacion_requiere_campos_obligatorios()
    {
        $this->actingAs($this->user);
        
        // Crear una instancia del controlador directamente
        $controller = new \App\Http\Controllers\FaqController();
        
        // Crear una request con datos vacíos
        $request = new \Illuminate\Http\Request();
        $request->merge([]);
        
        // Verificar que se lance la excepción de validación
        $this->expectException(\Illuminate\Validation\ValidationException::class);
        
        // Llamar al método store directamente
        $controller->store($request);
    }

    /** @test */
    public function validacion_limita_longitud_de_campos()
    {
        $this->actingAs($this->user);
        
        // Crear una instancia del controlador directamente
        $controller = new \App\Http\Controllers\FaqController();
        
        // Crear una request con datos que exceden los límites
        $request = new \Illuminate\Http\Request();
        $request->merge([
            'pregunta' => str_repeat('a', 256), // Más de 255 caracteres
            'respuesta' => str_repeat('a', 1001), // Más de 1000 caracteres
            'categoria' => str_repeat('a', 101), // Más de 100 caracteres
        ]);
        
        // Verificar que se lance la excepción de validación
        $this->expectException(\Illuminate\Validation\ValidationException::class);
        
        // Llamar al método store directamente
        $controller->store($request);
    }

    /** @test */
    public function filtros_funcionan_correctamente()
    {
        $this->actingAs($this->user);

        // Crear FAQs con características específicas para el test
        Faq::factory()->create([
            'pregunta' => '¿Cómo organizar eventos sostenibles?',
            'categoria' => 'Eventos',
            'activo' => true
        ]);
        
        Faq::factory()->create([
            'pregunta' => '¿Qué son los eventos verdes?',
            'categoria' => 'Eventos',
            'activo' => false
        ]);
        
        Faq::factory()->create([
            'pregunta' => '¿Cómo participar en actividades?',
            'categoria' => 'Participación',
            'activo' => true
        ]);

        // Filtrar por categoría
        $response = $this->get('/api/faqs?categoria=Eventos');
        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));

        // Filtrar por estado activo
        $response = $this->get('/api/faqs?activo=true');
        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));

        // Buscar por texto específico
        $response = $this->get('/api/faqs?buscar=eventos');
        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertGreaterThan(0, count($data));
        
        // Verificar que al menos una FAQ contiene "eventos" en la pregunta
        $preguntas = collect($data)->pluck('pregunta')->toArray();
        $this->assertTrue(
            collect($preguntas)->some(fn($pregunta) => stripos($pregunta, 'eventos') !== false),
            'No se encontraron FAQs con la palabra "eventos"'
        );
    }
} 