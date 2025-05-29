<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AutreInformationsController;
use App\Http\Controllers\BanqueController;
use App\Http\Controllers\InteretDettesController;
use App\Http\Controllers\PensionAlimentaireController;
use App\Http\Controllers\RentierController;
use App\Http\Controllers\RevenuController;
use App\Models\AutrePersonneACharge;
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
use App\Http\Controllers\ImmobilierController;
use App\Http\Controllers\AutrePersonneAChargeController;
use App\Http\Controllers\IndemniteAssuranceController;
use App\Http\Controllers\TitreController;
use App\Http\Controllers\DeductionController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\ResetPasswordController;
use App\Http\Controllers\DeclarationUpdateNotificationController;
use Illuminate\Support\Facades\Crypt;

// Routes pour les utilisateurs
Route::apiResource('users', UserController::class)->middleware("auth:sanctum");

// Routes pour les utilisateurs
Route::post('users-ins', [UserController::class, 'store']);


// Protéger la route par Sanctum
Route::get('/users/{id}', [UserController::class, 'show'])->middleware('auth:sanctum');

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

// Routes supplémentaires pour les utilisateurs afin de charger les user avec des déclarations en attente
Route::get('/users-with-pending-declarations', [UserController::class, 'usersWithPendingDeclarations']);

Route::get('users', [UserController::class, 'search']);
// Vérifier si le mot de passe actuel est correct
Route::post('/users/check-password', [UserController::class, 'checkPassword'])->middleware("auth:sanctum");

// Mettre à jour le mot de passe d'un utilisateur
Route::post('/users/change-password', [UserController::class, 'updatePassword'])->middleware("auth:sanctum");



// Routes supplémentaires pour les utilisateurs afin de trouver l'id d'un admin
Route::get('/admin', [UserController::class, 'getAdminId'])->middleware("auth:sanctum");


// Routes pour les administrateurs
Route::apiResource('administrateurs', AdministrateurController::class);

// Routes pour les documents
Route::apiResource('documents', DocumentController::class);

// Mettre à jour le statut d'un document
//Route::patch('/documents/{id}/status', [DocumentController::class, 'updateStatus']);

// getDocumentsWithRubrique 
Route::get('/documents/rubriques', [DocumentController::class, 'getDocumentsWithRubrique']);

// Routes pour les commentaires
Route::apiResource('commentaires', CommentaireController::class);

// Routes pour les rubriques
Route::apiResource('rubriques', RubriqueController::class);
Route::get('/rubriques/declaration/{declarationID}', [RubriqueController::class, 'getRubriqueByDeclarationID']);



// Routes pour les déclarations
Route::apiResource('declarations', DeclarationController::class);
Route::get('/users/{userId}/declarations/last', [DeclarationController::class, 'getLastDeclaration'])->middleware("auth:sanctum");


// Mettre à jour le statut d'une déclaration
Route::get('/declarations/{id}/check-documents', [DeclarationController::class, 'checkDocuments']);
Route::patch('/declarations/{id}/validateDecEtDoc', [DeclarationController::class, 'validerDeclarationEtDocuments']);


// Routes pour les notifications
Route::apiResource('notifications', NotificationController::class);

Route::get('/users/{id}/notifications', [NotificationController::class, 'getUserNotifications']);
Route::post('/users/{id}/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);

// Routes pour créer des notifications spécifiques
Route::post('/notifications/document-comment', [NotificationController::class, 'createDocumentCommentNotification']);
Route::post('/notifications/document-status', [NotificationController::class, 'createDocumentStatusNotification']);
Route::post('/notifications/declaration-status', [NotificationController::class, 'createDeclarationStatusNotification']);

Route::delete('/users/{id}/notifications', [NotificationController::class, 'deleteAllForUser']);

// Routes pour les notifications administrateur
Route::post('/notifications/admin', [NotificationController::class, 'createAdminNotification']);
Route::post('/notifications/new-declaration', [NotificationController::class, 'createNewDeclarationNotification']);
Route::post('/notifications/new-document', [NotificationController::class, 'createNewDocumentNotification']);

// Routes pour les entités privées
Route::apiResource('prives', PriveController::class);

// Routes pour les formulaires privés
Route::get('/prives/complet/{userId}', [PriveController::class, 'getFormulairesPrive']);


// Routes pour les conjoints
Route::apiResource('conjoints', ConjointController::class);
Route::get('/conjoints/prives/{priveId}', [ConjointController::class, 'getByPriveId']);
Route::delete('/conjoints/prives/{priveId}', [ConjointController::class, 'destroyByPriveId']);



// Routes pour les enfants
Route::apiResource('enfants', EnfantController::class);
Route::delete('enfants/prives/{priveId}', [EnfantController::class, 'destroyByPriveId']);
// Route::delete('enfants/prenom/{prenom}', [EnfantController::class, 'destroyByName']);




// Routes pour les entreprises
Route::apiResource('entreprises', EntrepriseController::class);

// Route pour autreinformations
Route::apiResource('autresinformations', AutreInformationsController::class);
Route::get('/autresinformations/prives/{priveId}', [AutreInformationsController::class, 'getByPriveId']);
Route::delete('/autresinformations/prives/{priveId}', [AutreInformationsController::class, 'destroyByPriveId']);



// Route pour autre personne a charge
Route::apiResource('autrepersonneacharge', AutrePersonneAChargeController::class);
Route::get('/autrepersonneacharge/prives/{priveId}', [AutrePersonneAChargeController::class, 'getByPriveId']);
Route::delete('/autrepersonneacharge/prives/{priveId}', [AutrePersonneAChargeController::class, 'destroyByPriveId']);



// Route pour les banques
Route::apiResource('/banques', BanqueController::class);
Route::get('/banques/prives/{priveId}', [BanqueController::class, 'getByPriveId']);
Route::delete('/banques/prives/{priveId}', [BanqueController::class, 'destroyByPriveId']);


// Route pour les deductions
Route::apiResource('/deductions', DeductionController::class);
Route::get('/deductions/prives/{priveId}', [DeductionController::class, 'getByPriveId']);
Route::delete('/deductions/prives/{priveId}', [DeductionController::class, 'destroyByPriveId']);


// Route pour les immobiliers
Route::apiResource('/immobiliers', ImmobilierController::class);
Route::get('/immobiliers/prives/{priveId}', [ImmobilierController::class, 'getByPriveId']);
Route::delete('/immobiliers/prives/{priveId}', [ImmobilierController::class, 'destroyByPriveId']);

// Route pour les indemnites d'assurance
Route::apiResource('/indemnitesassurances', IndemniteAssuranceController::class);
Route::get('/indemnitesassurance/prives/{priveId}', [IndemniteAssuranceController::class, 'getByPriveId']);
Route::delete('/indemnitesassurance/prives/{priveId}', [IndemniteAssuranceController::class, 'destroyByPriveId']);

// Route pour les interets dettes 
Route::apiResource('/interetsdettes', InteretDettesController::class);
Route::get('/interetsdettes/prives/{priveId}', [InteretDettesController::class, 'getByPriveId']);
Route::delete('/interetsdettes/prives/{priveId}', [InteretDettesController::class, 'destroyByPriveId']);

// Route pour les pensions alimentaires
Route::apiResource('/pensionsalimentaires', PensionAlimentaireController::class);
Route::get('/pensionsalimentaires/enfants/{enfantId}',[PensionAlimentaireController::class,'getByEnfantId']);
Route::delete('/pensionsalimentaires/enfants/{enfantId}',[PensionAlimentaireController::class,'destroyByEnfantId']);


// Route pour les rentiers
Route::apiResource('/rentiers', RentierController::class);
Route::get('/rentiers/prives/{priveId}', [RentierController::class, 'getByPriveId']);
Route::delete('/rentiers/prives/{priveId}', [RentierController::class, 'destroyByPriveId']);

// Route pour les revenus
Route::apiResource('/revenus', RevenuController::class);
Route::get('/revenus/prives/{priveId}', [RevenuController::class, 'getByPriveId']);
Route::delete('/revenus/prives/{priveId}', [RevenuController::class, 'destroyByPriveId']);

// Route pour les titres
Route::apiResource('/titres', TitreController::class);
Route::get('/titres/prives/{priveId}', [TitreController::class, 'getByPriveId']);
Route::delete('/titres/prives/{priveId}', [TitreController::class, 'destroyByPriveId']);

// Route pour les autres personnes à charge
Route::apiResource('/autrepersonnesacharges', AutrePersonneAChargeController::class);


// Route pour obtenir tous les documents d'un user
Route::get('users/{userId}/documents', [DocumentController::class, 'getDocumentsByUser']);

// Route pour obtenir toutes les déclarations d'un user
Route::get('/users/{userId}/declarations', [UserController::class, 'getAllDeclarationsByUser']);

// Route pour obtenir une déclaration spécifique d'un user
Route::get('/users/{userId}/declarations/{declarationId}', [UserController::class, 'getUserDeclarationWithDetails']);

// Route pour obtenir tous les titres des declarations d'un user
Route::get('/users/{userId}/titres-declarations', [UserController::class, 'getAllDeclarationTitlesByUser']);

// Route pour obtenir tous les titres des declarations d'un user
Route::get('/users/{userId}/titres-declarations/{titre}', [UserController::class, 'getUserDeclarationsWithDetailsByTitreDeclaration']);

// Route pour obtenir la declaration d'un user d'une année spécifique
Route::get('/users/{userId}/declarations/year/{year}', [UserController::class, 'getDeclarationByYear']);

// Route pour obtenir tous les commentaires d'un document
Route::get('/documents/{documentId}/commentaires', [DocumentController::class, 'getCommentairesByDocument']);

// Route pour l'authentification
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout'])->middleware("auth:sanctum");

// Route pour trouver un user prive avec l'id user
Route::get('/prives/users/{userId}', [PriveController::class, 'getPriveByUserId']);

// Route pour le formulaire de contact
Route::post('/contact', [ContactController::class, 'send']);

// Approve a user's registration and send email
Route::post('/users/{id}/approve-registration', [UserController::class, 'approveRegistration']);

// Reject a user's registration and send email
Route::post('/users/{id}/reject-registration', [UserController::class, 'rejectRegistration']);

// Route pour envoyer un email de réinitialisation de mot de passe
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLink']);

// Route pour réinitialiser le mot de passe
Route::post('/reset-password', [ResetPasswordController::class, 'reset']);

// Route pour envoyer un email de notification de mise à jour de déclaration par le client
Route::post('/declarations/{userId}/{declarationId}/notify-update', [DeclarationUpdateNotificationController::class, 'notify']);

// Route pour envoyer un email de notification de mise à jour de déclaration par l'admin
Route::post('/documents/admin-upload-notification', [DocumentController::class, 'notifyUserOfNewAdminDocument']);

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
