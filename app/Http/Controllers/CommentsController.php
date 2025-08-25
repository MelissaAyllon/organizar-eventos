<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class CommentsController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Validar los datos
            $validator = Validator::make($request->all(), [
                'evento_id' => 'required|integer|exists:events,id',
                'contenido' => 'required|string|max:1000',
                'usuario' => 'required|string|max:255',
            ]);

            if ($validator->fails()) {
                return back()->withErrors([
                    'comment_error' => 'Datos inválidos: ' . $validator->errors()->first()
                ]);
            }

            // Crear el comentario
            $comment = Comment::create([
                'evento_id' => $request->evento_id,
                'contenido' => $request->contenido,
                'usuario' => $request->usuario,
                'editado' => false,
                'activo' => true,
            ]);

            Log::info('Comentario creado:', ['comment_id' => $comment->id]);

            // Usar back() con mensaje de éxito para Inertia
            return back()->with('success', 'Comentario publicado exitosamente');

        } catch (\Exception $e) {
            Log::error('Error al crear comentario:', [
                'error' => $e->getMessage(),
                'request_data' => $request->all()
            ]);

            return back()->withErrors([
                'comment_error' => 'Error al publicar el comentario. Inténtalo nuevamente.'
            ]);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'contenido' => 'required|string|max:1000',
            ]);

            if ($validator->fails()) {
                return back()->withErrors([
                    'comment_error' => 'Contenido inválido: ' . $validator->errors()->first()
                ]);
            }

            $comment = Comment::findOrFail($id);
            $comment->update([
                'contenido' => $request->contenido,
                'editado' => true,
            ]);

            Log::info('Comentario actualizado:', ['comment_id' => $comment->id]);

            return back()->with('success', 'Comentario actualizado exitosamente');

        } catch (\Exception $e) {
            Log::error('Error al actualizar comentario:', [
                'error' => $e->getMessage(),
                'comment_id' => $id
            ]);

            return back()->withErrors([
                'comment_error' => 'Error al actualizar el comentario.'
            ]);
        }
    }

    public function destroy($id)
    {
        try {
            $comment = Comment::findOrFail($id);
            
            // Marcar como inactivo en lugar de eliminar
            $comment->update(['activo' => false]);

            Log::info('Comentario desactivado:', ['comment_id' => $comment->id]);

            return back()->with('success', 'Comentario desactivado exitosamente');

        } catch (\Exception $e) {
            Log::error('Error al desactivar comentario:', [
                'error' => $e->getMessage(),
                'comment_id' => $id
            ]);

            return back()->withErrors([
                'comment_error' => 'Error al desactivar el comentario.'
            ]);
        }
    }

    public function show($id)
    {
        $comment = Comment::findOrFail($id);
        return response()->json($comment);
    }
}