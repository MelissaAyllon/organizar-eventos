<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    use HasFactory;

    protected $table = 'faqs';

    protected $fillable = [
        'pregunta',
        'respuesta',
        'categoria',
        'orden',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'orden' => 'integer',
    ];

    /**
     * Scope para obtener solo FAQs activas
     */
    public function scopeActivas($query)
    {
        return $query->where('activo', true);
    }

    /**
     * Scope para ordenar por orden y luego por ID
     */
    public function scopeOrdenadas($query)
    {
        return $query->orderBy('orden', 'asc')->orderBy('id', 'asc');
    }

    /**
     * Scope para filtrar por categoría
     */
    public function scopePorCategoria($query, $categoria)
    {
        return $query->where('categoria', $categoria);
    }

    /**
     * Obtener todas las categorías disponibles
     */
    public static function getCategorias()
    {
        return static::distinct()->pluck('categoria')->filter()->sort()->values();
    }
} 