<?php

use App\Models\Event;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);


it('can create an event', function () {
    // Create a test event in the database
    $event = Event::create([
        'nombre' => 'Exposición de Arte Sostenible',
        'descripcion' => 'Una muestra de arte con materiales reciclados.',
        'fecha' => now()->addDays(20),
        'ubicacion' => 'Galería de la Ciudad',
        'tipo_actividad' => 'Exposición',
        'organizador' => 'Artistas Unidos',
        'capacidad_maxima' => 100,
        'estado' => 'activo',
        'comments_count' => 0
    ]);

    // Assert that the event was created in the database
    $this->assertDatabaseHas('events', [
        'nombre' => 'Exposición de Arte Sostenible',
        'descripcion' => 'Una muestra de arte con materiales reciclados.',
        'ubicacion' => 'Galería de la Ciudad',
        'tipo_actividad' => 'Exposición',
        'organizador' => 'Artistas Unidos',
        'capacidad_maxima' => 100,
        'estado' => 'activo',
        'comments_count' => 0
    ]);
});


it('returns an event by id', function () {
    // 1. Create a test event in the database
    $event = Event::create([
        'nombre' => 'Conferencia de Innovación',
        'descripcion' => 'Un evento para explorar las últimas tendencias tecnológicas.',
        'fecha' => now()->addDays(30),
        'ubicacion' => 'Centro de Convenciones',
        'tipo_actividad' => 'Conferencia',
        'organizador' => 'Innovación S.A.',
        'capacidad_maxima' => 200,
        'estado' => 'activo',
        'comments_count' => 0
    ]);

    // 2. Make a GET request to the event endpoint with the event ID
    $response = $this->getJson('/api/events/' . $event->id);
    // 3. Assert that the response status is 200 OK
    $response->assertStatus(200);
    // 4. Assert that the response contains the expected event data
    $response->assertJson([
        'nombre' => 'Conferencia de Innovación',
        'descripcion' => 'Un evento para explorar las últimas tendencias tecnológicas.',
        'ubicacion' => 'Centro de Convenciones',
        'tipo_actividad' => 'Conferencia',
        'organizador' => 'Innovación S.A.',
        'capacidad_maxima' => 200,
        'estado' => 'activo',
        'comments_count' => 0
    ]);
});