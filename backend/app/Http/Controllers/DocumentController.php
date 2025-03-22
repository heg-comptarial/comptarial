<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Document;

class DocumentController extends Controller
{
    /**
     * Récupérer tous les documents.
     */
    public function index()
    {
        $documents = Document::all();
        return response()->json($documents);
    }
}
