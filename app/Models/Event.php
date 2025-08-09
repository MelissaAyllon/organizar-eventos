<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Event extends Model
{
    use HasFactory;

    protected $table = 'events';

    protected $primaryKey = 'evento_id';

    protected $fillable = [
        'nombre',
        'fecha',
        'ubicacion',
        'descripcion',
    ];

    public function comments(){
        return $this->hasMany(Comment::class);
    }
}
