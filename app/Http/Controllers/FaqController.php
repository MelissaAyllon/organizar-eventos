<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class FaqController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Faq::query();

        // Filtrar por categoría si se especifica
        if ($request->has('categoria') && $request->categoria) {
            $query->porCategoria($request->categoria);
        }

        // Filtrar por estado activo/inactivo
        if ($request->has('activo')) {
            $activo = filter_var($request->activo, FILTER_VALIDATE_BOOLEAN);
            $query->where('activo', $activo);
        }

        // Buscar por texto en pregunta o respuesta (insensible a mayúsculas/minúsculas)
        if ($request->has('buscar') && $request->buscar) {
            $buscar = strtolower($request->buscar);
            $query->where(function($q) use ($buscar) {
                $q->whereRaw('LOWER(pregunta) LIKE ?', ["%{$buscar}%"])
                  ->orWhereRaw('LOWER(respuesta) LIKE ?', ["%{$buscar}%"]);
            });
        }

        // Ordenar y paginar
        $faqs = $query->ordenadas()->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $faqs->items(),
            'pagination' => [
                'current_page' => $faqs->currentPage(),
                'last_page' => $faqs->lastPage(),
                'per_page' => $faqs->perPage(),
                'total' => $faqs->total(),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'pregunta' => 'required|string|max:255',
            'respuesta' => 'required|string|max:1000',
            'categoria' => 'nullable|string|max:100',
            'orden' => 'nullable|integer|min:0',
            'activo' => 'boolean',
        ]);

        try {
            $faq = Faq::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'FAQ creada exitosamente',
                'data' => $faq
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la FAQ',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Faq $faq): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $faq
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Faq $faq): JsonResponse
    {
        $validated = $request->validate([
            'pregunta' => 'sometimes|required|string|max:255',
            'respuesta' => 'sometimes|required|string|max:1000',
            'categoria' => 'nullable|string|max:100',
            'orden' => 'nullable|integer|min:0',
            'activo' => 'sometimes|boolean',
        ]);

        try {
            $faq->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'FAQ actualizada exitosamente',
                'data' => $faq->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la FAQ',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Faq $faq): JsonResponse
    {
        try {
            $faq->delete();

            return response()->json([
                'success' => true,
                'message' => 'FAQ eliminada exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la FAQ',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener FAQs públicas (solo activas y ordenadas)
     */
    public function public(): JsonResponse
    {
        $faqs = Faq::activas()->ordenadas()->get();

        return response()->json([
            'success' => true,
            'data' => $faqs
        ]);
    }

    /**
     * Obtener FAQs por categoría
     */
    public function porCategoria(string $categoria): JsonResponse
    {
        $faqs = Faq::activas()->porCategoria($categoria)->ordenadas()->get();

        return response()->json([
            'success' => true,
            'data' => $faqs
        ]);
    }

    /**
     * Obtener todas las categorías disponibles
     */
    public function categorias(): JsonResponse
    {
        $categorias = Faq::getCategorias();

        return response()->json([
            'success' => true,
            'data' => $categorias
        ]);
    }

    /**
     * Cambiar el estado activo/inactivo de una FAQ
     */
    public function toggleStatus(Faq $faq): JsonResponse
    {
        try {
            $faq->update(['activo' => !$faq->activo]);

            return response()->json([
                'success' => true,
                'message' => 'Estado de FAQ actualizado exitosamente',
                'data' => $faq->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cambiar el estado de la FAQ',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reordenar FAQs
     */
    public function reordenar(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'faqs' => 'required|array',
            'faqs.*.id' => 'required|exists:faqs,id',
            'faqs.*.orden' => 'required|integer|min:0',
        ]);

        try {
            foreach ($validated['faqs'] as $faqData) {
                Faq::where('id', $faqData['id'])->update(['orden' => $faqData['orden']]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Orden de FAQs actualizado exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al reordenar las FAQs',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 