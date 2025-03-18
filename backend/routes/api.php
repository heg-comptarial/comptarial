<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClientController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Test route
Route::get('/test', function () {
    return response()->json(['message' => 'Connexion réussie avec le backend Laravel']);
});

// Client routes
Route::get('/clients', [ClientController::class, 'index']);
Route::get('/clients/{id}', [ClientController::class, 'show'])->middleware('auth:sanctum');
Route::post('/clients', [ClientController::class, 'store'])->middleware('auth:sanctum');
Route::put('/clients/{id}', [ClientController::class, 'update'])->middleware('auth:sanctum');
Route::delete('/clients/{id}', [ClientController::class, 'destroy'])->middleware('auth:sanctum');

