<?php

use App\Models\Faq;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('FAQ Display', function () {
    it('can get all FAQs', function () {
        // Create some test FAQs
        Faq::factory()->count(3)->create();

        $response = $this->getJson('/api/faqs');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        '*' => ['id', 'pregunta', 'respuesta', 'created_at', 'updated_at']
                    ]
                ]);

        $response->assertJson(['success' => true]);
        $this->assertEquals(3, count($response->json('data')));
    });

    it('returns empty array when no FAQs exist', function () {
        $response = $this->getJson('/api/faqs');

        $response->assertStatus(200)
                ->assertJson(['success' => true, 'data' => []]);
    });

    it('can create FAQ with factory', function () {
        $faq = Faq::factory()->create([
            'pregunta' => 'Test Question?',
            'respuesta' => 'Test Answer'
        ]);

        $this->assertInstanceOf(Faq::class, $faq);
        $this->assertEquals('Test Question?', $faq->pregunta);
        $this->assertEquals('Test Answer', $faq->respuesta);
    });
});
