"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Loader2 } from "lucide-react"
import axios from "axios"

export default function FormulaireDeclaration() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const [userId, setUserId] = useState<number | null>(null)
  const [priveId, setPriveId] = useState<number | null>(null)

  // Récupérer l'ID de l'utilisateur au chargement
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (!token) {
          router.push("/connexion")
          return
        }

        // Récupérer l'ID utilisateur depuis un endpoint Laravel
        const userIdResponse = await axios.get("http://127.0.0.1:8000/api/auth/user", {
          withCredentials: true, // Indispensable pour que Laravel envoie le cookie !
        });

        if (userIdResponse.data && userIdResponse.data.user_id) {
          setUserId(userIdResponse.data.user_id);
          console.log("User ID from API:", userIdResponse.data.user_id);
        } else {
          console.log("PAS TROUVE");
          return;
        }

        // Récupérer les informations privées de l'utilisateur
        const priveResponse = await axios.get(`http://127.0.0.1:8000/api/prives/users/${userIdResponse.data.user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (priveResponse.data && priveResponse.data.prive_id) {
          setPriveId(priveResponse.data.prive_id);
        } else {
          console.log("Pas de privé trouvé pour cet utilisateur");
        }
        
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur:", error);
        router.push("/connexion");
      }
    };

    fetchUserData();
  }, [router]);


  // Informations de base
  const [infoBase, setInfoBase] = useState({
    dateNaissance: "",
    nationalite: "",
    etatCivil: "celibataire", // celibataire, marie, pacse, veuf, divorce
  })

  // État pour les enfants
  const [hasEnfants, setHasEnfants] = useState(false)
  const [enfants, setEnfants] = useState<
    Array<{
      nom: string
      prenom: string
      dateNaissance: string
      adresse: string
      codePostal: string
      localite: string
      noAVS: string
      noContribuable: string
      revenuBrut: string
      fortuneNet: string
    }>
  >([])

  // État pour le conjoint
  const [conjointInfo, setConjointInfo] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    nationalite: "",
    adresse: "",
    localite: "",
    codePostal: "",
    situationProfessionnelle: "",
  })

  // État pour les rubriques du formulaire
  const [formSections, setFormSections] = useState({
    fo_banques: false,
    fo_dettes: false,
    fo_immobiliers: false,
    fo_salarie: false,
    fo_autrePersonneCharge: false,
    fo_independant: false,
    fo_rentier: false,
    fo_autreRevenu: false,
    fo_assurance: false,
    fo_autreDeduction: false,
    fo_autreInformations: false,
  })

  // Gestion des changements dans les informations de base
  const handleInfoBaseChange = (name: string, value: string) => {
    setInfoBase((prev) => ({ ...prev, [name]: value }))
  }

  // Gestion des changements dans les rubriques du formulaire
  const handleSectionChange = (name: string, checked: boolean) => {
    setFormSections((prev) => ({ ...prev, [name]: checked }))
  }

  // Ajouter un enfant
  const addEnfant = () => {
    setEnfants([
      ...enfants,
      {
        nom: "",
        prenom: "",
        dateNaissance: "",
        adresse: "",
        codePostal: "",
        localite: "",
        noAVS: "",
        noContribuable: "",
        revenuBrut: "",
        fortuneNet: "",
      },
    ])
  }

  // Mettre à jour les informations d'un enfant
  const updateEnfant = (index: number, field: string, value: string) => {
    const updatedEnfants = [...enfants]
    updatedEnfants[index] = { ...updatedEnfants[index], [field]: value }
    setEnfants(updatedEnfants)
  }

  // Supprimer un enfant
  const removeEnfant = (index: number) => {
    const updatedEnfants = [...enfants]
    updatedEnfants.splice(index, 1)
    setEnfants(updatedEnfants)
  }

  // Passer à l'étape suivante
  const nextStep = () => {
    setStep(step + 1)
  }

  // Revenir à l'étape précédente
  const prevStep = () => {
    // Si on est à l'étape 4 (rubriques)
    if (step === 4) {
      // Si l'utilisateur a des enfants, revenir à l'étape 3 (enfants)
      if (hasEnfants) {
        setStep(3)
      }
      // Si l'utilisateur est marié ou pacsé mais n'a pas d'enfants, revenir à l'étape 2 (conjoint)
      else if (infoBase.etatCivil === "marie" || infoBase.etatCivil === "pacse") {
        setStep(2)
      }
      // Si l'utilisateur est célibataire et n'a pas d'enfants, revenir à l'étape 1 (infos de base)
      else {
        setStep(1)
      }
    }
    // Si on est à l'étape 3 (enfants)
    else if (step === 3) {
      // Revenir à l'étape 2 (conjoint) si marié ou pacsé, sinon à l'étape 1
      if (infoBase.etatCivil === "marie" || infoBase.etatCivil === "pacse") {
        setStep(2)
      } else {
        setStep(1)
      }
    }
    // Si on est à l'étape 5 (récapitulatif)
    else if (step === 5) {
      // Toujours revenir à l'étape 4 (rubriques)
      setStep(4)
    }
    // Pour les autres cas, simplement décrémenter l'étape
    else {
      setStep(step - 1)
    }
  }

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        router.push("/connexion")
        return
      }
      console.log("TTT"+userId)

      // 1. Mettre à jour le privé avec les nouvelles informations
      if (priveId) {
        // Données à mettre à jour dans le privé
        const priveData = {
          dateNaissance: infoBase.dateNaissance,
          nationalite: infoBase.nationalite,
          etatCivil: infoBase.etatCivil,
          genre: infoBase.etatCivil === "marie" || infoBase.etatCivil === "pacse" ? "couple" : "individuel",
          ...formSections,
        }

        // Mise à jour du privé
        await axios.put(`http://127.0.0.1:8000/api/prives/${priveId}`, priveData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        // 2. Gérer le conjoint si marié ou pacsé
        if (infoBase.etatCivil === "marie" || infoBase.etatCivil === "pacse") {
          const conjointData = {
            prive_id: priveId,
            ...conjointInfo,
          }

          // Création du conjoint
          await axios.post("http://127.0.0.1:8000/api/conjoints", conjointData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
        }

        // 3. Gérer les enfants si l'utilisateur a des enfants
        if (hasEnfants && enfants.length > 0) {
          // Créer tous les enfants
          for (const enfant of enfants) {
            const enfantData = {
              prive_id: priveId,
              ...enfant,
            }

            await axios.post("http://127.0.0.1:8000/api/enfants", enfantData, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            })
          }
        }

        console.log("Formulaire soumis avec succès")

        // Rediriger vers le dashboard
        router.push("/dashboard")
      } else {
        setError("Impossible de trouver votre profil. Veuillez contacter l'administrateur.")
      }
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

  // Rendu de l'étape 1: Informations de base
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="dateNaissance">Date de naissance</Label>
        <Input
          id="dateNaissance"
          type="date"
          value={infoBase.dateNaissance}
          onChange={(e) => handleInfoBaseChange("dateNaissance", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nationalite">Nationalité</Label>
        <Input
          id="nationalite"
          value={infoBase.nationalite}
          onChange={(e) => handleInfoBaseChange("nationalite", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>État civil</Label>
        <RadioGroup
          value={infoBase.etatCivil}
          onValueChange={(value) => handleInfoBaseChange("etatCivil", value)}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="celibataire" id="celibataire" />
            <Label htmlFor="celibataire">Célibataire</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="marie" id="marie" />
            <Label htmlFor="marie">Marié(e)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pacse" id="pacse" />
            <Label htmlFor="pacse">Pacsé(e)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="divorce" id="divorce" />
            <Label htmlFor="divorce">Divorcé(e)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="veuf" id="veuf" />
            <Label htmlFor="veuf">Veuf/Veuve</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="hasEnfants"
            checked={hasEnfants}
            onCheckedChange={(checked) => setHasEnfants(checked as boolean)}
          />
          <Label htmlFor="hasEnfants">Avez-vous des enfants à charge?</Label>
        </div>
      </div>

      <Button onClick={nextStep} className="w-full">
        Continuer
      </Button>
    </div>
  )

  // Rendu de l'étape 2: Informations du conjoint (si marié ou pacsé)
  const renderStep2 = () => {
    if (infoBase.etatCivil !== "marie" && infoBase.etatCivil !== "pacse") {
      // Si pas marié ni pacsé, passer directement à l'étape suivante
      setTimeout(() => nextStep(), 0)
      return (
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Informations du conjoint</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="conjointNom">Nom</Label>
            <Input
              id="conjointNom"
              value={conjointInfo.nom}
              onChange={(e) => setConjointInfo({ ...conjointInfo, nom: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="conjointPrenom">Prénom</Label>
            <Input
              id="conjointPrenom"
              value={conjointInfo.prenom}
              onChange={(e) => setConjointInfo({ ...conjointInfo, prenom: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="conjointDateNaissance">Date de naissance</Label>
          <Input
            id="conjointDateNaissance"
            type="date"
            value={conjointInfo.dateNaissance}
            onChange={(e) => setConjointInfo({ ...conjointInfo, dateNaissance: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="conjointNationalite">Nationalité</Label>
          <Input
            id="conjointNationalite"
            value={conjointInfo.nationalite}
            onChange={(e) => setConjointInfo({ ...conjointInfo, nationalite: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="conjointAdresse">Adresse (si différente)</Label>
          <Input
            id="conjointAdresse"
            value={conjointInfo.adresse}
            onChange={(e) => setConjointInfo({ ...conjointInfo, adresse: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="conjointLocalite">Localité</Label>
            <Input
              id="conjointLocalite"
              value={conjointInfo.localite}
              onChange={(e) => setConjointInfo({ ...conjointInfo, localite: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="conjointCodePostal">Code postal</Label>
            <Input
              id="conjointCodePostal"
              value={conjointInfo.codePostal}
              onChange={(e) => setConjointInfo({ ...conjointInfo, codePostal: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="conjointSituationProfessionnelle">Situation professionnelle</Label>
          <Select
            value={conjointInfo.situationProfessionnelle}
            onValueChange={(value) => setConjointInfo({ ...conjointInfo, situationProfessionnelle: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une situation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="salarie">Salarié(e)</SelectItem>
              <SelectItem value="independant">Indépendant(e)</SelectItem>
              <SelectItem value="retraite">Retraité(e)</SelectItem>
              <SelectItem value="chomage">En recherche d'emploi</SelectItem>
              <SelectItem value="etudiant">Étudiant(e)</SelectItem>
              <SelectItem value="autre">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={prevStep}>
            Retour
          </Button>
          <Button onClick={nextStep}>Continuer</Button>
        </div>
      </div>
    )
  }

  // Rendu de l'étape 3: Informations des enfants (si a des enfants)
  const renderStep3 = () => {
    if (!hasEnfants) {
      // Si pas d'enfants, passer directement à l'étape suivante
      setTimeout(() => nextStep(), 0)
      return (
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Informations des enfants à charge</h3>

        {enfants.map((enfant, index) => (
          <Card key={index} className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Enfant {index + 1}</h4>
              <Button variant="destructive" size="sm" onClick={() => removeEnfant(index)}>
                Supprimer
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor={`enfantNom-${index}`}>Nom</Label>
                <Input
                  id={`enfantNom-${index}`}
                  value={enfant.nom}
                  onChange={(e) => updateEnfant(index, "nom", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`enfantPrenom-${index}`}>Prénom</Label>
                <Input
                  id={`enfantPrenom-${index}`}
                  value={enfant.prenom}
                  onChange={(e) => updateEnfant(index, "prenom", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <Label htmlFor={`enfantDateNaissance-${index}`}>Date de naissance</Label>
              <Input
                id={`enfantDateNaissance-${index}`}
                type="date"
                value={enfant.dateNaissance}
                onChange={(e) => updateEnfant(index, "dateNaissance", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2 mb-4">
              <Label htmlFor={`enfantAdresse-${index}`}>Adresse (si différente)</Label>
              <Input
                id={`enfantAdresse-${index}`}
                value={enfant.adresse}
                onChange={(e) => updateEnfant(index, "adresse", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor={`enfantLocalite-${index}`}>Localité</Label>
                <Input
                  id={`enfantLocalite-${index}`}
                  value={enfant.localite}
                  onChange={(e) => updateEnfant(index, "localite", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`enfantCodePostal-${index}`}>Code postal</Label>
                <Input
                  id={`enfantCodePostal-${index}`}
                  value={enfant.codePostal}
                  onChange={(e) => updateEnfant(index, "codePostal", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <Label htmlFor={`enfantNoAVS-${index}`}>Numéro AVS</Label>
              <Input
                id={`enfantNoAVS-${index}`}
                value={enfant.noAVS}
                onChange={(e) => updateEnfant(index, "noAVS", e.target.value)}
              />
            </div>

            <div className="space-y-2 mb-4">
              <Label htmlFor={`enfantNoContribuable-${index}`}>Numéro de contribuable</Label>
              <Input
                id={`enfantNoContribuable-${index}`}
                value={enfant.noContribuable}
                onChange={(e) => updateEnfant(index, "noContribuable", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`enfantRevenuBrut-${index}`}>Revenu brut</Label>
                <Input
                  id={`enfantRevenuBrut-${index}`}
                  value={enfant.revenuBrut}
                  onChange={(e) => updateEnfant(index, "revenuBrut", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`enfantFortuneNet-${index}`}>Fortune nette</Label>
                <Input
                  id={`enfantFortuneNet-${index}`}
                  value={enfant.fortuneNet}
                  onChange={(e) => updateEnfant(index, "fortuneNet", e.target.value)}
                />
              </div>
            </div>
          </Card>
        ))}

        <Button variant="outline" className="w-full" onClick={addEnfant}>
          Ajouter un enfant
        </Button>

        <div className="flex justify-between">
          <Button variant="outline" onClick={prevStep}>
            Retour
          </Button>
          <Button onClick={nextStep}>Continuer</Button>
        </div>
      </div>
    )
  }

  // Rendu de l'étape 4: Sélection des rubriques
  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Sélectionnez les rubriques qui vous concernent</h3>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="fo_salarie"
            checked={formSections.fo_salarie}
            onCheckedChange={(checked) => handleSectionChange("fo_salarie", checked as boolean)}
          />
          <Label htmlFor="fo_salarie" className="font-medium">
            Êtes-vous salarié?
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="fo_independant"
            checked={formSections.fo_independant}
            onCheckedChange={(checked) => handleSectionChange("fo_independant", checked as boolean)}
          />
          <Label htmlFor="fo_independant" className="font-medium">
            Êtes-vous indépendant?
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="fo_rentier"
            checked={formSections.fo_rentier}
            onCheckedChange={(checked) => handleSectionChange("fo_rentier", checked as boolean)}
          />
          <Label htmlFor="fo_rentier" className="font-medium">
            Êtes-vous rentier?
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="fo_autreRevenu"
            checked={formSections.fo_autreRevenu}
            onCheckedChange={(checked) => handleSectionChange("fo_autreRevenu", checked as boolean)}
          />
          <Label htmlFor="fo_autreRevenu" className="font-medium">
            Avez-vous d'autres revenus?
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="fo_banques"
            checked={formSections.fo_banques}
            onCheckedChange={(checked) => handleSectionChange("fo_banques", checked as boolean)}
          />
          <Label htmlFor="fo_banques" className="font-medium">
            Avez-vous des comptes bancaires?
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="fo_immobiliers"
            checked={formSections.fo_immobiliers}
            onCheckedChange={(checked) => handleSectionChange("fo_immobiliers", checked as boolean)}
          />
          <Label htmlFor="fo_immobiliers" className="font-medium">
            Possédez-vous des biens immobiliers?
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="fo_dettes"
            checked={formSections.fo_dettes}
            onCheckedChange={(checked) => handleSectionChange("fo_dettes", checked as boolean)}
          />
          <Label htmlFor="fo_dettes" className="font-medium">
            Avez-vous des dettes?
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="fo_assurance"
            checked={formSections.fo_assurance}
            onCheckedChange={(checked) => handleSectionChange("fo_assurance", checked as boolean)}
          />
          <Label htmlFor="fo_assurance" className="font-medium">
            Avez-vous des assurances?
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="fo_autrePersonneCharge"
            checked={formSections.fo_autrePersonneCharge}
            onCheckedChange={(checked) => handleSectionChange("fo_autrePersonneCharge", checked as boolean)}
          />
          <Label htmlFor="fo_autrePersonneCharge" className="font-medium">
            Avez-vous d'autres personnes à charge?
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="fo_autreDeduction"
            checked={formSections.fo_autreDeduction}
            onCheckedChange={(checked) => handleSectionChange("fo_autreDeduction", checked as boolean)}
          />
          <Label htmlFor="fo_autreDeduction" className="font-medium">
            Avez-vous d'autres déductions?
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="fo_autreInformations"
            checked={formSections.fo_autreInformations}
            onCheckedChange={(checked) => handleSectionChange("fo_autreInformations", checked as boolean)}
          />
          <Label htmlFor="fo_autreInformations" className="font-medium">
            Avez-vous d'autres informations à communiquer?
          </Label>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Retour
        </Button>
        <Button onClick={nextStep}>Continuer</Button>
      </div>
    </div>
  )

  // Rendu de l'étape 5: Récapitulatif et confirmation
  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Récapitulatif de votre déclaration</h3>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="info-base">
          <AccordionTrigger>Informations personnelles</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p>
                <strong>Date de naissance:</strong> {infoBase.dateNaissance}
              </p>
              <p>
                <strong>Nationalité:</strong> {infoBase.nationalite}
              </p>
              <p>
                <strong>État civil:</strong>{" "}
                {infoBase.etatCivil === "celibataire"
                  ? "Célibataire"
                  : infoBase.etatCivil === "marie"
                    ? "Marié(e)"
                    : infoBase.etatCivil === "pacse"
                      ? "Pacsé(e)"
                      : infoBase.etatCivil === "divorce"
                        ? "Divorcé(e)"
                        : "Veuf/Veuve"}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {(infoBase.etatCivil === "marie" || infoBase.etatCivil === "pacse") && (
          <AccordionItem value="conjoint">
            <AccordionTrigger>Informations du conjoint</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <p>
                  <strong>Nom:</strong> {conjointInfo.nom}
                </p>
                <p>
                  <strong>Prénom:</strong> {conjointInfo.prenom}
                </p>
                <p>
                  <strong>Date de naissance:</strong> {conjointInfo.dateNaissance}
                </p>
                <p>
                  <strong>Nationalité:</strong> {conjointInfo.nationalite}
                </p>
                <p>
                  <strong>Situation professionnelle:</strong>{" "}
                  {conjointInfo.situationProfessionnelle === "salarie"
                    ? "Salarié(e)"
                    : conjointInfo.situationProfessionnelle === "independant"
                      ? "Indépendant(e)"
                      : conjointInfo.situationProfessionnelle === "retraite"
                        ? "Retraité(e)"
                        : conjointInfo.situationProfessionnelle === "chomage"
                          ? "En recherche d'emploi"
                          : conjointInfo.situationProfessionnelle === "etudiant"
                            ? "Étudiant(e)"
                            : "Autre"}
                </p>
                {conjointInfo.adresse && (
                  <>
                    <p>
                      <strong>Adresse:</strong> {conjointInfo.adresse}
                    </p>
                    <p>
                      <strong>Localité:</strong> {conjointInfo.localite}
                    </p>
                    <p>
                      <strong>Code postal:</strong> {conjointInfo.codePostal}
                    </p>
                  </>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {hasEnfants && enfants.length > 0 && (
          <AccordionItem value="enfants">
            <AccordionTrigger>Enfants à charge ({enfants.length})</AccordionTrigger>
            <AccordionContent>
              {enfants.map((enfant, index) => (
                <div key={index} className="mb-4 pb-4 border-b last:border-0">
                  <p>
                    <strong>Enfant {index + 1}</strong>
                  </p>
                  <p>
                    <strong>Nom:</strong> {enfant.nom}
                  </p>
                  <p>
                    <strong>Prénom:</strong> {enfant.prenom}
                  </p>
                  <p>
                    <strong>Date de naissance:</strong> {enfant.dateNaissance}
                  </p>
                  {enfant.noAVS && (
                    <p>
                      <strong>Numéro AVS:</strong> {enfant.noAVS}
                    </p>
                  )}
                  {enfant.noContribuable && (
                    <p>
                      <strong>Numéro de contribuable:</strong> {enfant.noContribuable}
                    </p>
                  )}
                  {enfant.revenuBrut && (
                    <p>
                      <strong>Revenu brut:</strong> {enfant.revenuBrut}
                    </p>
                  )}
                  {enfant.fortuneNet && (
                    <p>
                      <strong>Fortune nette:</strong> {enfant.fortuneNet}
                    </p>
                  )}
                  {enfant.adresse && (
                    <>
                      <p>
                        <strong>Adresse:</strong> {enfant.adresse}
                      </p>
                      <p>
                        <strong>Localité:</strong> {enfant.localite}
                      </p>
                      <p>
                        <strong>Code postal:</strong> {enfant.codePostal}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value="rubriques">
          <AccordionTrigger>Rubriques sélectionnées</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-5 space-y-1">
              {formSections.fo_salarie && <li>Salarié</li>}
              {formSections.fo_independant && <li>Indépendant</li>}
              {formSections.fo_rentier && <li>Rentier</li>}
              {formSections.fo_autreRevenu && <li>Autres revenus</li>}
              {formSections.fo_banques && <li>Banques</li>}
              {formSections.fo_immobiliers && <li>Immobiliers</li>}
              {formSections.fo_dettes && <li>Dettes</li>}
              {formSections.fo_assurance && <li>Assurances</li>}
              {formSections.fo_autrePersonneCharge && <li>Autres personnes à charge</li>}
              {formSections.fo_autreDeduction && <li>Autres déductions</li>}
              {formSections.fo_autreInformations && <li>Autres informations</li>}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Retour
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Soumission en cours...
            </>
          ) : (
            "Soumettre ma déclaration"
          )}
        </Button>
      </div>
    </div>
  )

  // Rendu du formulaire en fonction de l'étape actuelle
  const renderForm = () => {
    switch (step) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      case 4:
        return renderStep4()
      case 5:
        return renderStep5()
      default:
        return renderStep1()
    }
  }

  return (
    <div className="container max-w-3xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Formulaire de déclaration</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Indicateur d'étape */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className={`font-medium ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
                Informations personnelles
              </span>
              <span className={`font-medium ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>Conjoint</span>
              <span className={`font-medium ${step >= 3 ? "text-primary" : "text-muted-foreground"}`}>Enfants</span>
              <span className={`font-medium ${step >= 4 ? "text-primary" : "text-muted-foreground"}`}>Rubriques</span>
              <span className={`font-medium ${step >= 5 ? "text-primary" : "text-muted-foreground"}`}>
                Confirmation
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          {renderForm()}
        </CardContent>
      </Card>
    </div>
  )
}

