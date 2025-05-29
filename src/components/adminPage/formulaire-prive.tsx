/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Edit, Save, X, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Définition des interfaces pour les données du formulaire

export interface User {
  user_id: number
  nom: string
  email: string
  localite: string
  adresse: string
  codePostal: string
  numeroTelephone: string
  role: string
  statut: string
  dateCreation: string
}

export interface AutreInformation {
  autre_informations_id: number
  prive_id: number
  fo_versementBoursesEtudes: number
  fo_pensionsPercuesEnfantMajeurACharge: number
  fo_prestationsAVSSPC: number
  fo_prestationsFamilialesSPC: number
  fo_prestationsVilleCommune: number
  fo_allocationsImpotents: number
  fo_reparationTortMoral: number
  fo_hospiceGeneral: number
  fo_institutionBienfaisance: number
}

export interface AutrePersonneACharge {
  autre_personne_id: number
  prive_id: number
  nom: string
  prenom: string
  dateNaissance: string
  degreParente: string
  nbPersonneParticipation: number
  vieAvecPersonneCharge: number
  revenusBrutPersonneACharge: string
  fortuneNetPersonneACharge: string
  montantVerseAPersonneACharge: string
  fo_preuveVersementEffectue: number
}

export interface Banque {
  banque_id: number
  prive_id: number
  fo_attestationFinAnnee: number
  nb_compte?: string // Ajout du nombre de compte (optionnel)
}

export interface Deduction {
  autre_deduction_id: number
  prive_id: number
  fo_rachatLPP: boolean
  fo_attestation3emePilierA: boolean
  fo_attestation3emePilierB: boolean
  fo_attestationAssuranceMaladie: boolean
  fo_attestationAssuranceAccident: boolean
  fo_cotisationAVS: boolean
  fo_fraisFormationProfessionnel: boolean
  fo_fraisMedicaux: boolean
  fo_fraisHandicap: boolean
  fo_dons: boolean
  fo_versementPartisPolitiques: boolean
}

export interface Conjoint {
  conjoint_id: number
  prive_id: number
  nom: string
  prenom: string
  email: string
  localite: string
  adresse: string
  codePostal: string
  numeroTelephone: string
  etatCivil: string
  dateNaissance: string
  nationalite: string
  professionExercee: string
  contributionReligieuse: string
}

export interface PensionAlimentaire {
  pension_id: number
  enfant_id: number
  statut: string
  montantContribution: string
  nom: string
  prenom: string
  noContribuable: string
}

export interface Enfant {
  enfant_id: number
  prive_id: number
  nom: string
  prenom: string
  dateNaissance: string
  adresse: string
  codePostal: string
  localite: string
  noAVS: string
  noContribuable: string
  revenuBrut: number
  fortuneNet: number | null
  avantAgeScolaire: boolean
  handicap: boolean
  domicileAvecParents: boolean
  parentsViventEnsemble: boolean
  gardeAlternee: boolean
  priseEnChargeFraisEgale: boolean
  revenuNetSuperieurAAutreParent: boolean
  fraisGarde: string | null
  primeAssuranceMaladie: string
  subsideAssuranceMaladie: string | null
  fraisMedicaux: string | null
  primeAssuranceAccident: string | null
  allocationsFamilialesSuisse: string | null
  montantInclusDansSalaireBrut: boolean
  allocationsFamilialesEtranger: string | null
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
  pensions_alimentaires: PensionAlimentaire[]
}

export interface Immobilier {
  immobilier_id: number
  prive_id: number
  statut: string
  canton: string
  commune: string
  pays: string
  noParcelleGeneve: string
  adresseComplete: string
  anneeConstruction: number
  occupeDesLe: string
  dateAchat: string
  pourcentageProprietaire: number
  autreProprietaire: string
  prixAchat: number
  valeurLocativeBrut: number
  loyersEncaisses: number
  fraisEntretienDeductibles: number
  fo_bienImmobilier: boolean
  fo_attestationValeurLocative: boolean
  fo_taxeFonciereBiensEtranger: boolean
  fo_factureEntretienImmeuble: boolean
}

export interface IndemniteAssurance {
  indemnite_assurance_id: number
  prive_id: number
  fo_chomage: boolean
  fo_maladie: boolean
  fo_accident: boolean
  fo_materniteMilitairePC: boolean
}

export interface InteretDette {
  dettes_id: number
  prive_id: number
  fo_attestationEmprunt: boolean
  fo_attestationCarteCredit: boolean
  fo_attestationHypotheque: boolean
}

export interface Rentier {
  rentier_id: number
  prive_id: number
  fo_attestationRenteAVSAI: boolean
  fo_attestationRentePrevoyance: boolean
  fo_autresRentes: boolean
}

export interface Revenu {
  revenu_id: number
  prive_id: number
  indemnites: boolean
  interruptionsTravailNonPayees: boolean
  interuptionsTravailNonPayeesDebut: string | null
  interuptionsTravailNonPayeesFin: string | null
  activiteIndependante: boolean
  prestationsSociales: boolean
  subsidesAssuranceMaladie: boolean
  fo_certificatSalaire: boolean
  fo_renteViagere: boolean
  fo_allocationLogement: boolean
  fo_preuveEncaissementSousLoc: boolean
  fo_gainsAccessoires: boolean
  fo_attestationAutresRevenus: boolean
  fo_etatFinancier: boolean
}

export interface Titre {
  titre_id: number
  prive_id: number
  compteBancairePostale: boolean
  actionOuPartSociale: boolean
  autreElementFortune: boolean
  aucunElementFortune: boolean
  objetsValeur: boolean
  fo_gainJeux: boolean
  fo_releveFiscal: boolean
}

export interface FormulaireComplet {
  prive_id: number
  user_id: number
  dateNaissance: string
  nationalite: string
  etatCivil: string
  fo_enfants: boolean
  fo_autrePersonneCharge: boolean
  fo_revenu: boolean
  fo_independant: number
  fo_indemnitesAssurance: number
  fo_rentier: boolean
  fo_autresRevenus: number
  fo_banques: boolean
  fo_titres: boolean
  fo_immobiliers: boolean
  fo_dettes: boolean
  fo_assurances: boolean
  fo_autresDeductions: boolean
  fo_autresInformations: boolean
  nom?: string
  prenom?: string
  user: User
  autres_informations?: AutreInformation[]
  autres_personnes_a_charge?: AutrePersonneACharge[]
  banques?: Banque[]
  deductions?: Deduction[]
  conjoints?: Conjoint[]
  enfants?: Enfant[]
  immobiliers?: Immobilier[]
  indemnite_assurances?: IndemniteAssurance[]
  interet_dettes?: InteretDette[]
  rentier?: Rentier[]
  revenus?: Revenu[]
  titres?: Titre[]
}

interface FormulairePriveProps {
  userId: number // Ceci est en fait l'ID utilisateur, pas l'ID privé
  onSubmitSuccess?: (data: any) => Promise<boolean>
}

export default function FormulairePrive({ userId, onSubmitSuccess }: FormulairePriveProps) {
  const [formulaireData, setFormulaireData] = useState<FormulaireComplet | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)
  const maxRetries = 3
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // États pour l'édition
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false)
  const [isEditingFormulaires, setIsEditingFormulaires] = useState(false)
  const [editedPersonalInfo, setEditedPersonalInfo] = useState<Partial<FormulaireComplet> | null>(null)
  const [editedFormulaires, setEditedFormulaires] = useState<Partial<FormulaireComplet> | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const fetchFormulaireData = async (isRetry = false) => {
    try {
      if (isRetry) {
        setIsRetrying(true)
      } else {
        setLoading(true)
      }

      console.log(`Tentative de connexion à l'API: ${API_URL}/prives/complet/${userId}`)

      try {
        const response = await axios.get(`${API_URL}/prives/complet/${userId}`)
        console.log("Données reçues:", response.data)
        setFormulaireData(response.data)
        setEditedPersonalInfo(response.data)
        setEditedFormulaires(response.data)
        setRetryCount(0) // Réinitialiser le compteur de tentatives en cas de succès
        setError(null)
      } catch (apiError) {
        console.error("Erreur API, utilisation des données de secours:", apiError)

        // Données de secours pour tester l'interface
        const fallbackData = {
          prive_id: userId,
          user_id: userId,
          dateNaissance: "1990-01-01",
          nationalite: "Suisse",
          etatCivil: "celibataire",
          fo_enfants: false,
          fo_autrePersonneCharge: false,
          fo_revenu: false,
          fo_independant: 0,
          fo_indemnitesAssurance: 0,
          fo_rentier: false,
          fo_autresRevenus: 0,
          fo_banques: false,
          fo_titres: false,
          fo_immobiliers: false,
          fo_dettes: false,
          fo_assurances: false,
          fo_autresDeductions: false,
          fo_autresInformations: false,
          nom: "Nom Test",
          prenom: "Prénom Test",
          user: { 
            user_id: userId,
            nom: "Nom Test",
            prenom: "Prénom Test",
            email: "",
            localite: "",
            adresse: "",
            codePostal: "",
            numeroTelephone: "",
            role: "prive",
            statut: "approved",
            dateCreation: ""
          },
          conjoints: [],
          enfants: [],
          autres_personnes_a_charge: [],
          banques: [],
          interet_dettes: [],
          immobiliers: [],
          indemnite_assurances: [],
          revenus: [],
          titres: [],
          deductions: [],
          autres_informations: [],
        }

        setFormulaireData(fallbackData)
        setEditedPersonalInfo(fallbackData)
        setEditedFormulaires(fallbackData)

        toast.warning("Utilisation de données de test - L'API n'est pas accessible")
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données du formulaire:", error)
      setError("Impossible de charger les données du formulaire")

      // Si nous n'avons pas atteint le nombre maximum de tentatives, réessayer
      if (retryCount < maxRetries) {
        const nextRetryCount = retryCount + 1
        setRetryCount(nextRetryCount)

        // Augmenter le délai entre les tentatives (backoff exponentiel)
        const retryDelay = Math.min(2000 * Math.pow(2, nextRetryCount - 1), 10000)

        console.log(`Nouvelle tentative dans ${retryDelay}ms (tentative ${nextRetryCount}/${maxRetries})`)

        // Nettoyer tout timeout existant
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current)
        }

        // Configurer un nouveau timeout pour réessayer
        retryTimeoutRef.current = setTimeout(() => {
          fetchFormulaireData(true)
        }, retryDelay)
      } else {
        toast.error("Impossible de charger les données après plusieurs tentatives")
      }
    } finally {
      setLoading(false)
      setIsRetrying(false)
    }
  }

  useEffect(() => {
    if (!userId) {
      console.error("userId est manquant ou invalide:", userId)
      setError("ID utilisateur manquant ou invalide")
      setLoading(false)
      return
    }

    console.log("Démarrage du chargement des données avec userId:", userId)
    fetchFormulaireData()

    // Nettoyage des timeouts lors du démontage du composant
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [userId, API_URL])

  const formatDate = (dateString: string) => {
    if (!dateString) return "Non spécifié"
    return new Date(dateString).toLocaleDateString()
  }

  const formatMontant = (montant: number | undefined) => {
    if (montant === undefined || montant === null) return "Non spécifié"
    return new Intl.NumberFormat("fr-CH", {
      style: "currency",
      currency: "CHF",
    }).format(montant)
  }

  // Fonction pour gérer les changements dans les champs d'informations personnelles
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditedPersonalInfo((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  // Fonction pour gérer les changements dans les formulaires activés
  const handleFormulaireChange = (name: string, value: boolean) => {
    setEditedFormulaires((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  // Fonction pour sauvegarder les informations personnelles
  const savePersonalInfo = async () => {
    if (!editedPersonalInfo || !formulaireData) return

    setIsSaving(true)
    try {
      const response = await axios.put(`${API_URL}/prives/${formulaireData.prive_id}`, {
        dateNaissance: editedPersonalInfo.dateNaissance,
        nationalite: editedPersonalInfo.nationalite,
        etatCivil: editedPersonalInfo.etatCivil,
      })

      if (response.data) {
        setFormulaireData((prev) => (prev ? { ...prev, ...editedPersonalInfo } : null))
        toast.success("Informations personnelles mises à jour avec succès")
        setIsEditingPersonalInfo(false)

        // Appeler onSubmitSuccess si fourni
        if (onSubmitSuccess) {
          await onSubmitSuccess(response.data)
        }
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des informations personnelles:", error)
      toast.error("Erreur lors de la mise à jour des informations personnelles")
    } finally {
      setIsSaving(false)
    }
  }

  // Fonction pour sauvegarder les formulaires activés
  const saveFormulaires = async () => {
    if (!editedFormulaires || !formulaireData) return

    setIsSaving(true)
    try {
      const formulairesData = {
        fo_banques: editedFormulaires.fo_banques,
        fo_dettes: editedFormulaires.fo_dettes,
        fo_immobiliers: editedFormulaires.fo_immobiliers,
        fo_revenu: editedFormulaires.fo_revenu,
        fo_autrePersonneCharge: editedFormulaires.fo_autrePersonneCharge,
        fo_rentier: editedFormulaires.fo_rentier,
        fo_titres: editedFormulaires.fo_titres,
        fo_assurances: editedFormulaires.fo_assurances,
        fo_autresDeductions: editedFormulaires.fo_autresDeductions,
        fo_autresInformations: editedFormulaires.fo_autresInformations,
      }

      const response = await axios.put(`${API_URL}/prives/${formulaireData.prive_id}`, formulairesData)

      if (response.data) {
        setFormulaireData((prev) => (prev ? { ...prev, ...editedFormulaires } : null))
        toast.success("Formulaires activés mis à jour avec succès")
        setIsEditingFormulaires(false)

        // Appeler onSubmitSuccess si fourni
        if (onSubmitSuccess) {
          await onSubmitSuccess(response.data)
        }
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des formulaires activés:", error)
      toast.error("Erreur lors de la mise à jour des formulaires activés")
    } finally {
      setIsSaving(false)
    }
  }

  // Fonction pour annuler l'édition
  const cancelEditing = (type: "personal" | "formulaires") => {
    if (type === "personal") {
      setEditedPersonalInfo(formulaireData)
      setIsEditingPersonalInfo(false)
    } else {
      setEditedFormulaires(formulaireData)
      setIsEditingFormulaires(false)
    }
  }

  // Affichage pendant le chargement initial
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="flex items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Chargement des données du formulaire...</span>
        </div>
      </div>
    )
  }

  // Affichage pendant les tentatives de rechargement
  if (isRetrying) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="flex items-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">
            Tentative de rechargement ({retryCount}/{maxRetries})...
          </span>
        </div>
      </div>
    )
  }

  // Affichage en cas d'erreur
  if (error || !formulaireData) {
    return (
      <div className="text-center py-8 space-y-4">
        <p className="text-red-500">{error || "Aucune donnée disponible"}</p>
        <Button
          onClick={() => {
            setError(null)
            setRetryCount(0)
            fetchFormulaireData()
          }}
        >
          Réessayer
        </Button>
      </div>
    )
  }

  const etatCivilOptions = [
    { value: "celibataire", label: "Célibataire" },
    { value: "marie", label: "Marié(e)" },
    { value: "divorce", label: "Divorcé(e)" },
    { value: "veuf", label: "Veuf/Veuve" },
    { value: "separe", label: "Séparé(e)" },
    { value: "pacse", label: "Pacsé(e)" },
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="informations-personnelles">
        <TabsList className="mb-4">
          <TabsTrigger value="informations-personnelles">Informations personnelles</TabsTrigger>
          <TabsTrigger value="situation-familiale">Situation familiale</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
          <TabsTrigger value="revenus">Revenus</TabsTrigger>
          <TabsTrigger value="deductions">Déductions</TabsTrigger>
          <TabsTrigger value="autres-informations">Autres informations</TabsTrigger>
        </TabsList>

        {/* Onglet Informations personnelles */}
        <TabsContent value="informations-personnelles">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Données personnelles</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingPersonalInfo(!isEditingPersonalInfo)}
                      disabled={isSaving}
                    >
                      {isEditingPersonalInfo ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                      {isEditingPersonalInfo ? "Annuler" : "Modifier"}
                    </Button>
                  </div>

                  {isEditingPersonalInfo ? (
                    <div className="space-y-4">

                      <div className="space-y-2">
                        <Label htmlFor="dateNaissance">Date de naissance</Label>
                        <Input
                          id="dateNaissance"
                          name="dateNaissance"
                          type="date"
                          value={
                            editedPersonalInfo?.dateNaissance
                              ? new Date(editedPersonalInfo.dateNaissance).toISOString().split("T")[0]
                              : ""
                          }
                          onChange={handlePersonalInfoChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nationalite">Nationalité</Label>
                        <Input
                          id="nationalite"
                          name="nationalite"
                          value={editedPersonalInfo?.nationalite || ""}
                          onChange={handlePersonalInfoChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="etatCivil">État civil</Label>
                        <Select
                          name="etatCivil"
                          value={
                            editedPersonalInfo?.etatCivil ??
                            formulaireData.etatCivil ??
                            ""
                          }
                          onValueChange={(value) =>
                            setEditedPersonalInfo((prev) =>
                              prev ? { ...prev, etatCivil: value } : null
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un état civil" />
                          </SelectTrigger>
                          <SelectContent>
                            {etatCivilOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="outline" onClick={() => cancelEditing("personal")} disabled={isSaving}>
                          Annuler
                        </Button>
                        <Button onClick={savePersonalInfo} disabled={isSaving}>
                          {isSaving ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Enregistrement...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Enregistrer
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Date de naissance:</span>
                        <span>{formatDate(formulaireData.dateNaissance)}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Nationalité:</span>
                        <span>{formulaireData.nationalite}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">État civil:</span>
                        <span>
                          {etatCivilOptions.find(opt => opt.value === formulaireData.etatCivil)?.label || formulaireData.etatCivil}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Formulaires activés</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingFormulaires(!isEditingFormulaires)}
                      disabled={isSaving}
                    >
                      {isEditingFormulaires ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                      {isEditingFormulaires ? "Annuler" : "Modifier"}
                    </Button>
                  </div>

                  {isEditingFormulaires ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="fo_banques" className="flex-1">
                          Banques
                        </Label>
                        <Switch
                          id="fo_banques"
                          checked={editedFormulaires?.fo_banques || false}
                          onCheckedChange={(checked) => handleFormulaireChange("fo_banques", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="fo_dettes" className="flex-1">
                          Dettes
                        </Label>
                        <Switch
                          id="fo_dettes"
                          checked={editedFormulaires?.fo_dettes || false}
                          onCheckedChange={(checked) => handleFormulaireChange("fo_dettes", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="fo_immobiliers" className="flex-1">
                          Immobiliers
                        </Label>
                        <Switch
                          id="fo_immobiliers"
                          checked={editedFormulaires?.fo_immobiliers || false}
                          onCheckedChange={(checked) => handleFormulaireChange("fo_immobiliers", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="fo_revenu" className="flex-1">
                          Revenu
                        </Label>
                        <Switch
                          id="fo_revenu"
                          checked={editedFormulaires?.fo_revenu || false}
                          onCheckedChange={(checked) => handleFormulaireChange("fo_revenu", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="fo_autrePersonneCharge" className="flex-1">
                          Autres personnes à charge
                        </Label>
                        <Switch
                          id="fo_autrePersonneCharge"
                          checked={editedFormulaires?.fo_autrePersonneCharge || false}
                          onCheckedChange={(checked) => handleFormulaireChange("fo_autrePersonneCharge", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="fo_rentier" className="flex-1">
                          Rentier
                        </Label>
                        <Switch
                          id="fo_rentier"
                          checked={editedFormulaires?.fo_rentier || false}
                          onCheckedChange={(checked) => handleFormulaireChange("fo_rentier", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="fo_assurance" className="flex-1">
                          Assurances
                        </Label>
                        <Switch
                          id="fo_assurances"
                          checked={editedFormulaires?.fo_assurances || false}
                          onCheckedChange={(checked) => handleFormulaireChange("fo_assurances", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="fo_titres" className="flex-1">
                          Titres/Élements de fortune
                        </Label>
                        <Switch
                          id="fo_titres"
                          checked={editedFormulaires?.fo_titres || false}
                          onCheckedChange={(checked) => handleFormulaireChange("fo_titres", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="fo_autresDeductions" className="flex-1">
                          Autres déductions
                        </Label>
                        <Switch
                          id="fo_autresDeductions"
                          checked={editedFormulaires?.fo_autresDeductions || false}
                          onCheckedChange={(checked) => handleFormulaireChange("fo_autresDeductions", checked)}
                        />
                      </div>

                      <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="outline" onClick={() => cancelEditing("formulaires")} disabled={isSaving}>
                          Annuler
                        </Button>
                        <Button onClick={saveFormulaires} disabled={isSaving}>
                          {isSaving ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Enregistrement...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Enregistrer
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Banques:</span>
                        <Badge variant={formulaireData.fo_banques ? "default" : "outline"}>
                          {formulaireData.fo_banques ? "Activé" : "Désactivé"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Dettes:</span>
                        <Badge variant={formulaireData.fo_dettes ? "default" : "outline"}>
                          {formulaireData.fo_dettes ? "Activé" : "Désactivé"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Immobiliers:</span>
                        <Badge variant={formulaireData.fo_immobiliers ? "default" : "outline"}>
                          {formulaireData.fo_immobiliers ? "Activé" : "Désactivé"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Revenu:</span>
                        <Badge variant={formulaireData.fo_revenu ? "default" : "outline"}>
                          {formulaireData.fo_revenu ? "Activé" : "Désactivé"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Autres personnes à charge:</span>
                        <Badge variant={formulaireData.fo_autrePersonneCharge ? "default" : "outline"}>
                          {formulaireData.fo_autrePersonneCharge ? "Activé" : "Désactivé"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Titres/Élemets de fortune:</span>
                        <Badge variant={formulaireData.fo_titres ? "default" : "outline"}>
                          {formulaireData.fo_titres ? "Activé" : "Désactivé"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Rentier:</span>
                        <Badge variant={formulaireData.fo_rentier ? "default" : "outline"}>
                          {formulaireData.fo_rentier ? "Activé" : "Désactivé"}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Assurances:</span>
                        <Badge variant={formulaireData.fo_assurances ? "default" : "outline"}>
                          {formulaireData.fo_assurances ? "Activé" : "Désactivé"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Autres déductions:</span>
                        <Badge variant={formulaireData.fo_autresDeductions ? "default" : "outline"}>
                          {formulaireData.fo_autresDeductions ? "Activé" : "Désactivé"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Autres informations:</span>
                        <Badge variant={formulaireData.fo_autresInformations ? "default" : "outline"}>
                          {formulaireData.fo_autresInformations ? "Activé" : "Désactivé"}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Situation familiale */}
        <TabsContent value="situation-familiale">
          <Card>
            <CardHeader>
              <CardTitle>Situation familiale</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                {/* Conjoints */}
                <AccordionItem value="conjoints">
                  <AccordionTrigger>Conjoint(s) ({formulaireData.conjoints?.length || 0})</AccordionTrigger>
                  <AccordionContent>
                    {formulaireData.conjoints && formulaireData.conjoints.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nom</TableHead>
                            <TableHead>Prénom</TableHead>
                            <TableHead>Date de naissance</TableHead>
                            <TableHead>Nationalité</TableHead>
                            <TableHead>État civil</TableHead>
                            <TableHead>Profession</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formulaireData.conjoints.map((conjoint) => (
                            <TableRow key={conjoint.conjoint_id}>
                              <TableCell>{conjoint.nom}</TableCell>
                              <TableCell>{conjoint.prenom}</TableCell>
                              <TableCell>{formatDate(conjoint.dateNaissance)}</TableCell>
                              <TableCell>{conjoint.nationalite || "Non spécifié"}</TableCell>
                              <TableCell>{conjoint.etatCivil || "Non spécifié"}</TableCell>
                              <TableCell>{conjoint.professionExercee || "Non spécifié"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-muted-foreground">Aucun conjoint enregistré</p>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* Enfants */}
                <AccordionItem value="enfants">
                  <AccordionTrigger>Enfant(s) ({formulaireData.enfants?.length || 0})</AccordionTrigger>
                  <AccordionContent>
                    {formulaireData.enfants && formulaireData.enfants.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nom</TableHead>
                            <TableHead>Prénom</TableHead>
                            <TableHead>Date de naissance</TableHead>
                            <TableHead>Revenu brut</TableHead>
                            <TableHead>Fortune nette</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formulaireData.enfants.map((enfant) => (
                            <TableRow key={enfant.enfant_id}>
                              <TableCell>{enfant.nom}</TableCell>
                              <TableCell>{enfant.prenom}</TableCell>
                              <TableCell>{formatDate(enfant.dateNaissance)}</TableCell>
                              <TableCell>{formatMontant(enfant.revenuBrut)}</TableCell>
                              <TableCell>{formatMontant(enfant.fortuneNet ?? 0)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-muted-foreground">Aucun enfant enregistré</p>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* Autres personnes à charge */}
                <AccordionItem value="autres-personnes">
                  <AccordionTrigger>
                    Autres personnes à charge ({formulaireData.autres_personnes_a_charge?.length || 0})
                  </AccordionTrigger>
                  <AccordionContent>
                    {formulaireData.autres_personnes_a_charge && formulaireData.autres_personnes_a_charge.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nom</TableHead>
                            <TableHead>Prénom</TableHead>
                            <TableHead>Date de naissance</TableHead>
                            <TableHead>Lien</TableHead>
                            <TableHead>Montant du soutien</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formulaireData.autres_personnes_a_charge.map((personne) => (
                            <TableRow key={personne.autre_personne_id}>
                              <TableCell>{personne.nom}</TableCell>
                              <TableCell>{personne.prenom}</TableCell>
                              <TableCell>{formatDate(personne.dateNaissance)}</TableCell>
                              <TableCell>{personne.degreParente}</TableCell>
                              <TableCell>{formatMontant(Number(personne.montantVerseAPersonneACharge))}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-muted-foreground">Aucune autre personne à charge enregistrée</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Finances */}
        <TabsContent value="finances">
          <Card>
            <CardHeader>
              <CardTitle>Finances</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                {/* Banques */}
                <AccordionItem value="banques">
                  <AccordionTrigger>Comptes bancaires ({formulaireData.banques?.length || 0})</AccordionTrigger>
                  <AccordionContent>
                    {formulaireData.banques && formulaireData.banques.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nombre de compte</TableHead>
                            <TableHead>Attestation fin d&apos;année</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formulaireData.banques.map((banque) => (
                            <TableRow key={banque.banque_id}>
                              <TableCell>{banque.nb_compte || "Non spécifié"}</TableCell>
                              <TableCell>{banque.fo_attestationFinAnnee ? "Oui" : "Non"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-muted-foreground">Aucun compte bancaire enregistré</p>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* Dettes et intérêts */}
                <AccordionItem value="dettes">
                  <AccordionTrigger>Dettes et intérêts ({formulaireData.interet_dettes?.length || 0})</AccordionTrigger>
                  <AccordionContent>
                    {formulaireData.interet_dettes && formulaireData.interet_dettes.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Attestation Emprunt</TableHead>
                            <TableHead>Attestation Carte Crédit</TableHead>
                            <TableHead>Attestation Hypothèque</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formulaireData.interet_dettes.map((dette) => (
                            <TableRow key={dette.dettes_id}>
                              <TableCell>{dette.fo_attestationEmprunt ? "Oui" : "Non"}</TableCell>
                              <TableCell>{dette.fo_attestationCarteCredit ? "Oui" : "Non"}</TableCell>
                              <TableCell>{dette.fo_attestationHypotheque ? "Oui" : "Non"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-muted-foreground">Aucune dette enregistrée</p>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* Immobilier */}
                <AccordionItem value="immobilier">
                  <AccordionTrigger>Biens immobiliers ({formulaireData.immobiliers?.length || 0})</AccordionTrigger>
                  <AccordionContent>
                    {formulaireData.immobiliers && formulaireData.immobiliers.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Adresse complète</TableHead>
                            <TableHead>Valeur locative brute</TableHead>
                            <TableHead>Prix d&apos;achat</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formulaireData.immobiliers.map((immobilier) => (
                            <TableRow key={immobilier.immobilier_id}>
                              <TableCell>{immobilier.adresseComplete}</TableCell>
                              <TableCell>{formatMontant(immobilier.valeurLocativeBrut)}</TableCell>
                              <TableCell>{formatMontant(immobilier.prixAchat)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-muted-foreground">Aucun bien immobilier enregistré</p>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* Titres */}
                <AccordionItem value="titres">
                  <AccordionTrigger>Titres et valeurs ({formulaireData.titres?.length || 0})</AccordionTrigger>
                  <AccordionContent>
                    {formulaireData.titres && formulaireData.titres.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Compte bancaire/postale</TableHead>
                            <TableHead>Action ou part sociale</TableHead>
                            <TableHead>Autre élément fortune</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formulaireData.titres.map((titre) => (
                            <TableRow key={titre.titre_id}>
                              <TableCell>{titre.compteBancairePostale ? "Oui" : "Non"}</TableCell>
                              <TableCell>{titre.actionOuPartSociale ? "Oui" : "Non"}</TableCell>
                              <TableCell>{titre.autreElementFortune ? "Oui" : "Non"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-muted-foreground">Aucun titre enregistré</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Revenus */}
        <TabsContent value="revenus">
          <Card>
            <CardHeader>
              <CardTitle>Revenus</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                {/* Revenus */}
                <AccordionItem value="revenus">
                  <AccordionTrigger>Revenus divers ({formulaireData.revenus?.length || 0})</AccordionTrigger>
                  <AccordionContent>
                    {formulaireData.revenus && formulaireData.revenus.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Indemnités</TableHead>
                            <TableHead>Activité indépendante</TableHead>
                            <TableHead>Subsides assurance maladie</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formulaireData.revenus.map((revenu) => (
                            <TableRow key={revenu.revenu_id}>
                              <TableCell>{revenu.indemnites ? "Oui" : "Non"}</TableCell>
                              <TableCell>{revenu.activiteIndependante ? "Oui" : "Non"}</TableCell>
                              <TableCell>{revenu.subsidesAssuranceMaladie ? "Oui" : "Non"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-muted-foreground">Aucun revenu enregistré</p>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* Rentier */}
                <AccordionItem value="rentier">
                  <AccordionTrigger>Rentes ({formulaireData.rentier?.length || 0})</AccordionTrigger>
                  <AccordionContent>
                    {formulaireData.rentier && formulaireData.rentier.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Attestation Rente AVS/AI</TableHead>
                            <TableHead>Attestation Rente Prévoyance</TableHead>
                            <TableHead>Autres rentes</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formulaireData.rentier.map((r) => (
                            <TableRow key={r.rentier_id}>
                              <TableCell>{r.fo_attestationRenteAVSAI ? "Oui" : "Non"}</TableCell>
                              <TableCell>{r.fo_attestationRentePrevoyance ? "Oui" : "Non"}</TableCell>
                              <TableCell>{r.fo_autresRentes ? "Oui" : "Non"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-muted-foreground">Aucune rente enregistrée</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Déductions */}
        <TabsContent value="deductions">
          <Card>
            <CardHeader>
              <CardTitle>Déductions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                {/* Déductions */}
                <AccordionItem value="deductions">
                  <AccordionTrigger>Déductions diverses ({formulaireData.deductions?.length || 0})</AccordionTrigger>
                  <AccordionContent>
                    {formulaireData.deductions && formulaireData.deductions.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Rachat LPP</TableHead>
                            <TableHead>Attestation 3e pilier A</TableHead>
                            <TableHead>Attestation 3e pilier B</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formulaireData.deductions.map((deduction) => (
                            <TableRow key={deduction.autre_deduction_id}>
                              <TableCell>{deduction.fo_rachatLPP ? "Oui" : "Non"}</TableCell>
                              <TableCell>{deduction.fo_attestation3emePilierA ? "Oui" : "Non"}</TableCell>
                              <TableCell>{deduction.fo_attestation3emePilierB ? "Oui" : "Non"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-muted-foreground">Aucune déduction enregistrée</p>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* Assurances */}
                <AccordionItem value="assurances">
                  <AccordionTrigger>Assurances ({formulaireData.indemnite_assurances?.length || 0})</AccordionTrigger>
                  <AccordionContent>
                    {formulaireData.indemnite_assurances && formulaireData.indemnite_assurances.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Chômage</TableHead>
                            <TableHead>Maladie</TableHead>
                            <TableHead>Accident</TableHead>
                            <TableHead>Maternité/Militaire/PC</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formulaireData.indemnite_assurances.map((assurance) => (
                            <TableRow key={assurance.indemnite_assurance_id}>
                              <TableCell>{assurance.fo_chomage ? "Oui" : "Non"}</TableCell>
                              <TableCell>{assurance.fo_maladie ? "Oui" : "Non"}</TableCell>
                              <TableCell>{assurance.fo_accident ? "Oui" : "Non"}</TableCell>
                              <TableCell>{assurance.fo_materniteMilitairePC ? "Oui" : "Non"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-muted-foreground">Aucune assurance enregistrée</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Autres informations */}
        <TabsContent value="autres-informations">
          <Card>
            <CardHeader>
              <CardTitle>Autres informations</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                {/* Autres informations */}
                <AccordionItem value="autres-informations">
                  <AccordionTrigger>
                    Autres informations ({formulaireData.autres_informations?.length || 0})
                  </AccordionTrigger>
                  <AccordionContent>
                    {formulaireData.autres_informations && formulaireData.autres_informations.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Bourses d&apos;études</TableHead>
                            <TableHead>Prestations AVS/SPC</TableHead>
                            <TableHead>Prestations Ville/Commune</TableHead>
                            <TableHead>Allocations impotents</TableHead>
                            <TableHead>Institution bienfaisance</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formulaireData.autres_informations.map((info) => (
                            <TableRow key={info.autre_informations_id}>
                              <TableCell>{info.fo_versementBoursesEtudes ? "Oui" : "Non"}</TableCell>
                              <TableCell>{info.fo_prestationsAVSSPC ? "Oui" : "Non"}</TableCell>
                              <TableCell>{info.fo_prestationsVilleCommune ? "Oui" : "Non"}</TableCell>
                              <TableCell>{info.fo_allocationsImpotents ? "Oui" : "Non"}</TableCell>
                              <TableCell>{info.fo_institutionBienfaisance ? "Oui" : "Non"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-muted-foreground">Aucune autre information enregistrée</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
