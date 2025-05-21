"use client"

import type React from "react"

import { useState, useEffect, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Loader2 } from "lucide-react"
import axios from "axios"
import type { Enfant, FormDataType } from "@/types/interfaces"
import ProtectedPrive from "@/components/routes/ProtectedRouteApprovedPrive"
import { useParams } from "next/navigation"
import AutrePersonne from "@/components/formulaires/autrePersonne"
import Revenu from "@/components/formulaires/revenu"
import Independants from "@/components/formulaires/independant"
import IndemnitesAssurance from "@/components/formulaires/assurances"
import Rentier from "@/components/formulaires/rentier"
import AutresRevenus from "@/components/formulaires/autresRevenus"
import Banques from "@/components/formulaires/banques"
import Titres from "@/components/formulaires/titres"
import Immobiliers from "@/components/formulaires/immobiliers"
import Dettes from "@/components/formulaires/dettes"
import Assurances from "@/components/formulaires/assurances"
import Enfants from "@/components/formulaires/enfants"
import AutresDeductions from "@/components/formulaires/autresDeductions"
import AutresInformations from "@/components/formulaires/autresInformations"
import Conjoint from "@/components/formulaires/conjoint"

// Interfaces pour les différents types de données
interface ImmobiliersData {
  immobiliers: Array<{
    statut: string
    canton: string
    commune: string
    pays: string
    noParcelleGeneve: string
    adresseComplete: string
    anneeConstruction: string
    occupeDesLe: string
    dateAchat: string
    pourcentageProprietaire: string
    autreProprietaire: string
    prixAchat: string
    valeurLocativeBrut: string
    loyersEncaisses: string
    fraisEntretienDeductibles: string
    fo_bienImmobilier: boolean
    fo_attestationValeurLocative: boolean
    fo_taxeFonciereBiensEtranger: boolean
    fo_factureEntretienImmeuble: boolean
  }>
}

interface RevenuData {
  indemnites: boolean
  interruptionsTravailNonPayees: boolean
  interuptionsTravailNonPayeesDebut: string
  interuptionsTravailNonPayeesFin: string
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

interface RentierData {
  fo_attestationRenteAVSAI: boolean
  fo_attestationRentePrevoyance: boolean
  fo_autresRentes: boolean
}

interface IndependantsData {
  // Définir la structure selon votre composant Independants
  // Par exemple:
  activiteIndependante: boolean
  chiffreAffaires: string
  // ... autres propriétés
}

interface IndemnitesAssuranceData {
  fo_chomage: boolean
  fo_maladie: boolean
  fo_accident: boolean
  fo_materniteMilitairePC: boolean
}

interface AutresRevenusData {
  // Définir la structure selon votre composant AutresRevenus
  // Par exemple:
  autresRevenus: boolean
  // ... autres propriétés
}

interface BanquesData {
  comptes: Array<{
    // Définir la structure d'un compte bancaire
    // Par exemple:
    banque: string
    iban: string
    solde: string
    // ... autres propriétés
  }>
}

interface TitresData {
  compteBancairePostale: boolean
  actionOuPartSociale: boolean
  autreElementFortune: boolean
  aucunElementFortune: boolean
  objetsValeur: boolean
  fo_gainJeux: boolean
  fo_releveFiscal: boolean
}

interface DettesData {
  fo_attestationEmprunt: boolean
  fo_attestationCarteCredit: boolean
  fo_attestationHypotheque: boolean
}

interface AssurancesData {
  fo_chomage: boolean
  fo_maladie: boolean
  fo_accident: boolean
  fo_materniteMilitairePC: boolean
}

interface AutresDeductionsData {
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

interface AutresInformationsData {
  fo_versementBoursesEtudes: boolean
  fo_pensionsPercuesEnfantMajeurACharge: boolean
  fo_prestationsAVSSPC: boolean
  fo_prestationsFamilialesSPC: boolean
  fo_prestationsVilleCommune: boolean
  fo_allocationsImpotents: boolean
  fo_reparationTortMoral: boolean
  fo_hospiceGeneral: boolean
  fo_institutionBienfaisance: boolean
}

interface EnfantsData {
  enfants: Array<{
    id?: number
    prive_id?: number
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
    avantAgeScolaire: boolean
    handicap: boolean
    domicileAvecParents: boolean
    parentsViventEnsemble: boolean
    gardeAlternee: boolean
    priseEnChargeFraisEgale: boolean
    revenuNetSuperieurAAutreParent: boolean
    fraisGarde: string
    primeAssuranceMaladie: string
    subsideAssuranceMaladie: string
    fraisMedicaux: string
    primeAssuranceAccident: string
    allocationsFamilialesSuisse: string
    montantInclusDansSalaireBrut: boolean
    allocationsFamilialesEtranger: string
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
    _hasPensionAlimentaire?: boolean
  }>
  pensionsAlimentaires: Array<{
    enfant_id?: number
    statut: "verse" | "recu"
    montantContribution: string
    nom: string
    prenom: string
    noContribuable: string
    preuveVersement: boolean
  }>
}

interface AutrePersonneData {
  personnesACharge: Array<{
    nom: string
    prenom: string
    dateNaissance: string
    degreParente: string
    nbPersonneParticipation: string
    vieAvecPersonneCharge: boolean
    revenusBrutPersonneACharge: string
    fortuneNetPersonneACharge: string
    montantVerseAPersonneACharge: string
    fo_preuveVersementEffectue: boolean
  }>
}

interface ConjointData {
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

interface FormulaireDeclarationProps {
  onSubmitSuccess?: (formData: FormDataType) => Promise<boolean>
  priveId?: number | null
}

export default function FormulaireDeclaration({ onSubmitSuccess, priveId = null }: FormulaireDeclarationProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(!!priveId)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(Number(1))
  const params = useParams()
  const userId = Number(params?.userId)
  const [autrePersonneData, setAutrePersonneData] = useState<AutrePersonneData | null>(null)
  const [revenuData, setRevenuData] = useState<RevenuData | null>(null)
  const [independantsData, setIndependantsData] = useState<IndependantsData | null>(null)
  const [indemnitesAssuranceData, setIndemnitesAssuranceData] = useState<IndemnitesAssuranceData | null>(null)
  const [rentierData, setRentierData] = useState<RentierData | null>(null)
  const [autresRevenusData, setAutresRevenusData] = useState<AutresRevenusData | null>(null)
  const [banquesData, setBanquesData] = useState<BanquesData | null>(null)
  const [titresData, setTitresData] = useState<TitresData | null>(null)
  const [immobiliersData, setImmobiliersData] = useState<ImmobiliersData | null>(null)
  const [dettesData, setDettesData] = useState<DettesData | null>(null)
  const [assurancesData, setAssurancesData] = useState<AssurancesData | null>(null)
  const [autresDeductionsData, setAutresDeductionsData] = useState<AutresDeductionsData | null>(null)
  const [autresInformationsData, setAutresInformationsData] = useState<AutresInformationsData | null>(null)
  const [enfantsData, setEnfantsData] = useState<EnfantsData | null>(null)
  const [etapesActives, setEtapesActives] = useState<number[]>([])
  const stepRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({})
  const [conjointData, setConjointData] = useState<ConjointData | null>(null)

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
  const [formSections, setFormSections] = useState<{
    [key: string]: boolean
  }>({
    fo_enfants: false,
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

  const etapesMap: { [key: string]: number } = {
    base: 1, // Informations de base
    conjoint: 2, // Conjoint
    fo_enfants: 3, // Enfants
    fo_autrePersonneCharge: 4, // AutrePersonneCharge
    fo_salarie: 5, // Revenu
    fo_independant: 6, // Indépendants
    fo_assurance: 7, // Assurance
    fo_rentier: 8, // Rentier
    fo_autreRevenu: 9, // Autres Revenu
    fo_banques: 10, // Banques
    fo_titres: 11, // Titres
    fo_immobiliers: 12, // Immobiliers
    fo_dettes: 13, // Dettes
    fo_autreDeduction: 14, // Autres Deductions
    fo_autreInformations: 15, // Autres Informations
    confirmation: 18, // Confirmation
  }

  const etapeLabelFromKey = (key: string): string => {
    const map: { [key: string]: string } = {
      fo_enfants: "Enfants",
      fo_autrePersonneCharge: "Autres personnes",
      fo_salarie: "Revenu",
      fo_independant: "Indépendant",
      fo_assurance: "Assurances",
      fo_rentier: "Rentier",
      fo_autreRevenu: "Autres revenus",
      fo_banques: "Banques",
      fo_titres: "Titres",
      fo_immobiliers: "Immobiliers",
      fo_dettes: "Dettes",
      fo_autreDeduction: "Autres déductions",
      fo_autreInformations: "Autres informations",
    }
    return map[key] || key
  }

  // Fonction pour formater une date au format YYYY-MM-DD
  const formatDate = (dateString: string): string => {
    if (!dateString) return ""

    try {
      // Si la date est déjà au format YYYY-MM-DD, la retourner telle quelle
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateString
      }

      // Sinon, essayer de la convertir
      const date = new Date(dateString)
      if (!isNaN(date.getTime())) {
        return date.toISOString().split("T")[0]
      }
    } catch (e) {
      console.error("Erreur lors de la conversion de la date:", e)
    }

    return ""
  }

  const formatDateToDDMMYYYY = (dateString: string): string => {
    if (!dateString) return ""

    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "" // Vérifie si la date est valide

    // Extraction des parties de la date
    const day = String(date.getDate()).padStart(2, "0") // Ajoute un 0 devant si nécessaire
    const month = String(date.getMonth() + 1).padStart(2, "0") // Les mois commencent à 0
    const year = date.getFullYear()

    return `${day}.${month}.${year}`
  }

  useEffect(() => {
    const currentRef = stepRefs.current[step]
    if (currentRef) {
      currentRef.scrollIntoView({
        behavior: "smooth",
        inline: "center", // scroll horizontal centré
        block: "nearest",
      })
    }
  }, [step])

  // Récupérer les données de l'utilisateur et les données du privé si disponibles
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (!token) {
          router.push("/login")
          return
        }

        // Récupérer l'ID utilisateur depuis localStorage
        if (!userId) {
          router.push("/login")
          return
        }

        // Si nous avons un priveId, récupérer les données du privé
        if (priveId) {
          try {
            const priveResponse = await axios.get(`http://127.0.0.1:8000/api/prives/${priveId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })

            if (priveResponse.data) {
              console.log("Données du privé récupérées:", priveResponse.data)

              // Pré-remplir les informations de base
              setInfoBase({
                dateNaissance: formatDate(priveResponse.data.dateNaissance || ""),
                nationalite: priveResponse.data.nationalite || "",
                etatCivil: priveResponse.data.etatCivil || "celibataire",
              })

              // Pré-remplir les sections du formulaire (fo_*)
              const sections = { ...formSections }
              Object.keys(formSections).forEach((key) => {
                if (priveResponse.data[key] !== undefined) {
                  sections[key] = Boolean(priveResponse.data[key])
                }
              })
              setFormSections(sections)

              // Vérifier et pré-remplir les informations du conjoint
              if (priveResponse.data.conjoints && priveResponse.data.conjoints.length > 0) {
                const conjoint = priveResponse.data.conjoints[0]
                setConjointInfo({
                  nom: conjoint.nom || "",
                  prenom: conjoint.prenom || "",
                  dateNaissance: formatDate(conjoint.dateNaissance || ""),
                  nationalite: conjoint.nationalite || "",
                  adresse: conjoint.adresse || "",
                  localite: conjoint.localite || "",
                  codePostal: conjoint.codePostal || "",
                  situationProfessionnelle: conjoint.situationProfessionnelle || "",
                })
              }

              // Vérifier et pré-remplir les informations des enfants
              if (priveResponse.data.enfants && priveResponse.data.enfants.length > 0) {
                setHasEnfants(true)
                const formattedEnfants = priveResponse.data.enfants.map((enfant: Enfant) => ({
                  nom: enfant.nom || "",
                  prenom: enfant.prenom || "",
                  dateNaissance: formatDate(enfant.dateNaissance || ""),
                  adresse: enfant.adresse || "",
                  codePostal: enfant.codePostal || "",
                  localite: enfant.localite || "",
                  noAVS: enfant.noAVS || "",
                  noContribuable: enfant.noContribuable || "",
                  revenuBrut: enfant.revenuBrut?.toString() || "",
                  fortuneNet: enfant.fortuneNet?.toString() || "",
                }))
                setEnfants(formattedEnfants)
              }
            }
          } catch (error) {
            console.error("Erreur lors de la récupération des données du privé:", error)
            setError("Une erreur est survenue lors de la récupération de vos données.")
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error)
        setError("Une erreur est survenue lors de la récupération de vos données.")
      } finally {
        setIsDataLoading(false)
      }
    }

    fetchData()
  }, [router, priveId])

  // Construction dynamique des étapes à afficher
  const etapesAffichees = useMemo(() => {
    const baseEtapes = [
      { step: 1, label: "Informations" },
      { step: 18, label: "Confirmation" },
    ]

    const dynEtapes = Object.entries(formSections)
      .filter(([_, value]) => value) // uniquement les cases cochées
      .map(([key]) => ({
        step: etapesMap[key],
        label: etapeLabelFromKey(key), // fonction utilitaire (ci-dessous)
      }))

    if (infoBase.etatCivil === "marie") {
      dynEtapes.unshift({ step: etapesMap["conjoint"], label: "Conjoint" })
    }

    return [...baseEtapes.slice(0, 1), ...dynEtapes.sort((a, b) => a.step - b.step), baseEtapes[1]]
  }, [formSections, infoBase])

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
    if (step === 1) {
      // Créer une association des noms de sections aux numéros d'étape

      // Récupérer les étapes cochées et les convertir en numéros d'étape
      const etapesCochees = Object.entries(formSections)
        .filter(([key, value]) => value === true) // Garde uniquement les étapes cochées
        .map(([key]) => etapesMap[key]) // Utilise etapesMap pour obtenir le numéro d'étape
        .filter((numKey) => !isNaN(numKey)) // Filtrer les valeurs NaN (si une clé n'est pas valide)
        .sort((a, b) => a - b) // Trier les étapes dans l'ordre croissant
      // Ajouter l'étape 2 (conjoint) si l'utilisateur est marié
      if (infoBase.etatCivil === "marie") {
        etapesCochees.unshift(etapesMap["conjoint"])
      }
      // Ajouter toujours la confirmation finale (étape 18)
      etapesCochees.push(etapesMap["confirmation"])

      // Si aucune étape n'est cochée, afficher un message d'erreur
      if (etapesCochees.length === 0) {
        alert("Merci de vérifier vos réponses, aucune n'a été choisie.")
        return
      }

      // Stocker les étapes activées et passer à la première étape cochée
      setEtapesActives(etapesCochees)
      setStep(etapesCochees[0]) // Passer à la première étape cochée
      return
    }

    // Navigation dans les étapes cochées
    const currentIndex = etapesActives.indexOf(step)
    const nextIndex = currentIndex + 1

    // Si l'étape suivante existe, passer à l'étape suivante
    if (nextIndex < etapesActives.length) {
      setStep(etapesActives[nextIndex])
    } else {
      setStep(18) // Si aucune autre étape n'existe, passer à l'étape 18 (confirmation)
    }
  }

  // Revenir à l'étape précédente
  const prevStep = () => {
    if (step === 1) {
      return // Si nous sommes déjà à l'étape 1, on ne peut pas aller plus en arrière
    }

    // Navigation dans les étapes cochées
    const currentIndex = etapesActives.indexOf(step)
    const prevIndex = currentIndex - 1

    // Si l'étape précédente existe, on retourne à cette étape
    if (prevIndex >= 0) {
      setStep(etapesActives[prevIndex])
    } else {
      setStep(1) // Si aucune autre étape précédente n'existe, revenir à l'étape 1
    }
  }

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const token = localStorage.getItem("auth_token")

      if (!token || !userId) {
        router.push("/login")
        return
      }

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

        // 2. Créer la déclaration principale
        const declarationData = {
          user_id: userId,
          prive_id: priveId,
          titre: `Déclaration`,
          statut: "pending",
          annee: new Date().getFullYear().toString(),
          dateCreation: new Date().toISOString(),
        }

        const declarationResponse = await axios.post("http://127.0.0.1:8000/api/declarations", declarationData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        const declarationId = declarationResponse.data.id

        if (!declarationId) {
          throw new Error("Impossible de créer la déclaration")
        }

        console.log("Déclaration créée avec l'ID:", declarationId)

        // 3. Envoyer les données de chaque composant à sa table respective
        const apiCalls = []

        // 3.1 Gérer le conjoint si marié ou pacsé
        if ((infoBase.etatCivil === "marie" || infoBase.etatCivil === "pacse") && conjointData) {
          const conjointApiData = {
            declaration_id: declarationId,
            prive_id: priveId,
            ...conjointData,
          }

          apiCalls.push(
            axios.post("http://127.0.0.1:8000/api/conjoints", conjointApiData, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }),
          )
        }

        // 3.2 Gérer les enfants et pensions alimentaires
        if (enfantsData) {
          // Envoyer les données des enfants
          if (enfantsData.enfants && enfantsData.enfants.length > 0) {
            for (const enfant of enfantsData.enfants) {
              const enfantApiData = {
                declaration_id: declarationId,
                prive_id: priveId,
                ...enfant,
              }

              // Supprimer la propriété temporaire _hasPensionAlimentaire
              if (enfantApiData._hasPensionAlimentaire !== undefined) {
                delete enfantApiData._hasPensionAlimentaire
              }

              const enfantResponse = await axios.post("http://127.0.0.1:8000/api/enfants", enfantApiData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              })

              const enfantId = enfantResponse.data.id

              // Envoyer les pensions alimentaires associées à cet enfant
              if (enfantsData.pensionsAlimentaires && enfantsData.pensionsAlimentaires.length > 0) {
                const pensionsForEnfant = enfantsData.pensionsAlimentaires.filter(
                  (p) => p.enfant_id === enfant.id || p.enfant_id === enfantsData.enfants.indexOf(enfant),
                )

                for (const pension of pensionsForEnfant) {
                  const pensionApiData = {
                    declaration_id: declarationId,
                    enfant_id: enfantId,
                    ...pension,
                  }

                  apiCalls.push(
                    axios.post("http://127.0.0.1:8000/api/pensions-alimentaires", pensionApiData, {
                      headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                      },
                    }),
                  )
                }
              }
            }
          }
        }

        // 3.3 Autres personnes à charge
        if (autrePersonneData && autrePersonneData.personnesACharge && autrePersonneData.personnesACharge.length > 0) {
          for (const personne of autrePersonneData.personnesACharge) {
            const personneApiData = {
              declaration_id: declarationId,
              prive_id: priveId,
              ...personne,
            }

            apiCalls.push(
              axios.post("http://127.0.0.1:8000/api/autres-personnes", personneApiData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }),
            )
          }
        }

        // 3.4 Revenus
        if (revenuData) {
          const revenuApiData = {
            declaration_id: declarationId,
            prive_id: priveId,
            ...revenuData,
          }

          apiCalls.push(
            axios.post("http://127.0.0.1:8000/api/revenus", revenuApiData, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }),
          )
        }

        // 3.5 Indépendants
        if (independantsData) {
          const independantApiData = {
            declaration_id: declarationId,
            prive_id: priveId,
            ...independantsData,
          }

          apiCalls.push(
            axios.post("http://127.0.0.1:8000/api/independants", independantApiData, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }),
          )
        }

        // 3.6 Indemnités assurance
        if (indemnitesAssuranceData) {
          const assuranceApiData = {
            declaration_id: declarationId,
            prive_id: priveId,
            ...indemnitesAssuranceData,
          }

          apiCalls.push(
            axios.post("http://127.0.0.1:8000/api/indemnites-assurances", assuranceApiData, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }),
          )
        }

        // 3.7 Rentier
        if (rentierData) {
          const rentierApiData = {
            declaration_id: declarationId,
            prive_id: priveId,
            ...rentierData,
          }

          apiCalls.push(
            axios.post("http://127.0.0.1:8000/api/rentiers", rentierApiData, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }),
          )
        }

        // 3.8 Autres revenus
        if (autresRevenusData) {
          const autresRevenusApiData = {
            declaration_id: declarationId,
            prive_id: priveId,
            ...autresRevenusData,
          }

          apiCalls.push(
            axios.post("http://127.0.0.1:8000/api/autres-revenus", autresRevenusApiData, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }),
          )
        }

        // 3.9 Banques
        if (banquesData && banquesData.comptes && banquesData.comptes.length > 0) {
          for (const compte of banquesData.comptes) {
            const compteApiData = {
              declaration_id: declarationId,
              prive_id: priveId,
              ...compte,
            }

            apiCalls.push(
              axios.post("http://127.0.0.1:8000/api/comptes-bancaires", compteApiData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }),
            )
          }
        }

        // 3.10 Titres
        if (titresData) {
          const titresApiData = {
            declaration_id: declarationId,
            prive_id: priveId,
            ...titresData,
          }

          apiCalls.push(
            axios.post("http://127.0.0.1:8000/api/titres", titresApiData, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }),
          )
        }

        // 3.11 Immobiliers
        if (immobiliersData && immobiliersData.immobiliers && immobiliersData.immobiliers.length > 0) {
          for (const immobilier of immobiliersData.immobiliers) {
            const immobilierApiData = {
              declaration_id: declarationId,
              prive_id: priveId,
              ...immobilier,
            }

            apiCalls.push(
              axios.post("http://127.0.0.1:8000/api/immobiliers", immobilierApiData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }),
            )
          }
        }

        // 3.12 Dettes
        if (dettesData) {
          const dettesApiData = {
            declaration_id: declarationId,
            prive_id: priveId,
            ...dettesData,
          }

          apiCalls.push(
            axios.post("http://127.0.0.1:8000/api/dettes", dettesApiData, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }),
          )
        }

        // 3.13 Assurances
        if (assurancesData) {
          const assurancesApiData = {
            declaration_id: declarationId,
            prive_id: priveId,
            ...assurancesData,
          }

          apiCalls.push(
            axios.post("http://127.0.0.1:8000/api/assurances", assurancesApiData, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }),
          )
        }

        // 3.14 Autres déductions
        if (autresDeductionsData) {
          const autresDeductionsApiData = {
            declaration_id: declarationId,
            prive_id: priveId,
            ...autresDeductionsData,
          }

          apiCalls.push(
            axios.post("http://127.0.0.1:8000/api/autres-deductions", autresDeductionsApiData, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }),
          )
        }

        // 3.15 Autres informations
        if (autresInformationsData) {
          const autresInfosApiData = {
            declaration_id: declarationId,
            prive_id: priveId,
            ...autresInformationsData,
          }

          apiCalls.push(
            axios.post("http://127.0.0.1:8000/api/autres-informations", autresInfosApiData, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }),
          )
        }

        // Exécuter tous les appels API en parallèle
        try {
          await Promise.all(apiCalls)
          console.log("Toutes les données ont été envoyées avec succès")

          // Rediriger vers "Mes déclarations"
          router.push(`/declarations-client/${userId}`)
        } catch (error) {
          console.error("Erreur lors de l'envoi des données:", error)
          if (axios.isAxiosError(error) && error.response) {
            setError(error.response.data.message || "Une erreur est survenue lors de l'envoi des données.")
          } else {
            setError("Une erreur est survenue lors de l'envoi des données. Veuillez réessayer.")
          }
        }
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

  // Afficher un écran de chargement pendant la récupération des données
  if (isDataLoading) {
    return (
      <ProtectedPrive>
        <div className="container max-w-3xl py-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Chargement de vos données</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p>Récupération de vos informations en cours...</p>
            </CardContent>
          </Card>
        </div>
      </ProtectedPrive>
    )
  }

  // Rendu de l'étape 1: Informations de base
  const renderStep1 = () => (
    <ProtectedPrive>
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
            required
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
              checked={hasEnfants || formSections.fo_enfants}
              onCheckedChange={(checked) => setHasEnfants(checked as boolean)}
            />
            <Label htmlFor="hasEnfants">Avez-vous des enfants à charge?</Label>
          </div>
        </div>

        <h3 className="text-lg font-medium">Rubriques à remplir</h3>
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
              Avez-vous d&apos;autres revenus?
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
              Avez-vous d&apos;autres personnes à charge?
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="fo_autreDeduction"
              checked={formSections.fo_autreDeduction}
              onCheckedChange={(checked) => handleSectionChange("fo_autreDeduction", checked as boolean)}
            />
            <Label htmlFor="fo_autreDeduction" className="font-medium">
              Avez-vous d&apos;autres déductions?
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="fo_titres"
              checked={formSections.fo_titres}
              onCheckedChange={(checked) => handleSectionChange("fo_titres", checked as boolean)}
            />
            <Label htmlFor="fo_titres" className="font-medium">
              Possedez-vous des titres ou d'autres éléments de fortune ?
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="fo_autreInformations"
              checked={formSections.fo_autreInformations}
              onCheckedChange={(checked) => handleSectionChange("fo_autreInformations", checked as boolean)}
            />
            <Label htmlFor="fo_autreInformations" className="font-medium">
              Souhaitez-vous communiquer d'autres informations (dons, 3e pilier, cotisations AVS, handicap, etc.) ?
            </Label>
          </div>
        </div>

        <Button onClick={nextStep} className="w-full">
          Continuer
        </Button>
      </div>
    </ProtectedPrive>
  )

  // Rendu de l'étape 2: Informations du conjoint (si marié ou pacsé)
  const renderStep2 = () => {
    if (infoBase.etatCivil !== "marie" && infoBase.etatCivil !== "pacse") {
      // Si pas marié ni pacsé, passer directement à l'étape suivante
      setTimeout(() => nextStep(), 0)
      return (
        <ProtectedPrive>
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </ProtectedPrive>
      )
    }

    return (
      <ProtectedPrive>
        <Conjoint
          data={conjointData}
          onUpdate={(newData) => setConjointData(newData)}
          onNext={nextStep}
          onPrev={prevStep}
        />
      </ProtectedPrive>
    )
  }

  // Rendu de l'étape 3: Informations des enfants (si a des enfants)
  const renderStep3 = () => {
    if (!hasEnfants && !formSections.fo_enfants) {
      // Si pas d'enfants, passer directement à l'étape suivante
      setTimeout(() => nextStep(), 0)
      return (
        <ProtectedPrive>
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </ProtectedPrive>
      )
    }

    return (
      <ProtectedPrive>
        <Enfants
          data={enfantsData}
          onUpdate={(newData) => setEnfantsData(newData)}
          onNext={nextStep}
          onPrev={prevStep}
        />
      </ProtectedPrive>
    )
  }
  // Rendu de l'étape 4: Autres personnes à charge

  const renderStep4 = () => (
    <ProtectedPrive>
      <AutrePersonne
        data={autrePersonneData}
        onUpdate={(newData) => setAutrePersonneData(newData)}
        onNext={nextStep}
        onPrev={prevStep}
      />
    </ProtectedPrive>
  )

  // Rendu de l'étape 5: Revenu
  const renderStep5 = () => (
    <ProtectedPrive>
      <Revenu data={revenuData} onUpdate={(newData) => setRevenuData(newData)} onNext={nextStep} onPrev={prevStep} />
    </ProtectedPrive>
  )

  // Rendu de l'étape 6: Indépendant
  const renderStep6 = () => (
    <ProtectedPrive>
      <Independants
        data={independantsData}
        onUpdate={(newData) => setIndependantsData(newData)}
        onNext={nextStep}
        onPrev={prevStep}
      />
    </ProtectedPrive>
  )

  // Rendu de l'étape 7: Indemnités assurance
  const renderStep7 = () => (
    <ProtectedPrive>
      <IndemnitesAssurance
        data={indemnitesAssuranceData}
        onUpdate={(newData) => setIndemnitesAssuranceData(newData)}
        onNext={nextStep}
        onPrev={prevStep}
      />
    </ProtectedPrive>
  )

  // Rendu de l'étape 8: Rentier
  const renderStep8 = () => (
    <ProtectedPrive>
      <Rentier data={rentierData} onUpdate={(newData) => setRentierData(newData)} onNext={nextStep} onPrev={prevStep} />
    </ProtectedPrive>
  )

  // Rendu de l'étape 9: Autres revenus
  const renderStep9 = () => (
    <ProtectedPrive>
      <AutresRevenus
        data={autresRevenusData}
        onUpdate={(newData) => setAutresRevenusData(newData)}
        onNext={nextStep}
        onPrev={prevStep}
      />
    </ProtectedPrive>
  )

  // Rendu de l'étape 10: Banques
  const renderStep10 = () => (
    <ProtectedPrive>
      <Banques data={banquesData} onUpdate={(newData) => setBanquesData(newData)} onNext={nextStep} onPrev={prevStep} />
    </ProtectedPrive>
  )

  // Rendu de l'étape 11: Titres
  const renderStep11 = () => (
    <ProtectedPrive>
      <Titres data={titresData} onUpdate={(newData) => setTitresData(newData)} onNext={nextStep} onPrev={prevStep} />
    </ProtectedPrive>
  )

  // Rendu de l'étape 12: Immobiliers
  const renderStep12 = () => (
    <ProtectedPrive>
      <Immobiliers
        data={immobiliersData}
        onUpdate={(newData) => setImmobiliersData(newData)}
        onNext={nextStep}
        onPrev={prevStep}
      />
    </ProtectedPrive>
  )

  // Rendu de l'étape 13: Dettes
  const renderStep13 = () => (
    <ProtectedPrive>
      <Dettes data={dettesData} onUpdate={(newData) => setDettesData(newData)} onNext={nextStep} onPrev={prevStep} />
    </ProtectedPrive>
  )

  // Rendu de l'étape 14: Assurances
  const renderStep14 = () => (
    <ProtectedPrive>
      <Assurances
        data={assurancesData}
        onUpdate={(newData) => setAssurancesData(newData)}
        onNext={nextStep}
        onPrev={prevStep}
      />
    </ProtectedPrive>
  )

  // Rendu de l'étape 15: Autres déductions
  const renderStep15 = () => (
    <ProtectedPrive>
      <AutresDeductions
        data={autresDeductionsData}
        onUpdate={(newData) => setAutresDeductionsData(newData)}
        onNext={nextStep}
        onPrev={prevStep}
      />
    </ProtectedPrive>
  )

  // Rendu de l'étape 16: Autres informations
  const renderStep16 = () => (
    <ProtectedPrive>
      <AutresInformations
        data={autresInformationsData}
        onUpdate={(newData) => setAutresInformationsData(newData)}
        onNext={nextStep}
        onPrev={prevStep}
      />
    </ProtectedPrive>
  )

  // Rendu de l'étape 18: Récapitulatif et confirmation
  const renderStep18 = () => (
    <ProtectedPrive>
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Récapitulatif de votre déclaration</h3>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="info-base">
            <AccordionTrigger>Informations personnelles</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <p>
                  <strong>Date de naissance:</strong> {formatDateToDDMMYYYY(infoBase.dateNaissance)}
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
    </ProtectedPrive>
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
      case 6:
        return renderStep6()
      case 7:
        return renderStep7()
      case 8:
        return renderStep8()
      case 9:
        return renderStep9()
      case 10:
        return renderStep10()
      case 11:
        return renderStep11()
      case 12:
        return renderStep12()
      case 13:
        return renderStep13()
      case 14:
        return renderStep14()
      case 15:
        return renderStep15()
      case 16:
        return renderStep16()
      case 18:
        return renderStep18()
      default:
        return renderStep1()
    }
  }

  return (
    <ProtectedPrive>
      <div className="container max-w-3xl py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Formulaire de déclaration</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Indicateur d'étape */}
            <div className="mb-8">
              <div className="relative mb-2">
                <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                  {etapesAffichees.map((item) => (
                    <button
                      key={item.step}
                      onClick={() => setStep(item.step)}
                      ref={(el) => {
                        stepRefs.current[item.step] = el
                      }}
                      className={`text-sm font-medium whitespace-nowrap ${
                        step === item.step ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 18) * 100}%` }}
                ></div>
              </div>
            </div>

            {renderForm()}
          </CardContent>
        </Card>
      </div>
    </ProtectedPrive>
  )
}
