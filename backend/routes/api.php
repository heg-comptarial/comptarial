<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdministrateurController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\CommentaireController;
use App\Http\Controllers\SousRubriqueController;
use App\Http\Controllers\RubriqueController;
use App\Http\Controllers\DeclarationController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PriveController;
use App\Http\Controllers\ConjointController;
use App\Http\Controllers\EnfantController;
use App\Http\Controllers\EntrepriseController;

// Route pour l'utilisateur authentifié (si vous utilisez Sanctum)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Routes pour les utilisateurs
Route::apiResource('users', UserController::class);

// Routes supplémentaires pour les utilisateurs
Route::get('/users/status/pending', [UserController::class, 'getPending']);

// Routes pour les administrateurs
Route::apiResource('administrateurs', AdministrateurController::class);

// Routes pour les documents
Route::apiResource('documents', DocumentController::class);

// Routes pour les commentaires
Route::apiResource('commentaires', CommentaireController::class);

// Routes pour les sous-rubriques
Route::apiResource('sousrubriques', SousRubriqueController::class);

// Routes pour les rubriques
Route::apiResource('rubriques', RubriqueController::class);

// Routes pour les déclarations
Route::apiResource('declarations', DeclarationController::class);

// Routes pour les notifications
Route::apiResource('notifications', NotificationController::class);

// Routes pour les entités privées
Route::apiResource('prives', PriveController::class);

// Routes pour les conjoints
Route::apiResource('conjoints', ConjointController::class);

// Routes pour les enfants
Route::apiResource('enfants', EnfantController::class);

// Routes pour les entreprises
Route::apiResource('entreprises', EntrepriseController::class);