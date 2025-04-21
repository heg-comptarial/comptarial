<?php

use App\Http\Controllers\AuthController;
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
use Illuminate\Support\Facades\Crypt;


// Routes pour les utilisateurs
Route::apiResource('users', UserController::class);

// Routes supplémentaires pour récupere les info d'un utilisateur par son id
Route::get('/users/{id}/details', [UserController::class, 'getUserDetails']);

// Routes supplémentaires pour récupérer les informations d'un utilisateur avec toutes ses relations
Route::get('/users/{id}/full-data', [UserController::class, 'getFullUserData']);


// Routes supplémentaires pour les utilisateurs qui ont un statur pending
Route::get('/users/status/pending', [UserController::class, 'getPending']);

// Routes supplémentaires pour les utilisateurs qui ont un statut approved
Route::get('/users/status/approved', [UserController::class, 'getApproved']);

// Routes supplémentaires pour les utilisateurs afin de créer soit un privé soit une entreprise
Route::post('/users/{id}/approve', [UserController::class, 'approveUser']);


// Routes supplémentaires pour les utilisateurs afin de trouver l'id d'un admin
Route::get('/admin', [UserController::class, 'getAdminId'])->middleware("auth:sanctum");


// Routes pour les administrateurs
Route::apiResource('administrateurs', AdministrateurController::class);

// Routes pour les documents
Route::apiResource('documents', DocumentController::class);

// Mettre à jour le statut d'un document
//Route::patch('/documents/{id}/status', [DocumentController::class, 'updateStatus']);

// Routes pour les commentaires
Route::apiResource('commentaires', CommentaireController::class);

// Routes pour les rubriques
Route::apiResource('rubriques', RubriqueController::class);

// Routes pour les déclarations
Route::apiResource('declarations', DeclarationController::class);

// Mettre à jour le statut d'une déclaration
Route::patch('/declarations/{id}/status', [DeclarationController::class, 'updateStatus']);
Route::get('/declarations/{id}/check-documents', [DeclarationController::class, 'checkDocuments']);
Route::patch('/declarations/{id}/validateDecEtDoc', [DeclarationController::class, 'validerDeclarationEtDocuments']);


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

// Route pour obtenir la declaration d'un user d'une année spécifique
Route::get('/users/{userId}/declarations/year/{year}', [UserController::class, 'getDeclarationByYear']);

// Route pour obtenir tous les commentaires d'un document
Route::get('/documents/{documentId}/commentaires', [DocumentController::class, 'getCommentairesByDocument']);

// Route pour l'authentification
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout'])->middleware("auth:sanctum");

// Route pour trouver un user prive avec l'id user
Route::get('/prives/users/{userId}', [PriveController::class, 'getPriveByUserId']);


Route::get('/auth/user', function (Request $request){
    // Lire le cookie 'user_id' crypté
    $encryptedUserId = $request->cookie('user_id');

    // Décrypter le cookie
    try {
        $userId = Crypt::decrypt($encryptedUserId);  // Décryptage du user_id
    } catch (\Exception $e) {
        // Si le cookie est corrompu ou invalide
        return response()->json(['error' => 'Cookie invalide ou corrompu'], 400);
    }

    // Retourner l'ID utilisateur décrypté
    return response()->json([
        'user_id' => $userId
    ]);
})->middleware("auth:sanctum");
