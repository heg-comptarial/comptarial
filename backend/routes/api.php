<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdministrateurController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\CommentaireController;
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

// Routes supplémentaires pour les utilisateurs qui ont un statur pending
Route::get('/users/status/pending', [UserController::class, 'getPending']);

// Routes supplémentaires pour les utilisateurs qui ont un statut approved
Route::get('/users/status/approved', [UserController::class, 'getApproved']);

// Routes supplémentaires pour les utilisateurs afin de créer soit un privé soit une entreprise
Route::post('/users/{id}/approve', [UserController::class, 'approveUser']);


// Routes pour les administrateurs
Route::apiResource('administrateurs', AdministrateurController::class);

// Routes pour les documents
Route::apiResource('documents', DocumentController::class);

// Routes pour les commentaires
Route::apiResource('commentaires', CommentaireController::class);

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

// Route pour obtenir tous les documents d'un user
Route::get('users/{userId}/documents', [DocumentController::class, 'getDocumentsByUser']);

// Route pour obtenir une déclaration spécifique d'un user
Route::get('/users/{userId}/declarations/{declarationId}', [UserController::class, 'getUserDeclarationWithDetails']);

// Route pour obtenir toutes les déclarations d'un user
Route::get('/users/{userId}/declarations', [UserController::class, 'getAllDeclarationsByUser']);