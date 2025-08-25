<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $table = 'comments';

    protected $fillable = [
        'evento_id',
        'contenido',
        'usuario',    
        'activo',
        'editado',
    ];

    // Valores por defecto
    protected $attributes = [
        'activo' => true,
        'editado' => false,
    ];

    // Cast para booleanos
    protected $casts = [
        'activo' => 'boolean',
        'editado' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class, 'evento_id');
    }
}