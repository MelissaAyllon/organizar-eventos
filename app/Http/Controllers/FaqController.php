<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FaqController extends Controller
{
    /**
     * Display a listing of all FAQs.
     */
    public function index(Request $request): JsonResponse
    {
        $faqs = Faq::all();

        return response()->json([
            'success' => true,
            'data' => $faqs
        ]);
    }

    /**
     * Store a newly created FAQ in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'pregunta' => 'required|string|max:255',
            'respuesta' => 'required|string|max:1000',
        ]);

        $faq = Faq::create([
            'pregunta' => $request->pregunta,
            'respuesta' => $request->respuesta,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'FAQ creada exitosamente',
            'data' => $faq
        ], 201);
    }
} 