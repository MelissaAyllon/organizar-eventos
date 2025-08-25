<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Event extends Model
{
    use HasFactory;

    protected $table = 'events';

    protected $fillable = [
        'nombre',
        'descripcion',
        'fecha',
        'hora',
        'ubicacion',
        'tipo_actividad',
        'organizador',
        'capacidad_maxima',
        'estado',
        'imagen',
        'comments_count',
    ];

    protected $attributes = [
        'comments_count' => 0,
    ];

    protected $casts = [
        'fecha' => 'date',
        'capacidad_maxima' => 'integer',
        'comments_count' => 'integer',
    ];

    public function comments()
    {
        return $this->hasMany(Comment::class, 'evento_id')->orderBy('created_at', 'desc'); // Especifica la clave foránea
    }
}