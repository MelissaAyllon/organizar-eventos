<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;

class CommentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validate = $request->validate([
            'evento_id' => 'required|integer|exists:eventos,id',
            'contenido' => 'required|string|max:255',
        ]);

        $contenido = $validate['contenido'];
        $evento_id = $validate['evento_id'];

        try {
            $comment = new Comment;
            $comment->evento_id = $evento_id;
            $comment->contenido = $contenido;
            $comment->save();

            return response()->json(['message' => 'Comentario creado exitosamente', 'comment' => $comment], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al crear el comentario', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {   
        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json(['error' => 'Comentario no encontrado'], 404);
        }

        return response()->json(['comment' => $comment], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
