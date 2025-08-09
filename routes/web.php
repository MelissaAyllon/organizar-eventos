<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CommentsController;

use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::post('/api/comment', [CommentsController::class, 'store']);
Route::get('/api/comment/{id}', [CommentsController::class, 'show']);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
