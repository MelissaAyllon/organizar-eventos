<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\EventController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/



// Rutas públicas para FAQ
Route::prefix('faqs')->name('faqs.')->group(function () {
    Route::get('/public', [FaqController::class, 'public'])->name('public');
    Route::get('/categorias', [FaqController::class, 'categorias'])->name('categorias');
    Route::get('/categoria/{categoria}', [FaqController::class, 'porCategoria'])->name('porCategoria');
});

// events
Route::post('/events', [EventController::class, 'store']);
Route::get('/events/{id}', [EventController::class, 'show']);
Route::get('/events', [EventController::class, 'index']);

// Rutas para gestión de FAQ (públicas)
Route::prefix('faqs')->name('faqs.admin.')->group(function () {
    Route::get('/', [FaqController::class, 'index'])->name('index');
    Route::post('/', [FaqController::class, 'store'])->name('store');
    Route::get('/{faq}', [FaqController::class, 'show'])->name('show');
    Route::put('/{faq}', [FaqController::class, 'update'])->name('update');
    Route::delete('/{faq}', [FaqController::class, 'destroy'])->name('destroy');
    Route::patch('/{faq}/toggle-status', [FaqController::class, 'toggleStatus'])->name('toggleStatus');
    Route::post('/reordenar', [FaqController::class, 'reordenar'])->name('reordenar');
}); 
