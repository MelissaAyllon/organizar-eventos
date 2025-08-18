<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CommentsController;
use App\Models\Event;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/events', function () {
    return Inertia::render('events');
});

Route::get('/events/create', function () {
    return Inertia::render('create-event');
});

Route::post('/api/comment', [CommentsController::class, 'store']);
Route::get('/api/comment/{id}', [CommentsController::class, 'show']);


Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});


Route::get('/events/{id}', function ($id) {
    $event = Event::find($id);

    // Manejar el caso de evento no encontrado
    if (!$event) {
        abort(404, 'Evento no encontrado');
    }

    return Inertia::render('EventDetails', [
        'event' => $event, // Solo enviamos la prop 'event'
    ]);
});


Route::get('/admin/events/{id}/edit', function ($id) {
    $event = Event::find($id);

    // Manejar el caso de evento no encontrado
    if (!$event) {
        abort(404, 'Evento no encontrado');
    }

    return Inertia::render('EventEdit', [
        'event' => $event, // Solo enviamos la prop 'event'
    ]);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
