<?php

namespace App\Http\Controllers;

use App\Models\AutrePersonneACharge;
use App\Models\InteretDettes;
use App\Models\Prive;
use Illuminate\Http\Request;

class PriveController extends Controller
{
    public function index()
    {
        // Récupère toutes les entités Prive avec leurs relations
        $prives = Prive::with('user', 'conjoints', 'enfants')->get();
        return response()->json($prives);
    }

    public function store(Request $request)
    {
        // Valide les données
        $request->validate([
            'user_id' => 'required|exists:user,user_id',
            'dateNaissance' => 'required|date',
            'nationalite' => 'required|string|max:255',
            'etatCivil' => 'required|string|max:255',
            'fo_banques' => 'boolean',
            'fo_dettes' => 'boolean',
            'fo_immobiliers' => 'boolean',
            'fo_salarie' => 'boolean',
            'fo_autrePersonneCharge' => 'boolean',
            'fo_independant' => 'boolean',
            'fo_rentier' => 'boolean',
            'fo_autreRevenu' => 'boolean',
            'fo_assurance' => 'boolean',
            'fo_autreDeduction' => 'boolean',
            'fo_autreInformations' => 'boolean',
        ]);

        // Crée une nouvelle entité Prive
        $prive = Prive::create($request->all());
        return response()->json($prive, 201);
    }

    public function show($id)
    {
        // Récupère une entité Prive spécifique avec ses relations
        $prive = Prive::with('user', 'conjoints', 'enfants')->findOrFail($id);
        return response()->json($prive);
    }

    public function update(Request $request, $id)
    {
        // Valide les données
        $request->validate([
            'dateNaissance' => 'date',
            'nationalite' => 'string|max:255',
            'etatCivil' => 'string|max:255',
            'fo_banques' => 'boolean',
            'fo_dettes' => 'boolean',
            'fo_immobiliers' => 'boolean',
            'fo_salarie' => 'boolean',
            'fo_autrePersonneCharge' => 'boolean',
            'fo_independant' => 'boolean',
            'fo_rentier' => 'boolean',
            'fo_autreRevenu' => 'boolean',
            'fo_assurance' => 'boolean',
            'fo_autreDeduction' => 'boolean',
            'fo_autreInformations' => 'boolean',
        ]);

        // Met à jour une entité Prive
        $prive = Prive::findOrFail($id);
        $prive->update($request->all());
        return response()->json($prive);
    }

    public function destroy($id)
    {
        // Supprime une entité Prive
        $prive = Prive::findOrFail($id);
        $prive->delete();
        return response()->json(null, 204);
    }

    public function getPriveByUserId($userId)
    {
        $prive = Prive::where('user_id', $userId)->first();

        if (!$prive) {
            return response()->json(['message' => 'Aucun enregistrement trouvé'], 404);
        }

        return response()->json($prive);
    }

    // Méthode pour récuperer les formulaires du privé
    public function getFormulairesPrive($userId)
    {
        // Récupère le Prive d'un utilisateur avec ses relations définies
        $prive = Prive::with([
            'user',
            'autresInformations',
            'autresPersonnesACharge',
            'banques',
            'deductions',
            'conjoints',
            'enfants',
            'immobiliers',
            'indemniteAssurances',
            'interetDettes',
            'enfants.pensionsAlimentaires',
            'rentier',
            'revenus',
            'titres',
        ])->where('user_id', $userId)->first();

        if (!$prive) {
            return response()->json(['message' => 'Aucun enregistrement trouvé'], 404);
        }

        return response()->json($prive);
    }   


    

}