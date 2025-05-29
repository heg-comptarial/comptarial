"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Edit, Save, X, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Définition des interfaces pour les données du formulaire
interface Conjoint {
  id: number
  prive_id: number
  nom: string
  prenom: string
  dateNaissance: string
  nationalite?: string
  etatCivil?: string
  profession?: string
  revenuAnnuel?: number
  dateCreation: string
}

interface Enfant {
  id: number
  prive_id: number
  nom: string
  prenom: string
  dateNaissance: string
  ecole?: string
  garde?: string
  pensionsAlimentaires?: PensionAlimentaire[]
}

interface PensionAlimentaire {
  id: number
  enfant_id: number
  montant: number
  dateDebut: string
  dateFin?: string
}

interface AutrePersonneACharge {
  id: number
  prive_id: number
  nom: string
  prenom: string
  dateNaissance: string
  lien: string
  montantSoutien?: number
}

interface Banque {
  id: number
  prive_id: number
  nomBanque: string
  numeroCpte: string
  solde: number
  dateOuverture?: string
}

interface InteretDette {
  id: number
  prive_id: number
  creancier: string
  montantDette: number
  tauxInteret: number
  dateDebut: string
  dateFin?: string
  montantInteret?: number
}

interface Immobilier {
  id: number
  prive_id: number
  adresse: string
  valeurFiscale: number
  valeurLocative?: number
  dateAcquisition?: string
  prixAcquisition?: number
}

interface IndemniteAssurance {
  id: number
  prive_id: number
  compagnie: string
  typeAssurance: string
  montantPrime: number
  dateDebut: string
  dateFin?: string
}

interface Rentier {
  id: number
  prive_id: number
  sourceRevenu: string
  montantAnnuel: number
  dateDebut: string
  dateFin?: string
}

interface Revenu {
  id: number
  prive_id: number
  source: string
  montant: number
  annee: number
  description?: string
}

interface Titre {
  id: number
  prive_id: number
  nomTitre: string
  quantite: number
  valeurUnitaire: number
  dateAcquisition?: string
}

interface Deduction {
  id: number
  prive_id: number
  type: string
  montant: number
  annee: number
  description?: string
}

interface AutreInformation {
  id: number
  prive_id: number
  type: string
  description: string
  dateCreation: string
}

interface FormulaireComplet {
  prive_id: number
  user_id: number
  dateNaissance: string
  nationalite: string
  etatCivil: string
  fo_banques: boolean
  fo_dettes: boolean
  fo_immobiliers: boolean
  fo_revenu: boolean
  fo_autrePersonneCharge: boolean
  fo_rentier: boolean
  fo_assurances: boolean
  fo_titres: boolean
  fo_autresDeductions: boolean
  fo_autresInformations: boolean
  nom?: string
  prenom?: string
  user?: any
  conjoints?: Conjoint[]
  enfants?: Enfant[]
  autresPersonnesACharge?: AutrePersonneACharge[]
  banques?: Banque[]
  interetDettes?: InteretDette[]
  immobiliers?: Immobilier[]
  indemniteAssurances?: IndemniteAssurance[]
  rentier?: Rentier
  revenus?: Revenu[]
  titres?: Titre[]
  deductions?: Deduction[]
  autresInformations?: AutreInformation[]
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
          fo_revenu: false,
          fo_banques: false,
          fo_dettes: false,
          fo_immobiliers: false,
          fo_autrePersonneCharge: false,
          fo_rentier: false,
          fo_assurances: false,
          fo_titres: false,
          fo_autresDeductions: false,
          fo_autresInformations: false,
          nom: "Nom Test",
          prenom: "Prénom Test",
          user: { nom: "Nom Test", prenom: "Prénom Test" },
          conjoints: [],
          enfants: [],
          autresPersonnesACharge: [],
          banques: [],
          interetDettes: [],
          immobiliers: [],
          indemniteAssurances: [],
          revenus: [],
          titres: [],
          deductions: [],
          autresInformations: [],
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

  return (
    <div className="space-y-6">
      <Tabs defaultValue="informations-personnelles">
        <TabsList className="mb-4">
          <TabsTrigger value="informations-personnelles">Informations personnelles</TabsTrigger>
          <TabsTrigger value="situation-familiale">Situation familiale</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
          <TabsTrigger value="revenus">Revenus</TabsTrigger>
          <TabsTrigger value="deductions">Déductions</TabsTrigger>
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
                        <Label htmlFor="nom">Nom</Label>
                        <Input
                          id="nom"
                          name="nom"
                          value={editedPersonalInfo?.nom || formulaireData.user?.nom || ""}
                          onChange={handlePersonalInfoChange}
                          disabled
                        />
                        <p className="text-xs text-muted-foreground">Le nom ne peut pas être modifié ici</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="prenom">Prénom</Label>
                        <Input
                          id="prenom"
                          name="prenom"
                          value={editedPersonalInfo?.prenom || formulaireData.user?.prenom || ""}
                          onChange={handlePersonalInfoChange}
                          disabled
                        />
                        <p className="text-xs text-muted-foreground">Le prénom ne peut pas être modifié ici</p>
                      </div>

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
                          value={editedPersonalInfo?.etatCivil || ""}
                          onValueChange={(value) =>
                            setEditedPersonalInfo((prev) => (prev ? { ...prev, etatCivil: value } : null))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un état civil" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="celibataire">Célibataire</SelectItem>
                            <SelectItem value="marie">Marié(e)</SelectItem>
                            <SelectItem value="divorce">Divorcé(e)</SelectItem>
                            <SelectItem value="veuf">Veuf/Veuve</SelectItem>
                            <SelectItem value="separe">Séparé(e)</SelectItem>
                            <SelectItem value="pacse">Pacsé(e)</SelectItem>
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
                        <span className="text-muted-foreground">Nom:</span>
                        <span>{formulaireData.nom || formulaireData.user?.nom || "Non spécifié"}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Prénom:</span>
                        <span>{formulaireData.prenom || formulaireData.user?.prenom || "Non spécifié"}</span>
                      </div>
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
                        <span>{formulaireData.etatCivil}</span>
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

                      <div className="flex items-center justify-between">
                        <Label htmlFor="fo_autresInformations" className="flex-1">
                          Autres informations
                        </Label>
                        <Switch
                          id="fo_autresInformations"
                          checked={editedFormulaires?.fo_autresInformations || false}
                          onCheckedChange={(checked) => handleFormulaireChange("fo_autresInformations", checked)}
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

              {formulaireData.autresInformations && formulaireData.autresInformations.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <h3 className="font-medium mb-4">Autres informations</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formulaireData.autresInformations.map((info) => (
                        <TableRow key={info.id}>
                          <TableCell>{info.type}</TableCell>
                          <TableCell>{info.description}</TableCell>
                          <TableCell>{formatDate(info.dateCreation)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
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
                            <TableHead>Revenu annuel</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formulaireData.conjoints.map((conjoint) => (
                            <TableRow key={conjoint.id}>
                              <TableCell>{conjoint.nom}</TableCell>
                              <TableCell>{conjoint.prenom}</TableCell>
                              <TableCell>{formatDate(conjoint.dateNaissance)}</TableCell>
                              <TableCell>{conjoint.nationalite || "Non spécifié"}</TableCell>
                              <TableCell>{conjoint.etatCivil || "Non spécifié"}</TableCell>
                              <TableCell>{conjoint.profession || "Non spécifié"}</TableCell>
                              <TableCell>{formatMontant(conjoint.revenuAnnuel)}</TableCell>
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
                      <div className="space-y-6">
                        {formulaireData.enfants.map((enfant) => (
                          <div key={enfant.id} className="border rounded-md p-4">
                            <h4 className="font-medium mb-2">
                              {enfant.prenom} {enfant.nom}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="space-y-2">
                                <div className="grid grid-cols-2">
                                  <span className="text-muted-foreground">Date de naissance:</span>
                                  <span>{formatDate(enfant.dateNaissance)}</span>
                                </div>
                                <div className="grid grid-cols-2">
                                  <span className="text-muted-foreground">École:</span>
                                  <span>{enfant.ecole || "Non spécifié"}</span>
                                </div>
                                <div className="grid grid-cols-2">
                                  <span className="text-muted-foreground">Garde:</span>
                                  <span>{enfant.garde || "Non spécifié"}</span>
                                </div>
                              </div>
                            </div>

                            {enfant.pensionsAlimentaires && enfant.pensionsAlimentaires.length > 0 && (
                              <>
                                <h5 className="font-medium mb-2">Pensions alimentaires</h5>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Montant</TableHead>
                                      <TableHead>Date de début</TableHead>
                                      <TableHead>Date de fin</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {enfant.pensionsAlimentaires.map((pension) => (
                                      <TableRow key={pension.id}>
                                        <TableCell>{formatMontant(pension.montant)}</TableCell>
                                        <TableCell>{formatDate(pension.dateDebut)}</TableCell>
                                        <TableCell>
                                          {pension.dateFin ? formatDate(pension.dateFin) : "En cours"}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Aucun enfant enregistré</p>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* Autres personnes à charge */}
                <AccordionItem value="autres-personnes">
                  <AccordionTrigger>
                    Autres personnes à charge ({formulaireData.autresPersonnesACharge?.length || 0})
                  </AccordionTrigger>
                  <AccordionContent>
                    {formulaireData.autresPersonnesACharge && formulaireData.autresPersonnesACharge.length > 0 ? (
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
                          {formulaireData.autresPersonnesACharge.map((personne) => (
                            <TableRow key={personne.id}>
                              <TableCell>{personne.nom}</TableCell>
                              <TableCell>{personne.prenom}</TableCell>
                              <TableCell>{formatDate(personne.dateNaissance)}</TableCell>
                              <TableCell>{personne.lien}</TableCell>
                              <TableCell>{formatMontant(personne.montantSoutien)}</TableCell>
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
                            <TableHead>Banque</TableHead>
                            <TableHead>Numéro de compte</TableHead>
                            <TableHead>Solde</TableHead>
                            <TableHead>Date d&apos;ouverture</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formulaireData.banques.map((banque) => (
                            <TableRow key={banque.id}>
                              <TableCell>{banque.nomBanque}</TableCell>
                              <TableCell>{banque.numeroCpte}</TableCell>
                              <TableCell>{formatMontant(banque.solde)}</TableCell>
                              <TableCell>
                                {banque.dateOuverture ? formatDate(banque.dateOuverture) : "Non spécifié"}
                              </TableCell>
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
                  <AccordionTrigger>Dettes et intérêts ({formulaireData.interetDettes?.length || 0})</AccordionTrigger>
                  <AccordionContent>
                    {formulaireData.interetDettes && formulaireData.interetDettes.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Créancier</TableHead>
                            <TableHead>Montant de la dette</TableHead>
                            <TableHead>Taux d&apos;intérêt</TableHead>
                            <TableHead>Date de début</TableHead>
                            <TableHead>Date de fin</TableHead>
                            <TableHead>Montant des intérêts</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formulaireData.interetDettes.map((dette) => (
                            <TableRow key={dette.id}>
                              <TableCell>{dette.creancier}</TableCell>
                              <TableCell>{formatMontant(dette.montantDette)}</TableCell>
                              <TableCell>{dette.tauxInteret}%</TableCell>
                              <TableCell>{formatDate(dette.dateDebut)}</TableCell>
                              <TableCell>{dette.dateFin ? formatDate(dette.dateFin) : "En cours"}</TableCell>
                              <TableCell>{formatMontant(dette.montantInteret)}</TableCell>
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
                            <TableHead>Adresse</TableHead>
                            <TableHead>Valeur fiscale</TableHead>
                            <TableHead>Valeur locative</TableHead>
                            <TableHead>Date d&apos;acquisition</TableHead>
                            <TableHead>Prix d&apos;acquisition</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formulaireData.immobiliers.map((immobilier) => (
                            <TableRow key={immobilier.id}>
                              <TableCell>{immobilier.adresse}</TableCell>
                              <TableCell>{formatMontant(immobilier.valeurFiscale)}</TableCell>
                              <TableCell>{formatMontant(immobilier.valeurLocative)}</TableCell>
                              <TableCell>
                                {immobilier.dateAcquisition ? formatDate(immobilier.dateAcquisition) : "Non spécifié"}
                              </TableCell>
                              <TableCell>{formatMontant(immobilier.prixAcquisition)}</TableCell>
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
                            <TableHead>Nom du titre</TableHead>
                            <TableHead>Quantité</TableHead>
                            <TableHead>Valeur unitaire</TableHead>
                            <TableHead>Valeur totale</TableHead>
                            <TableHead>Date d&apos;acquisition</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formulaireData.titres.map((titre) => (
                            <TableRow key={titre.id}>
                              <TableCell>{titre.nomTitre}</TableCell>
                              <TableCell>{titre.quantite}</TableCell>
                              <TableCell>{formatMontant(titre.valeurUnitaire)}</TableCell>
                              <TableCell>{formatMontant(titre.quantite * titre.valeurUnitaire)}</TableCell>
                              <TableCell>
                                {titre.dateAcquisition ? formatDate(titre.dateAcquisition) : "Non spécifié"}
                              </TableCell>
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
                            <TableHead>Source</TableHead>
                            <TableHead>Montant</TableHead>
                            <TableHead>Année</TableHead>
                            <TableHead>Description</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formulaireData.revenus.map((revenu) => (
                            <TableRow key={revenu.id}>
                              <TableCell>{revenu.source}</TableCell>
                              <TableCell>{formatMontant(revenu.montant)}</TableCell>
                              <TableCell>{revenu.annee}</TableCell>
                              <TableCell>{revenu.description || "Non spécifié"}</TableCell>
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
                  <AccordionTrigger>Rentes</AccordionTrigger>
                  <AccordionContent>
                    {formulaireData.rentier ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Source de revenu</TableHead>
                            <TableHead>Montant annuel</TableHead>
                            <TableHead>Date de début</TableHead>
                            <TableHead>Date de fin</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>{formulaireData.rentier.sourceRevenu}</TableCell>
                            <TableCell>{formatMontant(formulaireData.rentier.montantAnnuel)}</TableCell>
                            <TableCell>{formatDate(formulaireData.rentier.dateDebut)}</TableCell>
                            <TableCell>
                              {formulaireData.rentier.dateFin ? formatDate(formulaireData.rentier.dateFin) : "En cours"}
                            </TableCell>
                          </TableRow>
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
                            <TableHead>Type</TableHead>
                            <TableHead>Montant</TableHead>
                            <TableHead>Année</TableHead>
                            <TableHead>Description</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formulaireData.deductions.map((deduction) => (
                            <TableRow key={deduction.id}>
                              <TableCell>{deduction.type}</TableCell>
                              <TableCell>{formatMontant(deduction.montant)}</TableCell>
                              <TableCell>{deduction.annee}</TableCell>
                              <TableCell>{deduction.description || "Non spécifié"}</TableCell>
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
                  <AccordionTrigger>Assurances ({formulaireData.indemniteAssurances?.length || 0})</AccordionTrigger>
                  <AccordionContent>
                    {formulaireData.indemniteAssurances && formulaireData.indemniteAssurances.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Compagnie</TableHead>
                            <TableHead>Type d'assurance</TableHead>
                            <TableHead>Montant de la prime</TableHead>
                            <TableHead>Date de début</TableHead>
                            <TableHead>Date de fin</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formulaireData.indemniteAssurances.map((assurance) => (
                            <TableRow key={assurance.id}>
                              <TableCell>{assurance.compagnie}</TableCell>
                              <TableCell>{assurance.typeAssurance}</TableCell>
                              <TableCell>{formatMontant(assurance.montantPrime)}</TableCell>
                              <TableCell>{formatDate(assurance.dateDebut)}</TableCell>
                              <TableCell>{assurance.dateFin ? formatDate(assurance.dateFin) : "En cours"}</TableCell>
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
      </Tabs>
    </div>
  )
}
