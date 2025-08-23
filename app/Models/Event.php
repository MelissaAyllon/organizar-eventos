<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Event extends Model
{
    use HasFactory;

    protected $table = 'events';

    //protected $primaryKey = 'evento_id';

    protected $fillable = [
        'nombre',
        'fecha',
        'ubicacion',
        'descripcion',
        'tipo_actividad',
        'organizador',
        'capacidad_maxima',
        'estado',
        // 'comments_count' // You can remove this if you don't want it to be mass assignable
    ];

    protected $attributes = [
        'comments_count' => 0,
    ];

    public function comments(){
        return $this->hasMany(Comment::class);
    }
}
