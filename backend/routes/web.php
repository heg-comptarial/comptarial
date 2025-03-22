<?php

use App\Http\Controllers\EnfantController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdministrateurController;
use App\Http\Controllers\DeclarationController;
use App\Http\Controllers\RubriqueController;
use App\Http\Controllers\SousRubriqueController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\CommentaireController;
use App\Http\Controllers\EntrepriseController;
use App\Http\Controllers\PriveController;
use App\Http\Controllers\ConjointController;


Route::get('/', function () {
    return view('welcome');
});


Route::get('users', [UserController::class, 'index']);
Route::get('administrateurs', [AdministrateurController::class, 'index']);
Route::get('declarations', [DeclarationController::class, 'index']);
Route::get('rubriques', [RubriqueController::class, 'index']);
Route::get('sousrubriques', [SousRubriqueController::class, 'index']);
Route::get('documents', [DocumentController::class, 'index']);
Route::get('notifications', [NotificationController::class, 'index']);
Route::get('commentaires', [CommentaireController::class, 'index']);
Route::get('entreprises', [EntrepriseController::class, 'index']);
Route::get('prives', [PriveController::class, 'index']);
Route::get('conjoints', [ConjointController::class, 'index']);
Route::get('enfants', [EnfantController::class, 'index']);

