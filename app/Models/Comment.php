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
    ];

    public function event(){
        return $this->belongsTo(Event::class, 'evento_id');
    }

}
