"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Loader2, Plus, Trash2 } from "lucide-react"
import axios from "axios"
import PensionAlimentaire, { type PensionAlimentaireData } from "@/components/formulaires/pension-alimentaire"
import { ConfigurationServicePlaceholders } from "aws-sdk/lib/config_service_placeholders"

interface EnfantsProps {
  data: EnfantsData | null
  onUpdate: (data: EnfantsData) => void
  onNext: () => void
  onPrev: () => void
}

export interface Enfant {
  enfant_id?: number
  prive_id?: number
  nom: string
  prenom: string
  dateNaissance: string // Format YYYY-MM-DD pour les inputs
  adresse: string
  codePostal: string
  localite: string
  noAVS: string
  noContribuable: string
  revenuBrut: string // DECIMAL(10, 2) en BDD, string pour les inputs
  fortuneNet: string // DECIMAL(10, 2) en BDD, string pour les inputs
  avantAgeScolaire: boolean
  handicap: boolean
  domicileAvecParents: boolean
  parentsViventEnsemble: boolean
  gardeAlternee: boolean
  priseEnChargeFraisEgale: boolean
  revenuNetSuperieurAAutreParent: boolean
  fraisGarde: string // DECIMAL(10, 2) en BDD, string pour les inputs
  primeAssuranceMaladie: string // DECIMAL(10, 2) en BDD, string pour les inputs
  subsideAssuranceMaladie: string // DECIMAL(10, 2) en BDD, string pour les inputs
  fraisMedicaux: string // DECIMAL(10, 2) en BDD, string pour les inputs
  primeAssuranceAccident: string // DECIMAL(10, 2) en BDD, string pour les inputs
  allocationsFamilialesSuisse: string // DECIMAL(10, 2) en BDD, string pour les inputs
  montantInclusDansSalaireBrut: boolean
  allocationsFamilialesEtranger: string // DECIMAL(10, 2) en BDD, string pour les inputs
  fo_scolaire: boolean
  fo_scolaireStope: boolean
  fo_certificatSalaire: boolean
  fo_attestationFortune: boolean
  fo_preuveVersementPensionAlim: boolean
  fo_preuveEncaissementPensionAlim: boolean
  fo_avanceScarpa: boolean
  fo_fraisGardeEffectifs: boolean
  fo_attestationAMPrimesAnnuel: boolean
  fo_attestationAMFraisMedicaux: boolean
  fo_attestationPaiementAssuranceAccident: boolean
  // Propriété temporaire pour l'UI, non stockée en BDD
  _hasPensionAlimentaire?: boolean
}

export interface EnfantsData {
  enfants: Enfant[]
  pensionsAlimentaires: PensionAlimentaireData[]
}

export default function Enfants({ data, onUpdate, onNext, onPrev }: EnfantsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<EnfantsData>({
    enfants: [],
    pensionsAlimentaires: [],
  })

  // Initialiser les données du formulaire si elles existent
  useEffect(() => {
    if (data) {
      // Ajouter la propriété temporaire _hasPensionAlimentaire pour l'UI
      const enfantsWithPensionFlag = data.enfants.map((enfant, index) => {
        const hasPension = data.pensionsAlimentaires.some(
          (pension) => pension.enfant_id === index || pension.enfant_id === enfant.enfant_id,
        )
        return { ...enfant, _hasPensionAlimentaire: hasPension }
      })

      setFormData({
        ...data,
        enfants: enfantsWithPensionFlag,
      })
    } else {
      // Si pas de données, initialiser avec un enfant vide
      addEnfant()
    }
  }, [data])

  // Ajouter un enfant
  const addEnfant = () => {
    setFormData((prev) => ({
      ...prev,
      enfants: [
        ...prev.enfants,
        {
          nom: "",
          prenom: "",
          dateNaissance: "",
          adresse: "",
          codePostal: "",
          localite: "",
          noAVS: "",
          noContribuable: "",
          revenuBrut: "0",
          fortuneNet: "0",
          avantAgeScolaire: false,
          handicap: false,
          domicileAvecParents: true,
          parentsViventEnsemble: false,
          gardeAlternee: false,
          priseEnChargeFraisEgale: false,
          revenuNetSuperieurAAutreParent: false,
          fraisGarde: "0",
          primeAssuranceMaladie: "0",
          subsideAssuranceMaladie: "0",
          fraisMedicaux: "0",
          primeAssuranceAccident: "0",
          allocationsFamilialesSuisse: "0",
          montantInclusDansSalaireBrut: false,
          allocationsFamilialesEtranger: "0",
          fo_scolaire: false,
          fo_scolaireStope: false,
          fo_certificatSalaire: false,
          fo_attestationFortune: false,
          fo_preuveVersementPensionAlim: false,
          fo_preuveEncaissementPensionAlim: false,
          fo_avanceScarpa: false,
          fo_fraisGardeEffectifs: false,
          fo_attestationAMPrimesAnnuel: false,
          fo_attestationAMFraisMedicaux: false,
          fo_attestationPaiementAssuranceAccident: false,
          _hasPensionAlimentaire: false,
        },
      ],
    }))
  }

// Supprimer un enfant et sa pension alimentaire
const removeEnfant = async (index: number) => {
  const enfant = formData.enfants[index];
  const token = localStorage.getItem("auth_token")!;

  await Promise.all([
    enfant._hasPensionAlimentaire && 
      axios.delete(`http://127.0.0.1:8000/api/pensionsalimentaires/enfants/${enfant.enfant_id || index}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      }),
    axios.delete(`http://127.0.0.1:8000/api/enfants/${enfant.enfant_id}`, { 
      headers: { Authorization: `Bearer ${token}` } 
    })
  ]);

  setFormData(prev => ({
    enfants: prev.enfants.filter((_, i) => i !== index),
    pensionsAlimentaires: prev.pensionsAlimentaires.filter(
      p => p.enfant_id !== (enfant.enfant_id || index)
    )
  }));
};
  

  // Mettre à jour un enfant
  const updateEnfant = (index: number, field: keyof Enfant, value: string | boolean) => {
    const updatedEnfants = [...formData.enfants]
    updatedEnfants[index] = {
      ...updatedEnfants[index],
      [field]: value,
    }
    setFormData((prev) => ({
      ...prev,
      enfants: updatedEnfants,
    }))
  }

  // Mettre à jour le statut de la pension alimentaire
const updateHasPensionAlimentaire = (index: number, hasPension: boolean) => {
  const updatedEnfants = [...formData.enfants]
  let updatedPensions = [...formData.pensionsAlimentaires]

  const enfant = formData.enfants[index]
  const enfantId = enfant.enfant_id || index

  updatedEnfants[index] = {
    ...updatedEnfants[index],
    _hasPensionAlimentaire: hasPension,
  }

  if (!hasPension) {
    // ❌ Supprimer les pensions et mettre les preuves à false
    updatedPensions = updatedPensions.filter(
      (p) => p.enfant_id !== index && p.enfant_id !== enfant.enfant_id
    )
    updatedEnfants[index].fo_preuveVersementPensionAlim = false
    updatedEnfants[index].fo_preuveEncaissementPensionAlim = false
  } else if (
    !updatedPensions.some(
      (p) => p.enfant_id === enfantId
    )
  ) {
    // ✅ Ajouter une pension par défaut si elle n'existe pas
const defaultPension: PensionAlimentaireData = {
  enfant_id: enfantId,
  statut: "verse",
  montantContribution: "0",
  nom: "",
  prenom: "",
  noContribuable: "",
}

    updatedPensions.push(defaultPension)

    // ✅ Définir les fo_ en fonction du statut par défaut
    updatedEnfants[index].fo_preuveVersementPensionAlim = defaultPension.statut === "verse"
    updatedEnfants[index].fo_preuveEncaissementPensionAlim = defaultPension.statut === "recu"
  } else {
    // ✅ Si la pension existe déjà, mettre à jour les fo_ en fonction de son statut
    const existing = updatedPensions.find((p) => p.enfant_id === enfantId)

    updatedEnfants[index].fo_preuveVersementPensionAlim = existing?.statut === "verse"
    updatedEnfants[index].fo_preuveEncaissementPensionAlim = existing?.statut === "recu"
  }

  setFormData((prev) => ({
    ...prev,
    enfants: updatedEnfants,
    pensionsAlimentaires: updatedPensions,
  }))
}


  // Mettre à jour les données de pension alimentaire
  const updatePensionAlimentaire = (index: number, pensionData: PensionAlimentaireData) => {
    const enfantId = formData.enfants[index].enfant_id || index
    const updatedPensions = [...formData.pensionsAlimentaires]

    // Trouver l'index de la pension existante pour cet enfant
    const pensionIndex = updatedPensions.findIndex((p) => p.enfant_id === enfantId || p.enfant_id === index)

    if (pensionIndex >= 0) {
      // Mettre à jour la pension existante
      updatedPensions[pensionIndex] = {
        ...pensionData,
        enfant_id: enfantId,
      }
    } else {
      // Ajouter une nouvelle pension
      updatedPensions.push({
        ...pensionData,
        enfant_id: enfantId,
      })
    }

    // Mettre à jour les flags de preuve dans l'enfant
    const updatedEnfants = [...formData.enfants]
    updatedEnfants[index] = {
      ...updatedEnfants[index],
      fo_preuveVersementPensionAlim: pensionData.statut === "verse" ,
      fo_preuveEncaissementPensionAlim: pensionData.statut === "recu",
    }

    setFormData((prev) => ({
      ...prev,
      enfants: updatedEnfants,
      pensionsAlimentaires: updatedPensions,
    }))
  }

  // Obtenir les données de pension pour un enfant
  const getPensionData = (index: number): PensionAlimentaireData | null => {
    const enfantId = formData.enfants[index].enfant_id || index
    const pension = formData.pensionsAlimentaires.find((p) => p.enfant_id === enfantId || p.enfant_id === index)
    return pension || null
  }

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        throw new Error("Vous devez être connecté pour effectuer cette action.")
      }

      // Nettoyer les données avant de les envoyer (supprimer les propriétés temporaires)
      const cleanedData: EnfantsData = {
        enfants: formData.enfants.map(({ _hasPensionAlimentaire, ...enfant }) => enfant),
        pensionsAlimentaires: formData.pensionsAlimentaires,
      }

      // Mettre à jour les données dans le composant parent
      onUpdate(cleanedData)

      // Passer à l'étape suivante
      onNext()
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error)
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || "Une erreur est survenue lors de la soumission du formulaire.")
      } else {
        setError("Une erreur est survenue lors de la soumission du formulaire. Veuillez réessayer.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Informations des enfants à charge</h3>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {formData.enfants.map((enfant, index) => (
            <Card key={index} className="border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-md">Enfant {index + 1}</CardTitle>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeEnfant(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Informations personnelles */}
                <div className="space-y-4">
                  <h4 className="font-medium">Informations personnelles</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`nom-${index}`}>Nom</Label>
                      <Input
                        id={`nom-${index}`}
                        value={enfant.nom}
                        onChange={(e) => updateEnfant(index, "nom", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`prenom-${index}`}>Prénom</Label>
                      <Input
                        id={`prenom-${index}`}
                        value={enfant.prenom}
                        onChange={(e) => updateEnfant(index, "prenom", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`dateNaissance-${index}`}>Date de naissance</Label>
                    <Input
                      id={`dateNaissance-${index}`}
                      type="date"
                      value={enfant.dateNaissance}
                      onChange={(e) => updateEnfant(index, "dateNaissance", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`adresse-${index}`}>Adresse (si différente)</Label>
                    <Input
                      id={`adresse-${index}`}
                      value={enfant.adresse}
                      onChange={(e) => updateEnfant(index, "adresse", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`codePostal-${index}`}>Code postal</Label>
                      <Input
                        id={`codePostal-${index}`}
                        value={enfant.codePostal}
                        onChange={(e) => updateEnfant(index, "codePostal", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`localite-${index}`}>Localité</Label>
                      <Input
                        id={`localite-${index}`}
                        value={enfant.localite}
                        onChange={(e) => updateEnfant(index, "localite", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`noAVS-${index}`}>Numéro AVS</Label>
                      <Input
                        id={`noAVS-${index}`}
                        value={enfant.noAVS}
                        onChange={(e) => updateEnfant(index, "noAVS", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`noContribuable-${index}`}>Numéro de contribuable</Label>
                      <Input
                        id={`noContribuable-${index}`}
                        value={enfant.noContribuable}
                        onChange={(e) => updateEnfant(index, "noContribuable", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`revenuBrut-${index}`}>Revenu brut (CHF)</Label>
                      <Input
                        id={`revenuBrut-${index}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={enfant.revenuBrut}
                        onChange={(e) => updateEnfant(index, "revenuBrut", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`fortuneNet-${index}`}>Fortune nette (CHF)</Label>
                      <Input
                        id={`fortuneNet-${index}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={enfant.fortuneNet}
                        onChange={(e) => updateEnfant(index, "fortuneNet", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Situation de l'enfant */}
                <div className="space-y-4">
                  <h4 className="font-medium">Situation de l&apos;enfant</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`avantAgeScolaire-${index}`}
                        checked={enfant.avantAgeScolaire}
                        onCheckedChange={(checked) => updateEnfant(index, "avantAgeScolaire", checked as boolean)}
                      />
                      <Label htmlFor={`avantAgeScolaire-${index}`}>Avant l&apos;âge scolaire</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`handicap-${index}`}
                        checked={enfant.handicap}
                        onCheckedChange={(checked) => updateEnfant(index, "handicap", checked as boolean)}
                      />
                      <Label htmlFor={`handicap-${index}`}>Enfant avec handicap</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`domicileAvecParents-${index}`}
                        checked={enfant.domicileAvecParents}
                        onCheckedChange={(checked) => updateEnfant(index, "domicileAvecParents", checked as boolean)}
                      />
                      <Label htmlFor={`domicileAvecParents-${index}`}>Domicile avec les parents</Label>
                    </div>
                  </div>
                </div>

                {/* Situation des parents */}
                <div className="space-y-4">
                  <h4 className="font-medium">Situation des parents</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`parentsViventEnsemble-${index}`}
                        checked={enfant.parentsViventEnsemble}
                        onCheckedChange={(checked) => updateEnfant(index, "parentsViventEnsemble", checked as boolean)}
                      />
                      <Label htmlFor={`parentsViventEnsemble-${index}`}>Les parents vivent ensemble</Label>
                    </div>
                  </div>

                  {!enfant.parentsViventEnsemble && (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`gardeAlternee-${index}`}
                            checked={enfant.gardeAlternee}
                            onCheckedChange={(checked) => updateEnfant(index, "gardeAlternee", checked as boolean)}
                          />
                          <Label htmlFor={`gardeAlternee-${index}`}>Garde alternée</Label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`priseEnChargeFraisEgale-${index}`}
                            checked={enfant.priseEnChargeFraisEgale}
                            onCheckedChange={(checked) =>
                              updateEnfant(index, "priseEnChargeFraisEgale", checked as boolean)
                            }
                          />
                          <Label htmlFor={`priseEnChargeFraisEgale-${index}`}>
                            Prise en charge des frais à parts égales
                          </Label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`revenuNetSuperieurAAutreParent-${index}`}
                            checked={enfant.revenuNetSuperieurAAutreParent}
                            onCheckedChange={(checked) =>
                              updateEnfant(index, "revenuNetSuperieurAAutreParent", checked as boolean)
                            }
                          />
                          <Label htmlFor={`revenuNetSuperieurAAutreParent-${index}`}>
                            Revenu net supérieur à l&apos;autre parent
                          </Label>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Composant Pension Alimentaire */}
                <PensionAlimentaire
                  enfantId={index}
                  data={getPensionData(index)}
                  hasPension={enfant._hasPensionAlimentaire || false}
                  onHasPensionChange={(hasPension) => updateHasPensionAlimentaire(index, hasPension)}
                  onUpdate={(pensionData) => updatePensionAlimentaire(index, pensionData)}
                />

                {/* Frais et assurances */}
                <div className="space-y-4">
                  <h4 className="font-medium">Frais et assurances</h4>
                  <div className="space-y-2">
                    <Label htmlFor={`fraisGarde-${index}`}>Frais de garde (CHF)</Label>
                    <Input
                      id={`fraisGarde-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={enfant.fraisGarde}
                      onChange={(e) => updateEnfant(index, "fraisGarde", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`primeAssuranceMaladie-${index}`}>Prime d&apos;assurance maladie (CHF)</Label>
                    <Input
                      id={`primeAssuranceMaladie-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={enfant.primeAssuranceMaladie}
                      onChange={(e) => updateEnfant(index, "primeAssuranceMaladie", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`subsideAssuranceMaladie-${index}`}>Subside d&apos;assurance maladie (CHF)</Label>
                    <Input
                      id={`subsideAssuranceMaladie-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={enfant.subsideAssuranceMaladie}
                      onChange={(e) => updateEnfant(index, "subsideAssuranceMaladie", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`fraisMedicaux-${index}`}>Frais médicaux (CHF)</Label>
                    <Input
                      id={`fraisMedicaux-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={enfant.fraisMedicaux}
                      onChange={(e) => updateEnfant(index, "fraisMedicaux", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`primeAssuranceAccident-${index}`}>Prime d&apos;assurance accident (CHF)</Label>
                    <Input
                      id={`primeAssuranceAccident-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={enfant.primeAssuranceAccident}
                      onChange={(e) => updateEnfant(index, "primeAssuranceAccident", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Allocations familiales */}
                <div className="space-y-4">
                  <h4 className="font-medium">Allocations familiales</h4>
                  <div className="space-y-2">
                    <Label htmlFor={`allocationsFamilialesSuisse-${index}`}>Allocations familiales suisses (CHF)</Label>
                    <Input
                      id={`allocationsFamilialesSuisse-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={enfant.allocationsFamilialesSuisse}
                      onChange={(e) => updateEnfant(index, "allocationsFamilialesSuisse", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`montantInclusDansSalaireBrut-${index}`}
                        checked={enfant.montantInclusDansSalaireBrut}
                        onCheckedChange={(checked) =>
                          updateEnfant(index, "montantInclusDansSalaireBrut", checked as boolean)
                        }
                      />
                      <Label htmlFor={`montantInclusDansSalaireBrut-${index}`}>
                        Montant inclus dans le salaire brut
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`allocationsFamilialesEtranger-${index}`}>
                      Allocations familiales étrangères (CHF)
                    </Label>
                    <Input
                      id={`allocationsFamilialesEtranger-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={enfant.allocationsFamilialesEtranger}
                      onChange={(e) => updateEnfant(index, "allocationsFamilialesEtranger", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Documents disponibles */}
                <div className="space-y-4">
                  <h4 className="font-medium">Documents disponibles</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`fo_scolaire-${index}`}
                          checked={enfant.fo_scolaire}
                          onCheckedChange={(checked) => updateEnfant(index, "fo_scolaire", checked as boolean)}
                        />
                        <Label htmlFor={`fo_scolaire-${index}`}>Attestation scolaire</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`fo_scolaireStope-${index}`}
                          checked={enfant.fo_scolaireStope}
                          onCheckedChange={(checked) => updateEnfant(index, "fo_scolaireStope", checked as boolean)}
                        />
                        <Label htmlFor={`fo_scolaireStope-${index}`}>Attestation fin de scolarité</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`fo_certificatSalaire-${index}`}
                          checked={enfant.fo_certificatSalaire}
                          onCheckedChange={(checked) => updateEnfant(index, "fo_certificatSalaire", checked as boolean)}
                        />
                        <Label htmlFor={`fo_certificatSalaire-${index}`}>Certificat de salaire</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`fo_attestationFortune-${index}`}
                          checked={enfant.fo_attestationFortune}
                          onCheckedChange={(checked) =>
                            updateEnfant(index, "fo_attestationFortune", checked as boolean)
                          }
                        />
                        <Label htmlFor={`fo_attestationFortune-${index}`}>Attestation de fortune</Label>
                      </div>
                    </div>

                    {/* <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`fo_preuveVersementPensionAlim-${index}`}
                          checked={enfant.fo_preuveVersementPensionAlim}
                          onCheckedChange={(checked) =>
                            updateEnfant(index, "fo_preuveVersementPensionAlim", checked as boolean)
                          }
                        />
                        <Label htmlFor={`fo_preuveVersementPensionAlim-${index}`}>
                          Preuve versement pension alimentaire
                        </Label>
                      </div>
                    </div> */}

                    {/* <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`fo_preuveEncaissementPensionAlim-${index}`}
                          checked={enfant.fo_preuveEncaissementPensionAlim}
                          onCheckedChange={(checked) =>
                            updateEnfant(index, "fo_preuveEncaissementPensionAlim", checked as boolean)
                          }
                        />
                        <Label htmlFor={`fo_preuveEncaissementPensionAlim-${index}`}>
                          Preuve encaissement pension alimentaire
                        </Label>
                      </div>
                    </div> */}

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`fo_avanceScarpa-${index}`}
                          checked={enfant.fo_avanceScarpa}
                          onCheckedChange={(checked) => updateEnfant(index, "fo_avanceScarpa", checked as boolean)}
                        />
                        <Label htmlFor={`fo_avanceScarpa-${index}`}>Avance SCARPA</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`fo_fraisGardeEffectifs-${index}`}
                          checked={enfant.fo_fraisGardeEffectifs}
                          onCheckedChange={(checked) =>
                            updateEnfant(index, "fo_fraisGardeEffectifs", checked as boolean)
                          }
                        />
                        <Label htmlFor={`fo_fraisGardeEffectifs-${index}`}>Justificatifs frais de garde</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`fo_attestationAMPrimesAnnuel-${index}`}
                          checked={enfant.fo_attestationAMPrimesAnnuel}
                          onCheckedChange={(checked) =>
                            updateEnfant(index, "fo_attestationAMPrimesAnnuel", checked as boolean)
                          }
                        />
                        <Label htmlFor={`fo_attestationAMPrimesAnnuel-${index}`}>
                          Attestation primes assurance maladie
                        </Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`fo_attestationAMFraisMedicaux-${index}`}
                          checked={enfant.fo_attestationAMFraisMedicaux}
                          onCheckedChange={(checked) =>
                            updateEnfant(index, "fo_attestationAMFraisMedicaux", checked as boolean)
                          }
                        />
                        <Label htmlFor={`fo_attestationAMFraisMedicaux-${index}`}>Attestation frais médicaux</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`fo_attestationPaiementAssuranceAccident-${index}`}
                          checked={enfant.fo_attestationPaiementAssuranceAccident}
                          onCheckedChange={(checked) =>
                            updateEnfant(index, "fo_attestationPaiementAssuranceAccident", checked as boolean)
                          }
                        />
                        <Label htmlFor={`fo_attestationPaiementAssuranceAccident-${index}`}>
                          Attestation paiement assurance accident
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button type="button" variant="outline" className="w-full" onClick={addEnfant}>
            <Plus className="h-4 w-4 mr-2" /> Ajouter un enfant
          </Button>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-between mt-6">
            <Button type="button" variant="outline" onClick={onPrev}>
              Retour
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Chargement...
                </>
              ) : (
                "Continuer"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
