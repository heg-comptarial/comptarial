<?php

use Illuminate\Support\Facades\Route;
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
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('administrateurs')->group(function () {
    Route::get('/', [AdministrateurController::class, 'index']); // Liste tous les administrateurs
    Route::post('/', [AdministrateurController::class, 'store']); // Crée un nouvel administrateur
    Route::get('/{id}', [AdministrateurController::class, 'show']); // Affiche un administrateur spécifique
    Route::put('/{id}', [AdministrateurController::class, 'update']); // Met à jour un administrateur
    Route::delete('/{id}', [AdministrateurController::class, 'destroy']); // Supprime un administrateur
});

Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::post('/', [UserController::class, 'store']);
    Route::get('/{id}', [UserController::class, 'show']);
    Route::put('/{id}', [UserController::class, 'update']);
    Route::delete('/{id}', [UserController::class, 'destroy']);
});

Route::prefix('documents')->group(function () {
    Route::get('/', [DocumentController::class, 'index']);
    Route::post('/', [DocumentController::class, 'store']);
    Route::get('/{id}', [DocumentController::class, 'show']);
    Route::put('/{id}', [DocumentController::class, 'update']);
    Route::delete('/{id}', [DocumentController::class, 'destroy']);
});

Route::prefix('commentaires')->group(function () {
    Route::get('/', [CommentaireController::class, 'index']);
    Route::post('/', [CommentaireController::class, 'store']);
    Route::get('/{id}', [CommentaireController::class, 'show']);
    Route::put('/{id}', [CommentaireController::class, 'update']);
    Route::delete('/{id}', [CommentaireController::class, 'destroy']);
});

Route::prefix('rubriques')->group(function () {
    Route::get('/', [RubriqueController::class, 'index']);
    Route::post('/', [RubriqueController::class, 'store']);
    Route::get('/{id}', [RubriqueController::class, 'show']);
    Route::put('/{id}', [RubriqueController::class, 'update']);
    Route::delete('/{id}', [RubriqueController::class, 'destroy']);
});

Route::prefix('declarations')->group(function () {
    Route::get('/', [DeclarationController::class, 'index']); 
    Route::post('/', [DeclarationController::class, 'store']);
    Route::get('/{id}', [DeclarationController::class, 'show']); 
    Route::put('/{id}', [DeclarationController::class, 'update']);
    Route::delete('/{id}', [DeclarationController::class, 'destroy']);
});

Route::prefix('notifications')->group(function () {
    Route::get('/', [NotificationController::class, 'index']);
    Route::post('/', [NotificationController::class, 'store']);
    Route::get('/{id}', [NotificationController::class, 'show']);
    Route::put('/{id}', [NotificationController::class, 'update']);
    Route::delete('/{id}', [NotificationController::class, 'destroy']); 
});

Route::prefix('prives')->group(function () {
    Route::get('/', [PriveController::class, 'index']);
    Route::post('/', [PriveController::class, 'store']);
    Route::get('/{id}', [PriveController::class, 'show']);
    Route::put('/{id}', [PriveController::class, 'update']);
    Route::delete('/{id}', [PriveController::class, 'destroy']);
});

Route::prefix('conjoints')->group(function () {
    Route::get('/', [ConjointController::class, 'index']);
    Route::post('/', [ConjointController::class, 'store']);
    Route::get('/{id}', [ConjointController::class, 'show']);
    Route::put('/{id}', [ConjointController::class, 'update']);
    Route::delete('/{id}', [ConjointController::class, 'destroy']);
});

Route::prefix('enfants')->group(function () {
    Route::get('/', [EnfantController::class, 'index']);
    Route::post('/', [EnfantController::class, 'store']);
    Route::get('/{id}', [EnfantController::class, 'show']);
    Route::put('/{id}', [EnfantController::class, 'update']);
    Route::delete('/{id}', [EnfantController::class, 'destroy']);
});

Route::prefix('entreprises')->group(function () {
    Route::get('/', [EntrepriseController::class, 'index']);
    Route::post('/', [EntrepriseController::class, 'store']);
    Route::get('/{id}', [EntrepriseController::class, 'show']);
    Route::put('/{id}', [EntrepriseController::class, 'update']);
    Route::delete('/{id}', [EntrepriseController::class, 'destroy']);
});