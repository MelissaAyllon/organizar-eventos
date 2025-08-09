<?php

use App\Models\Event;
use App\Models\Comment;

it('can create an event and a comment', function () {
    // Create an event
    $event = Event::create([
        'nombre' => 'Music Festival',
        'descripcion' => 'A fun music festival',
        'fecha' => now()->addDays(7),
        'ubicacion' => 'Central Park',
    ]);


    // Assert that the event was created in the database
    $this->assertDatabaseHas('events', [
        'nombre' => 'Music Festival',
        'descripcion' => 'A fun music festival',
        'fecha' => now()->addDays(7),
        'ubicacion' => 'Central Park',
    ]);
});

it('can create a comment for an event', function () {
    // First, create an event
    $event = Event::create([
        'nombre' => 'Art Exhibition',
        'descripcion' => 'An exhibition of modern art',
        'fecha' => now()->addDays(10),
        'ubicacion' => 'Art Gallery',
    ]);

    // Then, create a comment for that event
    $comment = Comment::create([
        'evento_id' => $event->evento_id,
        'contenido' => 'Looking forward to this event!',
    ]);

    // Assert that the comment was created in the database
    $this->assertDatabaseHas('comments', [
        'evento_id' => $event->evento_id,
        'contenido' => 'Looking forward to this event!',
    ]);
});