
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CommentsController;
use App\Models\Event;
use Inertia\Inertia;
use Illuminate\Http\Request; // Agregado

Route::get('/', function () {
    return redirect('/events');
})->name('home');

Route::get('/events', function () {
    return Inertia::render('events');
});

Route::get('/events/create', function () {
    return Inertia::render('create-event');
});

// Rutas de comentarios
Route::post('/comments', [CommentsController::class, 'store']);
Route::patch('/comments/{id}', [CommentsController::class, 'update']); // Agregado
Route::delete('/comments/{id}', [CommentsController::class, 'destroy']); // Agregado
Route::get('/api/comment/{id}', [CommentsController::class, 'show']);

Route::get('/events/{id}', function ($id) {
    $event = Event::with('comments')->find($id);
    
    if (!$event) {
        abort(404, 'Evento no encontrado');
    }
    
    return Inertia::render('EventDetails', [
        'event' => $event,
        'auth' => [
            'user' => auth()->user()
        ],
        'flash' => [
            'success' => session('success'),
            'error' => session('error')
        ]
    ]);
})->name('event.show');

Route::get('/admin/events/{id}/edit', function ($id) {
    $event = Event::with('comments')->find($id); // Agregado ->with('comments')
    
    if (!$event) {
        abort(404, 'Evento no encontrado');
    }
    
    return Inertia::render('EventEdit', [
        'event' => $event,
        'auth' => [
            'user' => auth()->user() // Agregado para tener datos del usuario
        ]
    ]);
})->name('event.edit');

// Ruta para actualizar eventos
Route::patch('/events/{id}', function (Request $request, $id) {
    $event = Event::findOrFail($id);
    
    // Validar y actualizar solo los campos enviados
    $validated = $request->validate([
        'nombre' => 'sometimes|string|max:255',
        'fecha' => 'sometimes|date',
        'ubicacion' => 'sometimes|string|max:255',
        'descripcion' => 'sometimes|string',
        'hora' => 'sometimes|string',
        'imagen' => 'sometimes|string',
        'tipo_actividad' => 'sometimes|string|max:255',
        'organizador' => 'sometimes|string|max:255',
        'capacidad_maxima' => 'sometimes|integer|min:0',
        'estado' => 'sometimes|in:activo,inactivo',
    ]);
    
    $event->update($validated);
    
    return back()->with('success', 'Evento actualizado correctamente');
})->name('event.update');