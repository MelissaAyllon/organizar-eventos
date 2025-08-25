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
} 