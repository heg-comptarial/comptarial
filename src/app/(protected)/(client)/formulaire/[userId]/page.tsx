"use client"

import type React from "react"

import { useState, useEffect, useRef, useMemo } from "react"
import { notFound, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Loader2 } from "lucide-react"
import axios from "axios"
import { useParams } from "next/navigation"
import AutrePersonne from "@/components/formulaires/autrePersonne"
import Revenu from "@/components/formulaires/revenu"
import Rentier from "@/components/formulaires/rentier"
import Banques from "@/components/formulaires/banques"
import Titres from "@/components/formulaires/titres"
import Immobiliers from "@/components/formulaires/immobiliers"
import Dettes from "@/components/formulaires/dettes"
import Assurances from "@/components/formulaires/assurances"
import Enfants from "@/components/formulaires/enfants"
import AutresDeductions from "@/components/formulaires/autresDeductions"
import AutresInformations from "@/components/formulaires/autresInformations"
import Conjoint from "@/components/formulaires/conjoint"
import { useYearStore } from "@/store/useYear"
import { integer } from "aws-sdk/clients/cloudfront"

interface Rubrique {
  rubrique_id?: number
  declaration_id: number |null;
  type: string
  titre: string
}
// Interfaces pour les différents types de données
interface ImmobiliersData {
  immobiliers: Array<{
    immobilier_id?: number
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
  revenu_id?: number
  prive_id?: number
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
  rentier_id?: number
  fo_attestationRenteAVSAI: boolean
  fo_attestationRentePrevoyance: boolean
  fo_autresRentes: boolean
}




interface BanquesData {
  banque_id?:number
  prive_id?:number 
  nb_compte: number
}

interface TitresData {
  titre_id?: number
  compteBancairePostale: boolean
  actionOuPartSociale: boolean
  autreElementFortune: boolean
  aucunElementFortune: boolean
  objetsValeur: boolean
  fo_gainJeux: boolean
  fo_releveFiscal: boolean
}

interface DettesData {
  dettes_id?: number
  fo_attestationEmprunt: boolean
  fo_attestationCarteCredit: boolean
  fo_attestationHypotheque: boolean
}

interface AssurancesData {
  indemnite_assurance_id?: number
  fo_chomage: boolean
  fo_maladie: boolean
  fo_accident: boolean
  fo_materniteMilitairePC: boolean
}

interface AutresDeductionsData {
  autre_deduction_id?: number
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
  autre_informations_id?: number
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

// Pour l'interface ConjointData, modifions la propriété etatCivil pour qu'elle accepte n'importe quelle chaîne de caractères
interface ConjointData {
  conjoint_id?: number
  prive_id?: number
  nom: string
  prenom: string
  email: string
  localite: string
  adresse: string
  codePostal: string
  numeroTelephone: string
  etatCivil: string // Changé de type union à string
  dateNaissance: string
  nationalite: string
  professionExercee: string
  contributionReligieuse:
  | "Église Catholique Chrétienne"
  | "Église Catholique Romaine"
  | "Église Protestante"
  | "Aucune organisation religieuse"}

// Pour l'interface Enfant, rendons toutes les propriétés optionnelles requises
interface Enfant {
  enfant_id?: number
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
  avantAgeScolaire: boolean // Retiré undefined
  handicap: boolean // Retiré undefined
  domicileAvecParents: boolean // Retiré undefined
  parentsViventEnsemble: boolean // Retiré undefined
  gardeAlternee: boolean // Retiré undefined
  priseEnChargeFraisEgale: boolean // Retiré undefined
  revenuNetSuperieurAAutreParent: boolean // Retiré undefined
  fraisGarde: string // Retiré undefined
  primeAssuranceMaladie: string // Retiré undefined
  subsideAssuranceMaladie: string // Retiré undefined
  fraisMedicaux: string // Retiré undefined
  primeAssuranceAccident: string // Retiré undefined
  allocationsFamilialesSuisse: string // Retiré undefined
  montantInclusDansSalaireBrut: boolean // Retiré undefined
  allocationsFamilialesEtranger: string // Retiré undefined
  fo_scolaire: boolean // Retiré undefined
  fo_scolaireStope: boolean // Retiré undefined
  fo_certificatSalaire: boolean // Retiré undefined
  fo_attestationFortune: boolean // Retiré undefined
  fo_preuveVersementPensionAlim: boolean // Retiré undefined
  fo_preuveEncaissementPensionAlim: boolean // Retiré undefined
  fo_avanceScarpa: boolean // Retiré undefined
  fo_fraisGardeEffectifs: boolean // Retiré undefined
  fo_attestationAMPrimesAnnuel: boolean // Retiré undefined
  fo_attestationAMFraisMedicaux: boolean // Retiré undefined
  fo_attestationPaiementAssuranceAccident: boolean // Retiré undefined
  _hasPensionAlimentaire?: boolean
}

interface PensionAlimentaireData {
  pension_id?: number
  enfant_id?: number
  statut: "verse" | "recu"
  montantContribution: string
  nom: string
  prenom: string
  noContribuable: string
}

interface FormDataType {
  infoBase: {
    dateNaissance: string
    nationalite: string
    etatCivil: string
  }
  conjoint?: ConjointData
  enfants?: EnfantsData
  autrePersonne?: AutrePersonneData
  revenu?: RevenuData
  rentier?: RentierData
  banques?: BanquesData
  titres?: TitresData
  immobiliers?: ImmobiliersData
  dettes?: DettesData
  assurances?: AssurancesData
  autresDeductions?: AutresDeductionsData
  autresInformations?: AutresInformationsData
}

interface FormulaireDeclarationProps {
  onSubmitSuccess?: (formData: FormDataType) => Promise<boolean>
  priveId?: number | null
  mode: "create" | "edit"
}

interface EnfantsData {
  enfants: Enfant[]
  pensionsAlimentaires: PensionAlimentaireData[]
}

interface AutrePersonneData {
  personnesACharge: Array<{
    autre_personne_id?: number
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

export default function FormulaireDeclaration({ onSubmitSuccess, priveId = null, mode }: FormulaireDeclarationProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(!!priveId)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(Number(1))
  const params = useParams()
  const userId = Number(params?.userId)
  const [autrePersonneData, setAutrePersonneData] = useState<AutrePersonneData | null>(null)
  const [revenuData, setRevenuData] = useState<RevenuData | null>(null)
  const [rentierData, setRentierData] = useState<RentierData | null>(null)
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
  const [pensionsAlimentaires, setPensionsAlimentaires] = useState<PensionAlimentaireData[]>([])
  const selectedYear = useYearStore((state) => state.selectedYear)
    const [authentifie, setAuthentifie] = useState<boolean | null>(null);


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
    fo_revenu: false,
    fo_autrePersonneCharge: false,
    fo_rentier: false,
    fo_assurances: false,
    fo_autresDeductions: false,
    fo_autresInformations: false,
    fo_titres:false,
  })

  const etapesMap: { [key: string]: number } = {
    base: 1, // Informations de base
    conjoint: 2, // Conjoint
    fo_enfants: 3, // Enfants
    fo_autrePersonneCharge: 4, // AutrePersonneCharge
    fo_revenu: 5, // Revenu
    fo_assurances: 6, // Assurance
    fo_rentier: 7, // Rentier
    fo_banques: 8, // Banques
    fo_titres: 9, // Titres
    fo_immobiliers: 10, // Immobiliers
    fo_dettes: 11, // Dettes
    fo_autresDeductions: 12, // Autres Deductions
    fo_autresInformations: 13, // Autres Informations
    confirmation: 14, // Confirmation
  }

  const etapeLabelFromKey = (key: string): string => {
    const map: { [key: string]: string } = {
      fo_enfants: "Enfants",
      fo_autrePersonneCharge: "Autres personnes",
      fo_revenu: "Revenu",
      fo_assurances: "Assurances",
      fo_rentier: "Rentier",
      fo_banques: "Banques",
      fo_titres: "Titres",
      fo_immobiliers: "Immobiliers",
      fo_dettes: "Dettes",
      fo_autresDeductions: "Autres déductions",
      fo_autresInformations: "Autres informations",
    }
    return map[key] || key
  }
  const foToApiMap: Record<string, string> = {
  fo_autrePersonneCharge: "autrepersonneacharge",
  fo_revenu: "revenus",
  fo_rentier: "rentiers",
  fo_banques: "banques",
  fo_titres: "titres",
  fo_immobiliers: "immobiliers",
  fo_dettes: "interetsdettes",
  fo_assurances: "indemnitesassurance",
  fo_autresDeductions: "deductions",
  fo_autresInformations: "autresinformations",
  fo_enfants: "enfants",
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

  // Ajouter cette fonction après la déclaration des états
  const fetchPensionAlimentaire = async (enfantId: number, token: string) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/pensionsalimentaires/enfants/${enfantId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log("OUIUOUI "+response.data)
      return response.data
    } catch (error) {
      console.error(`Erreur lors de la récupération de la pension alimentaire pour l'enfant ${enfantId}:`, error)
      return null
    }
  }

  // Récupérer les données de l'utilisateur et les données du privé si disponibles
  useEffect(() => {
    const fetchData = async () => {
      try {
        setAuthentifie(null); // loading
        const token = localStorage.getItem("auth_token")

        const res = await fetch(`http://127.0.0.1:8000/api/users/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          setAuthentifie(false);
          return;
        }
        setAuthentifie(true);

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
              if (priveResponse.data.etatCivil === "marie" || priveResponse.data.etatCivil === "pacse") {
                try {
                  const conjointResponse = await axios.get(`http://127.0.0.1:8000/api/conjoints/prives/${priveId}`, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  })
                  console.log("bhbhbhb "+JSON.stringify(conjointResponse.data[0].contributionReligieuse))

                  if (conjointResponse.data && conjointResponse.data.length > 0) {
                    const conjoint = conjointResponse.data[0]
                    setConjointData({
                      conjoint_id: conjoint.conjoint_id || undefined,
                      prive_id: conjoint.prive_id || undefined,
                      nom: conjoint.nom || "",
                      prenom: conjoint.prenom || "",
                      email: conjoint.email || "",
                      localite: conjoint.localite || "",
                      adresse: conjoint.adresse || "",
                      codePostal: conjoint.codePostal || "",
                      numeroTelephone: conjoint.numeroTelephone || "",
                      etatCivil: conjoint.etatCivil || "Marié-e",
                      dateNaissance: formatDate(conjoint.dateNaissance || ""),
                      nationalite: conjoint.nationalite || "",
                      professionExercee: conjoint.professionExercee || "",
                      contributionReligieuse: conjoint.contributionReligieuse || "Aucune organisation religieuse",
                    })
                  }
                } catch (error) {
                  console.error("Erreur lors de la récupération des données du conjoint:", error)
                }
              }


              // Vérifier et pré-remplir les informations des enfants
              if (priveResponse.data.enfants && priveResponse.data.enfants.length > 0) {
                setHasEnfants(true)
                setFormSections((prev) => ({
                  ...prev,
                  fo_enfants: true,
                }))

                const formattedEnfants = priveResponse.data.enfants.map((enfant: Enfant) => ({
                  enfant_id: enfant.enfant_id,
                  prive_id: enfant.prive_id,
                  nom: enfant.nom || "",
                  prenom: enfant.prenom || "",
                  dateNaissance: formatDate(enfant.dateNaissance || ""),
                  adresse: enfant.adresse || "",
                  codePostal: enfant.codePostal || "",
                  localite: enfant.localite || "",
                  noAVS: enfant.noAVS || "",
                  noContribuable: enfant.noContribuable || "",
                  revenuBrut: enfant.revenuBrut?.toString() || "0",
                  fortuneNet: enfant.fortuneNet?.toString() || "0",
                  avantAgeScolaire: enfant.avantAgeScolaire || false,
                  handicap: enfant.handicap || false,
                  domicileAvecParents: enfant.domicileAvecParents || true,
                  parentsViventEnsemble: enfant.parentsViventEnsemble || false,
                  gardeAlternee: enfant.gardeAlternee || false,
                  priseEnChargeFraisEgale: enfant.priseEnChargeFraisEgale || false,
                  revenuNetSuperieurAAutreParent: enfant.revenuNetSuperieurAAutreParent || false,
                  fraisGarde: enfant.fraisGarde?.toString() || "0",
                  primeAssuranceMaladie: enfant.primeAssuranceMaladie?.toString() || "0",
                  subsideAssuranceMaladie: enfant.subsideAssuranceMaladie?.toString() || "0",
                  fraisMedicaux: enfant.fraisMedicaux?.toString() || "0",
                  primeAssuranceAccident: enfant.primeAssuranceAccident?.toString() || "0",
                  allocationsFamilialesSuisse: enfant.allocationsFamilialesSuisse?.toString() || "0",
                  montantInclusDansSalaireBrut: enfant.montantInclusDansSalaireBrut || false,
                  allocationsFamilialesEtranger: enfant.allocationsFamilialesEtranger?.toString() || "0",
                  fo_scolaire: enfant.fo_scolaire || false,
                  fo_scolaireStope: enfant.fo_scolaireStope || false,
                  fo_certificatSalaire: enfant.fo_certificatSalaire || false,
                  fo_attestationFortune: enfant.fo_attestationFortune || false,
                  fo_preuveVersementPensionAlim: enfant.fo_preuveVersementPensionAlim || false,
                  fo_preuveEncaissementPensionAlim: enfant.fo_preuveEncaissementPensionAlim || false,
                  fo_avanceScarpa: enfant.fo_avanceScarpa || false,
                  fo_fraisGardeEffectifs: enfant.fo_fraisGardeEffectifs || false,
                  fo_attestationAMPrimesAnnuel: enfant.fo_attestationAMPrimesAnnuel || false,
                  fo_attestationAMFraisMedicaux: enfant.fo_attestationAMFraisMedicaux || false,
                  fo_attestationPaiementAssuranceAccident: enfant.fo_attestationPaiementAssuranceAccident || false,
                  _hasPensionAlimentaire: false,
                }))
                setEnfants(formattedEnfants)

                // Récupérer les pensions alimentaires pour chaque enfant
                const fetchPensionsForAllEnfants = async () => {
                  const allPensions: PensionAlimentaireData[] = []
                  const updatedEnfants = [...formattedEnfants]

                  for (let i = 0; i < formattedEnfants.length; i++) {
                    const enfant = formattedEnfants[i]
                    // Vérifier si l'enfant a potentiellement une pension alimentaire avant de faire la requête
                    if (
                      enfant.enfant_id &&
                      (enfant.fo_preuveVersementPensionAlim || enfant.fo_preuveEncaissementPensionAlim)
                    ) {
                      try {
                        const pensionData = await fetchPensionAlimentaire(enfant.enfant_id, token)
                        console.log("WEEE "+ JSON.stringify(pensionData))
                        if (pensionData) {
                          allPensions.push(pensionData)
                          updatedEnfants[i] = {
                            ...updatedEnfants[i],
                            _hasPensionAlimentaire: true,
                          }
                        }
                      } catch (error) {
                        console.error(
                          `Erreur lors de la récupération de la pension pour l'enfant ${enfant.enfant_id}:`,
                          error,
                        )
                      }
                    }
                  }

                  setEnfants(updatedEnfants)
                  setPensionsAlimentaires(allPensions)

                  // Préparer les données pour le composant Enfants
                  setEnfantsData({
                    enfants: updatedEnfants,
                    pensionsAlimentaires: allPensions,
                  })
                }
                await fetchPensionsForAllEnfants()}
                
              



                  // Récupérer les données des autres personnes à charge
                  if (priveResponse.data.fo_autrePersonneCharge) {
                    try {
                      const autrePersonneResponse = await axios.get(
                        `http://127.0.0.1:8000/api/autrepersonneacharge/prives/${priveId}`,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        },
                      )

                      if (autrePersonneResponse.data && autrePersonneResponse.data.length > 0) {
                        // Gérer le cas où il y a plusieurs personnes à charge
                        const personnesACharge = autrePersonneResponse.data.map((personne: any) => ({
                          autre_personne_id: personne.autre_personne_id,
                          nom: personne.nom || "",
                          prenom: personne.prenom || "",
                          dateNaissance: formatDate(personne.dateNaissance || ""),
                          degreParente: personne.degreParente || "parents",
                          nbPersonneParticipation: personne.nbPersonneParticipation?.toString() || "1",
                          vieAvecPersonneCharge: personne.vieAvecPersonneCharge || false,
                          revenusBrutPersonneACharge: personne.revenusBrutPersonneACharge?.toString() || "0",
                          fortuneNetPersonneACharge: personne.fortuneNetPersonneACharge?.toString() || "0",
                          montantVerseAPersonneACharge: personne.montantVerseAPersonneACharge?.toString() || "0",
                          fo_preuveVersementEffectue: personne.fo_preuveVersementEffectue || false,
                        }))

                        setAutrePersonneData({ personnesACharge })
                      } else {
                        // Initialiser avec un tableau vide si aucune personne à charge n'est trouvée
                        setAutrePersonneData({ personnesACharge: [] })
                      }
                    } catch (error) {
                      console.error("Erreur lors de la récupération des données des autres personnes à charge:", error)
                    }
                  }

                  // Récupérer les données de revenu
                  if (priveResponse.data.fo_revenu) {
                    try {
                      const revenuResponse = await axios.get(`http://127.0.0.1:8000/api/revenus/prives/${priveId}`, {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      });

                      if (revenuResponse.data && revenuResponse.data.length > 0) {
                        const revenu = revenuResponse.data[0];
                        setRevenuData({
                          revenu_id: revenu.revenu_id,
                          indemnites: revenu.indemnites || false,
                          interruptionsTravailNonPayees: revenu.interruptionsTravailNonPayees || false,
                          interuptionsTravailNonPayeesDebut: formatDate(revenu.interuptionsTravailNonPayeesDebut) || "",
                          interuptionsTravailNonPayeesFin: formatDate(revenu.interuptionsTravailNonPayeesFin) || "",
                          activiteIndependante: revenu.activiteIndependante || false,
                          prestationsSociales: revenu.prestationsSociales || false,
                          subsidesAssuranceMaladie: revenu.subsidesAssuranceMaladie || false,
                          fo_certificatSalaire: revenu.fo_certificatSalaire || false,
                          fo_renteViagere: revenu.fo_renteViagere || false,
                          fo_allocationLogement: revenu.fo_allocationLogement || false,
                          fo_preuveEncaissementSousLoc: revenu.fo_preuveEncaissementSousLoc || false,
                          fo_gainsAccessoires: revenu.fo_gainsAccessoires || false,
                          fo_attestationAutresRevenus: revenu.fo_attestationAutresRevenus || false,
                          fo_etatFinancier: revenu.fo_etatFinancier || false,
                        });
                      }
                    } catch (error) {
                      console.error("Erreur lors de la récupération des données de revenu:", error);
                    }
                  }

                  // Récupérer les données de rentier
                  if (priveResponse.data.fo_rentier) {
                    try {
                      const rentierResponse = await axios.get(`http://127.0.0.1:8000/api/rentiers/prives/${priveId}`, {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      })

                      if (rentierResponse.data && rentierResponse.data.length > 0) {
                        const rentier = rentierResponse.data[0]
                        setRentierData({
                          rentier_id: rentier.rentier_id,
                          fo_attestationRenteAVSAI: rentier.fo_attestationRenteAVSAI || false,
                          fo_attestationRentePrevoyance: rentier.fo_attestationRentePrevoyance || false,
                          fo_autresRentes: rentier.fo_autresRentes || false,
                        })
                      }
                    } catch (error) {
                      console.error("Erreur lors de la récupération des données de rentier:", error)
                    }
                  }



                  // Récupérer les données des banques
                  if (priveResponse.data.fo_banques) {
                    try {
                      const banquesResponse = await axios.get(`http://127.0.0.1:8000/api/banques/prives/${priveId}`, {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      })

                      if (banquesResponse.data) {
                        setBanquesData({
                          banque_id: banquesResponse.data.banque_id,
                          prive_id:banquesResponse.data.prive_id,
                          nb_compte : banquesResponse.data.nb_compte
                        })
                      }
                    } catch (error) {
                      console.error("Erreur lors de la récupération des données des banques:", error)
                    }
                  }

                  // Récupérer les données des titres
                  if (priveResponse.data.fo_titres) {
                    try {
                      const titresResponse = await axios.get(`http://127.0.0.1:8000/api/titres/prives/${priveId}`, {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      })

                      if (titresResponse.data && titresResponse.data.length > 0) {
                        const titres = titresResponse.data[0]
                        setTitresData({
                          titre_id: titres.titre_id,
                          compteBancairePostale: titres.compteBancairePostale || false,
                          actionOuPartSociale: titres.actionOuPartSociale || false,
                          autreElementFortune: titres.autreElementFortune || false,
                          aucunElementFortune: titres.aucunElementFortune || false,
                          objetsValeur: titres.objetsValeur || false,
                          fo_gainJeux: titres.fo_gainJeux || false,
                          fo_releveFiscal: titres.fo_releveFiscal || false,
                        })
                      }
                    } catch (error) {
                      console.error("Erreur lors de la récupération des données des titres:", error)
                    }
                  }

                  // Récupérer les données des immobiliers
                  if (priveResponse.data.fo_immobiliers) {
                    try {
                      const immobiliersResponse = await axios.get(
                        `http://127.0.0.1:8000/api/immobiliers/prives/${priveId}`,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        },
                      )

                      if (immobiliersResponse.data && immobiliersResponse.data.length > 0) {
                        // Gérer le cas où il y a plusieurs biens immobiliers
                        const immobiliers = immobiliersResponse.data.map((immobilier: any) => ({
                          immobilier_id: immobilier.immobilier_id,
                          statut: immobilier.statut || "occupe",
                          canton: immobilier.canton || "",
                          commune: immobilier.commune || "",
                          pays: immobilier.pays || "Suisse",
                          noParcelleGeneve: immobilier.noParcelleGeneve || "",
                          adresseComplete: immobilier.adresseComplete || "",
                          anneeConstruction: immobilier.anneeConstruction || "",
                          occupeDesLe: formatDate(immobilier.occupeDesLe || ""),
                          dateAchat: formatDate(immobilier.dateAchat || ""),
                          pourcentageProprietaire: immobilier.pourcentageProprietaire?.toString() || "100",
                          autreProprietaire: immobilier.autreProprietaire || "",
                          prixAchat: immobilier.prixAchat?.toString() || "",
                          valeurLocativeBrut: immobilier.valeurLocativeBrut?.toString() || "",
                          loyersEncaisses: immobilier.loyersEncaisses?.toString() || "",
                          fraisEntretienDeductibles: immobilier.fraisEntretienDeductibles?.toString() || "",
                          fo_bienImmobilier: immobilier.fo_bienImmobilier || true,
                          fo_attestationValeurLocative: immobilier.fo_attestationValeurLocative || false,
                          fo_taxeFonciereBiensEtranger: immobilier.fo_taxeFonciereBiensEtranger || false,
                          fo_factureEntretienImmeuble: immobilier.fo_factureEntretienImmeuble || false,
                        }))

                        setImmobiliersData({ immobiliers })
                      } else {
                        // Initialiser avec un tableau vide si aucun bien immobilier n'est trouvé
                        setImmobiliersData({ immobiliers: [] })
                      }
                    } catch (error) {
                      console.error("Erreur lors de la récupération des données des immobiliers:", error)
                    }
                  }

                  // Récupérer les données des dettes
                  if (priveResponse.data.fo_dettes) {
                    try {
                      const dettesResponse = await axios.get(
                        `http://127.0.0.1:8000/api/interetsdettes/prives/${priveId}`,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        },
                      )

                      if (dettesResponse.data && dettesResponse.data.length > 0) {
                        const dettes = dettesResponse.data[0]
                        setDettesData({
                          dettes_id: dettes.dettes_id,
                          fo_attestationEmprunt: dettes.fo_attestationEmprunt || false,
                          fo_attestationCarteCredit: dettes.fo_attestationCarteCredit || false,
                          fo_attestationHypotheque: dettes.fo_attestationHypotheque || false,
                        })
                      }
                    } catch (error) {
                      console.error("Erreur lors de la récupération des données des dettes:", error)
                    }
                  }

                  // Récupérer les données des assurances
                  if (priveResponse.data.fo_assurances) {
                    try {
                      const assurancesResponse = await axios.get(
                        `http://127.0.0.1:8000/api/indemnitesassurance/prives/${priveId}`,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        },
                      )

                      if (assurancesResponse.data && assurancesResponse.data.length > 0) {
                        const assurances = assurancesResponse.data[0]
                        setAssurancesData({
                          indemnite_assurance_id: assurances.indemnite_assurance_id,
                          fo_chomage: assurances.fo_chomage || false,
                          fo_maladie: assurances.fo_maladie || false,
                          fo_accident: assurances.fo_accident || false,
                          fo_materniteMilitairePC: assurances.fo_materniteMilitairePC || false,
                        })
                      }
                    } catch (error) {
                      console.error("Erreur lors de la récupération des données des assurances:", error)
                    }
                  }

                  // Récupérer les données des autres déductions
                  if (priveResponse.data.fo_autresDeductions) {
                    try {
                      const autresDeductionsResponse = await axios.get(
                        `http://127.0.0.1:8000/api/deductions/prives/${priveId}`,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        },
                      )

                      if (autresDeductionsResponse.data) {
                        const autresDeductions = autresDeductionsResponse.data
                        setAutresDeductionsData({
                          autre_deduction_id: autresDeductions.autre_deduction_id,
                          fo_rachatLPP: autresDeductions.fo_rachatLPP || false,
                          fo_attestation3emePilierA: autresDeductions.fo_attestation3emePilierA || false,
                          fo_attestation3emePilierB: autresDeductions.fo_attestation3emePilierB || false,
                          fo_attestationAssuranceMaladie: autresDeductions.fo_attestationAssuranceMaladie || false,
                          fo_attestationAssuranceAccident: autresDeductions.fo_attestationAssuranceAccident || false,
                          fo_cotisationAVS: autresDeductions.fo_cotisationAVS || false,
                          fo_fraisFormationProfessionnel: autresDeductions.fo_fraisFormationProfessionnel || false,
                          fo_fraisMedicaux: autresDeductions.fo_fraisMedicaux || false,
                          fo_fraisHandicap: autresDeductions.fo_fraisHandicap || false,
                          fo_dons: autresDeductions.fo_dons || false,
                          fo_versementPartisPolitiques: autresDeductions.fo_versementPartisPolitiques || false,
                        })
                      }
                    } catch (error) {
                      console.error("Erreur lors de la récupération des données des autres déductions:", error)
                    }
                  }

                  // Récupérer les données des autres informations
                  if (priveResponse.data.fo_autresInformations) {
                    try {
                      const autresInformationsResponse = await axios.get(
                        `http://127.0.0.1:8000/api/autresinformations/prives/${priveId}`,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        },
                      )

                      if (autresInformationsResponse.data) {
                        const autresInformations = autresInformationsResponse.data
                        setAutresInformationsData({
                          autre_informations_id: autresInformations.autre_informations_id,
                          fo_versementBoursesEtudes: autresInformations.fo_versementBoursesEtudes || false,
                          fo_pensionsPercuesEnfantMajeurACharge:
                            autresInformations.fo_pensionsPercuesEnfantMajeurACharge || false,
                          fo_prestationsAVSSPC: autresInformations.fo_prestationsAVSSPC || false,
                          fo_prestationsFamilialesSPC: autresInformations.fo_prestationsFamilialesSPC || false,
                          fo_prestationsVilleCommune: autresInformations.fo_prestationsVilleCommune || false,
                          fo_allocationsImpotents: autresInformations.fo_allocationsImpotents || false,
                          fo_reparationTortMoral: autresInformations.fo_reparationTortMoral || false,
                          fo_hospiceGeneral: autresInformations.fo_hospiceGeneral || false,
                          fo_institutionBienfaisance: autresInformations.fo_institutionBienfaisance || false,
                        })
                      }
                    } catch (error) {
                      console.error("Erreur lors de la récupération des données des autres informations:", error)
                    }
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
  }, [router, priveId, userId])


  // Construction dynamique des étapes à afficher
  const etapesAffichees = useMemo(() => {
    
    const baseEtapes = [
      { step: 1, label: "Informations" },
      { step: 14, label: "Confirmation" },
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
        // Initialisation de declarationId 
        let declarationId: number | null = null

        if(mode == "edit"){
           const existingResponse = await axios.get(
          `http://127.0.0.1:8000/api/users/${userId}/declarations/year/${selectedYear}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        console.log(existingResponse)

        // 2. Vérifier s'il y a une déclaration pour l'année en cours

        if (existingResponse) {
          declarationId = existingResponse.data.declaration_id
          console.log(`Une déclaration pour ${selectedYear} existe déjà avec ID ${declarationId}.`)
        }
        }else if(mode == "create"){
          
          const currentYear = new Date().getFullYear().toString()
          console.log(currentYear +"   "+mode)

          // Créer la déclaration principale
          const declarationData = {
            user_id: userId,
            prive_id: priveId,
            titre: `Déclaration`,
            statut: "pending",
            annee: currentYear,
            dateCreation: new Date().toISOString(),
          }

          const declarationResponse = await axios.post("http://127.0.0.1:8000/api/declarations", declarationData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })

           declarationId = declarationResponse.data.declaration_id

          if (!declarationId) {
            throw new Error("Impossible de créer la déclaration")
          }

          console.log("Déclaration créée avec l'ID:", declarationId)
        
        }


        // 3. Envoyer les données de chaque composant à sa table respective
        const apiCalls = []

        // 3.1 Gérer le conjoint si marié ou pacsé
        if ((infoBase.etatCivil === "marie" || infoBase.etatCivil === "pacse") && conjointData) {
          const conjointApiData = {
            declaration_id: declarationId,
            prive_id: priveId,
            nom: conjointData.nom,
            prenom: conjointData.prenom,
            email: conjointData.email,
            localite: conjointData.localite,
            adresse: conjointData.adresse,
            codePostal: conjointData.codePostal,
            numeroTelephone: conjointData.numeroTelephone,
            etatCivil: conjointData.etatCivil,
            dateNaissance: conjointData.dateNaissance,
            nationalite: conjointData.nationalite,
            professionExercee: conjointData.professionExercee,
            contributionReligieuse: conjointData.contributionReligieuse,
          }

          // Si le conjoint a un ID, c'est une mise à jour
          if (conjointData.conjoint_id) {
            apiCalls.push(
              axios.put(`http://127.0.0.1:8000/api/conjoints/${conjointData.conjoint_id}`, conjointApiData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }),
            )
          } else {
            // Sinon, c'est une nouvelle entrée
            apiCalls.push(
              axios.post("http://127.0.0.1:8000/api/conjoints", conjointApiData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }),
            )
          }
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

              let enfantId

              // Si l'enfant a un ID, c'est une mise à jour
              if (enfant.enfant_id) {
                const existingId = enfant.enfant_id
                await axios.put(`http://127.0.0.1:8000/api/enfants/${existingId}`, enfantApiData, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                })
                enfantId = existingId
              } else {
                // Sinon, c'est une nouvelle entrée
                const enfantResponse = await axios.post("http://127.0.0.1:8000/api/enfants", enfantApiData, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                })
                enfantId = enfantResponse.data.enfant_id
              }
              console.log(enfant)

                //Supprimer la pension si _hasPensionAlimentaire est false
              if (!enfant._hasPensionAlimentaire && enfantId) {
                try {
                  await axios.delete(
                    `http://127.0.0.1:8000/api/pensionsalimentaires/enfants/${enfantId}`,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  )
                  console.log(`Pensions supprimées pour l'enfant ${enfantId}`)
                } catch (err) {
                  console.error(`Erreur suppression pension enfant ${enfantId}:`, err)
                }
              }

              // Envoyer les pensions alimentaires associées à cet enfant
              if (enfantsData.pensionsAlimentaires && enfantsData.pensionsAlimentaires.length > 0) {
                const pensionsForEnfant = enfantsData.pensionsAlimentaires.filter(
                  (p) => p.enfant_id === enfant.enfant_id,
                )

                for (const pension of pensionsForEnfant) {
                  const pensionApiData = {
                    declaration_id: declarationId,
                    enfant_id: enfantId,
                    statut: pension.statut,
                    montantContribution: pension.montantContribution,
                    nom: pension.nom,
                    prenom: pension.prenom,
                    noContribuable: pension.noContribuable,
                  }

                  // Si la pension a un ID, c'est une mise à jour
                  if (pension.pension_id) {
                    apiCalls.push(
                      axios.put(
                        `http://127.0.0.1:8000/api/pensionsalimentaires/${pension.pension_id}`,
                        pensionApiData,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                          },
                        },
                      ),
                    )
                  } else {
                    // Sinon, c'est une nouvelle entrée
                    apiCalls.push(
                      axios.post("http://127.0.0.1:8000/api/pensionsalimentaires", pensionApiData, {
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
        }


        // 3.3 Autres personnes à charge
        if (autrePersonneData && autrePersonneData.personnesACharge && autrePersonneData.personnesACharge.length > 0) {
          for (const personne of autrePersonneData.personnesACharge) {
            const personneApiData = {
              autre_persone_id: personne.autre_personne_id,
              declaration_id: declarationId,
              prive_id: priveId,
              nom: personne.nom,
              prenom: personne.prenom,
              dateNaissance: personne.dateNaissance,
              degreParente: personne.degreParente,
              nbPersonneParticipation: personne.nbPersonneParticipation,
              vieAvecPersonneCharge: personne.vieAvecPersonneCharge,
              revenusBrutPersonneACharge: personne.revenusBrutPersonneACharge,
              fortuneNetPersonneACharge: personne.fortuneNetPersonneACharge,
              montantVerseAPersonneACharge: personne.montantVerseAPersonneACharge,
              fo_preuveVersementEffectue: personne.fo_preuveVersementEffectue,
            }
            console.log(personne)

            // Si la personne a un ID, c'est une mise à jour
            if (personne.autre_personne_id) {
              apiCalls.push(
                axios.put(
                  `http://127.0.0.1:8000/api/autrepersonneacharge/${personne.autre_personne_id}`,
                  personneApiData,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                    },
                  },
                ),
              )
            } else {
              // Sinon, c'est une nouvelle entrée
              apiCalls.push(
                axios.post("http://127.0.0.1:8000/api/autrepersonneacharge", personneApiData, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }),
              )
            }
          }
        }

        // 3.4 Revenus
        if (revenuData) {
          const revenuApiData = {
            declaration_id: declarationId,
            prive_id: priveId,
            ...revenuData,
          }

          // Si le revenu a un ID, c'est une mise à jour
          if (revenuData.revenu_id) {
            apiCalls.push(
              axios.put(`http://127.0.0.1:8000/api/revenus/${revenuData.revenu_id}`, revenuApiData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }),
            )
          } else {
            // Sinon, c'est une nouvelle entrée
            apiCalls.push(
              axios.post("http://127.0.0.1:8000/api/revenus", revenuApiData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }),
            )
          }
        }



        // 3.7 Rentier
        if (rentierData) {
          const rentierApiData = {
            declaration_id: declarationId,
            prive_id: priveId,
            ...rentierData,
          }

          console.log("rentier " + rentierData.rentier_id)

          // Si le rentier a un ID, c'est une mise à jour
          if (rentierData.rentier_id) {
            apiCalls.push(
              axios.put(`http://127.0.0.1:8000/api/rentiers/${rentierData.rentier_id}`, rentierApiData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }),
            )
          } else {
            // Sinon, c'est une nouvelle entrée
            apiCalls.push(
              axios.post("http://127.0.0.1:8000/api/rentiers", rentierApiData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }),
            )
          }
        }



        // 3.9 Banques
        
if (banquesData) {
  const banquesApiData = {
    declaration_id: declarationId,
    prive_id: priveId,
    ...banquesData,
  }

  // Si la banque a un ID, c'est une mise à jour
  if (banquesData.banque_id) {
    apiCalls.push(
      axios.put(`http://127.0.0.1:8000/api/banques/${banquesData.banque_id}`, banquesApiData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
    )
  } else {
    // Sinon, c'est une nouvelle entrée
    apiCalls.push(
      axios.post("http://127.0.0.1:8000/api/banques", banquesApiData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
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

          // Si les titres ont un ID, c'est une mise à jour
          if (titresData.titre_id) {
            apiCalls.push(
              axios.put(`http://127.0.0.1:8000/api/titres/${titresData.titre_id}`, titresApiData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }),
            )
          } else {
            // Sinon, c'est une nouvelle entrée
            apiCalls.push(
              axios.post("http://127.0.0.1:8000/api/titres", titresApiData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }),
            )
          }
        }

        // 3.11 Immobiliers
        if (immobiliersData && immobiliersData.immobiliers && immobiliersData.immobiliers.length > 0) {
          for (const immobilier of immobiliersData.immobiliers) {
            const immobilierApiData = {
              declaration_id: declarationId,
              prive_id: priveId,
              statut: immobilier.statut,
              canton: immobilier.canton,
              commune: immobilier.commune,
              pays: immobilier.pays,
              noParcelleGeneve: immobilier.noParcelleGeneve,
              adresseComplete: immobilier.adresseComplete,
              anneeConstruction: immobilier.anneeConstruction,
              occupeDesLe: immobilier.occupeDesLe,
              dateAchat: immobilier.dateAchat,
              pourcentageProprietaire: immobilier.pourcentageProprietaire,
              autreProprietaire: immobilier.autreProprietaire,
              prixAchat: immobilier.prixAchat,
              valeurLocativeBrut: immobilier.valeurLocativeBrut,
              loyersEncaisses: immobilier.loyersEncaisses,
              fraisEntretienDeductibles: immobilier.fraisEntretienDeductibles,
              fo_bienImmobilier: immobilier.fo_bienImmobilier,
              fo_attestationValeurLocative: immobilier.fo_attestationValeurLocative,
              fo_taxeFonciereBiensEtranger: immobilier.fo_taxeFonciereBiensEtranger,
              fo_factureEntretienImmeuble: immobilier.fo_factureEntretienImmeuble,
            }

            // Si l'immobilier a un ID, c'est une mise à jour
            if (immobilier.immobilier_id) {
              apiCalls.push(
                axios.put(`http://127.0.0.1:8000/api/immobiliers/${immobilier.immobilier_id}`, immobilierApiData, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }),
              )
            } else {
              // Sinon, c'est une nouvelle entrée
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
        }

        // 3.12 Dettes
        if (dettesData) {
          const dettesApiData = {
            declaration_id: declarationId,
            prive_id: priveId,
            ...dettesData,
          }

          console.log(dettesData)
          console.log("ID " + dettesData.dettes_id)

          // Si les dettes ont un ID, c'est une mise à jour
          if (dettesData.dettes_id) {
            apiCalls.push(
              axios.put(`http://127.0.0.1:8000/api/interetsdettes/${dettesData.dettes_id}`, dettesApiData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }),
            )
          } else {
            // Sinon, c'est une nouvelle entrée
            apiCalls.push(
              axios.post("http://127.0.0.1:8000/api/interetsdettes", dettesApiData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }),
            )
          }
        }

        // 3.13 Assurances
        if (assurancesData) {
          const assurancesApiData = {
            declaration_id: declarationId,
            prive_id: priveId,
            ...assurancesData,
          }

          // Si les assurances ont un ID, c'est une mise à jour
          if (assurancesData.indemnite_assurance_id) {
            apiCalls.push(
              axios.put(
                `http://127.0.0.1:8000/api/indemnitesassurances/${assurancesData.indemnite_assurance_id}`,
                assurancesApiData,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                },
              ),
            )
          } else {
            // Sinon, c'est une nouvelle entrée
            apiCalls.push(
              axios.post("http://127.0.0.1:8000/api/indemnitesassurances", assurancesApiData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }),
            )
          }
        }

        // 3.14 Autres déductions
        if (autresDeductionsData) {
          const autresDeductionsApiData = {
            declaration_id: declarationId,
            prive_id: priveId,
            ...autresDeductionsData,
          }

          // Si les autres déductions ont un ID, c'est une mise à jour
          if (autresDeductionsData.autre_deduction_id) {
            apiCalls.push(
              axios.put(
                `http://127.0.0.1:8000/api/deductions/${autresDeductionsData.autre_deduction_id}`,
                autresDeductionsApiData,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                },
              ),
            )
          } else {
            // Sinon, c'est une nouvelle entrée
            apiCalls.push(
              axios.post("http://127.0.0.1:8000/api/deductions", autresDeductionsApiData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }),
            )
          }
        }

        // 3.15 Autres informations
        if (autresInformationsData) {
          const autresInfosApiData = {
            declaration_id: declarationId,
            prive_id: priveId,
            ...autresInformationsData,
          }

          // Si les autres informations ont un ID, c'est une mise à jour
          if (autresInformationsData.autre_informations_id) {
            apiCalls.push(
              axios.put(
                `http://127.0.0.1:8000/api/autresinformations/${autresInformationsData.autre_informations_id}`,
                autresInfosApiData,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                },
              )
            )
          } else {
            // Sinon, c'est une nouvelle entrée
            apiCalls.push(
              axios.post("http://127.0.0.1:8000/api/autresinformations", autresInfosApiData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }),
            )
          }
          
        }
        console.log("rubrique")
          //rubrique
          if (mode === "create") {
  // Mode création : on crée uniquement les rubriques nécessaires à partir de formSections
  const rubriquesMapping: Record<string, string> = {
    fo_enfants: "Enfants",
    fo_banques: "Banques",
    fo_dettes: "Dettes",
    fo_immobiliers: "Immobiliers",
    fo_revenu: "Revenu",
    fo_autrePersonneCharge: "Autres personnes à charge",
    fo_rentier: "Rentier",
    fo_assurances: "Assurances",
    fo_autresDeductions: "Autres déductions",
    fo_autresInformations: "Autres informations",
    fo_titres: "Titres",
  }

  const rubriquesToCreate: Rubrique[] = []

  for (const [foKey, foValue] of Object.entries(formSections)) {
    if (foValue && rubriquesMapping[foKey]) {
      rubriquesToCreate.push({
        declaration_id: declarationId,
        type: foKey,
        titre: rubriquesMapping[foKey],
      })
    }
  }
  if(priveData.etatCivil == "marie" || priveData.etatCivil=="pacse"){
    rubriquesToCreate.push({
        declaration_id: declarationId,
        type: priveData.etatCivil,
        titre: "Conjoint(e)",    })
  }

  // Création des rubriques en backend
  for (const rubriqueData of rubriquesToCreate) {
    try {
      await axios.post("http://127.0.0.1:8000/api/rubriques", rubriqueData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      console.log(`Rubrique créée : ${rubriqueData.titre}`)
    } catch (err) {
      console.error(`Erreur lors de la création de ${rubriqueData.titre}`, err)
    }
  }

  console.log(`${rubriquesToCreate.length} rubriques créées.`)

} else if(mode=="edit"){
  let rubriquesResponse
  let existingRubriques: Rubrique[] = []

  try {
    rubriquesResponse = await axios.get(
      `http://127.0.0.1:8000/api/rubriques/declaration/${declarationId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )

    if (Array.isArray(rubriquesResponse.data)) {
      existingRubriques = rubriquesResponse.data
    } else {
      console.warn("Réponse inattendue lors de la récupération des rubriques", rubriquesResponse.data)
    }
  } catch (err) {
    console.warn("Erreur lors de la récupération des rubriques, on suppose aucune rubrique existante", err)
    // existingRubriques reste []
  }
  
  // Cas spécial: pas de rubriques existantes (comme en mode création)
  if (existingRubriques.length === 0){
  const rubriquesMapping: Record<string, string> = {
    fo_enfants: "Enfants",
    fo_banques: "Banques",
    fo_dettes: "Dettes",
    fo_immobiliers: "Immobiliers",
    fo_revenu: "Revenu",
    fo_autrePersonneCharge: "Autres personnes à charge",
    fo_rentier: "Rentier",
    fo_assurances: "Assurances",
    fo_autresDeductions: "Autres déductions",
    fo_autresInformations: "Autres informations",
    fo_titres: "Titres",
    marie:"Conjoint(e)",
    pacse:"Conjoint(e)"
  }

    const rubriquesToCreate: Rubrique[] = [];

    // 1. Création basée sur formSections
    for (const [foKey, foValue] of Object.entries(formSections)) {
      if (foValue && rubriquesMapping[foKey]) {
        rubriquesToCreate.push({
          declaration_id: declarationId,
          type: foKey,
          titre: rubriquesMapping[foKey]
        });
      }
    }
   // 2. Gestion spécifique état civil - Vérification avant création
    const etatCivil = priveData.etatCivil;
    if (etatCivil === "marie" || etatCivil === "pacse") {
      const conjointRubriqueExists = existingRubriques.some(
        r => r.type === etatCivil || r.titre === "Conjoint(e)"
      );
      
      if (!conjointRubriqueExists) {
        rubriquesToCreate.push({
          declaration_id: declarationId,
          type: etatCivil,
          titre: rubriquesMapping[etatCivil]
        });
      }
    }
console.log("TTT "+JSON.stringify(rubriquesToCreate))
  // Création des rubriques en backend
  for (const rubriqueData of rubriquesToCreate) {
    try {
      await axios.post("http://127.0.0.1:8000/api/rubriques", rubriqueData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      console.log(`Rubrique créée : ${rubriqueData.titre}`)
    } catch (err) {
      console.error(`Erreur lors de la création de ${rubriqueData.titre}`, err)
    }
  }

  console.log(`${rubriquesToCreate.length} rubriques créées.`)

          }else{          console.log("existe "+rubriquesResponse)
          

          // Créer un mapping des rubriques existantes par type pour faciliter la recherche
          const existingRubriquesMap: Record<string, Rubrique> = {}
          existingRubriques.forEach((rubrique) => {
            existingRubriquesMap[rubrique.type] = rubrique
          })

          // 2. Mapper les fo_* aux types de rubriques
          const rubriquesMapping: Record<string, string> = {
            fo_enfants: "Enfants",
            fo_banques: "Banques",
            fo_dettes: "Dettes",
            fo_immobiliers: "Immobiliers",
            fo_revenu: "Revenu",
            fo_autrePersonneCharge: "Autres personnes à charge",
            fo_rentier: "Rentier",
            fo_assurances: "Assurances",
            fo_autresDeductions: "Autres déductions",
            fo_autresInformations: "Autres informations",
            fo_titres: "Titres",
    marie:"Conjoint(e)",
    pacse:"Conjoint(e)"          }

          // 3. Créer ou mettre à jour les rubriques en fonction des fo_* activés
          const rubriquesToCreate: Rubrique[] = []

          for (const [foKey, foValue] of Object.entries(formSections)) {
  if (foValue && rubriquesMapping[foKey]) {
    const rubriqueName = rubriquesMapping[foKey]
    
    if (!existingRubriquesMap[foKey]) {
      rubriquesToCreate.push({
        declaration_id: declarationId,
        type: foKey,
        titre: rubriqueName
      })
    }
  }
}

// 3. Ajout spécifique pour état civil
const etatCivil = priveData.etatCivil;
if ((etatCivil === "marie" || etatCivil === "pacse") && 
    !existingRubriquesMap[etatCivil] && 
    !rubriquesToCreate.some(r => r.type === etatCivil)) {
  rubriquesToCreate.push({
    declaration_id: declarationId,
    type: etatCivil,
    titre: rubriquesMapping[etatCivil]
  })
}
          console.log(rubriquesToCreate)

          // 4. Créer les nouvelles rubriques
          if (rubriquesToCreate.length > 0) {
            for (const rubriqueData of rubriquesToCreate) {
              console.log(rubriqueData)
               axios.post("http://127.0.0.1:8000/api/rubriques", rubriqueData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              })
            }
            console.log(`${rubriquesToCreate.length} nouvelles rubriques créées`)
          }

          // 5. Identifier les rubriques à supprimer (celles qui existent mais dont le fo_* n'est plus activé)
          const rubriquesToDelete = []

for (const rubrique of existingRubriques) {
  const correspondingFoKey = rubrique.type;
  
  // Vérifier si la rubrique doit être exclue de la suppression
  const isProtectedRubrique = (
    (priveData.etatCivil === "marie" || priveData.etatCivil === "pacse") && 
    (correspondingFoKey === "fo_enfants" || correspondingFoKey === "fo_autrePersonneCharge")
  );

  if (correspondingFoKey && !formSections[correspondingFoKey] && !isProtectedRubrique) {
    rubriquesToDelete.push(rubrique);
  }
}

// 6. Supprimer les rubriques qui ne sont plus nécessaires
if (rubriquesToDelete.length > 0) {
  console.log(`${rubriquesToDelete.length} rubriques à supprimer:`);
for (const rubrique of existingRubriques) {
  const correspondingFoKey = rubrique.type;
  const isConjointRubrique = rubrique.type === "marie" || rubrique.type === "pacse";
  const isProtected = (etatCivil === "marie" || etatCivil === "pacse") && 
                     (isConjointRubrique || correspondingFoKey === "fo_enfants" || 
                      correspondingFoKey === "fo_autrePersonneCharge");

  if (!isProtected && correspondingFoKey && !formSections[correspondingFoKey]) {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/rubriques/${rubrique.rubrique_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error(`Erreur suppression ${rubrique.titre}:`, error);
    }
  }
}
}
          const deleteFoKeys = Object.keys(formSections).filter(
  (key) => !formSections[key] && foToApiMap[key]
)

for (const foKey of deleteFoKeys) {
  const endpoint = foToApiMap[foKey]
  try {
    await axios.delete(`http://127.0.0.1:8000/api/${endpoint}/prives/${priveId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log(`Données supprimées pour ${foKey}`)
  } catch (err) {
    console.error(`Erreur suppression ${foKey}:`, err)
  }
}}

}
          
    // Supprimer le conjoint si l'état civil n'est plus marié ou pacsé
    if (priveData.etatCivil !== "marie" && priveData.etatCivil !== "pacse") {
      try{
        const reponse = await axios.get(`http://127.0.0.1:8000/api/conjoints/prives/${priveId}`)
          if(reponse){
            await axios.delete(`http://127.0.0.1:8000/api/conjoints/prives/${priveId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })}
      }catch(error){
        console.log(error)}
}

          try {
            if (onSubmitSuccess) {
              const formData: FormDataType = {
                infoBase,
                conjoint: conjointData || undefined,
                enfants: enfantsData || undefined,
                autrePersonne: autrePersonneData || undefined,
                revenu: revenuData || undefined,
                rentier: rentierData || undefined,
                banques: banquesData || undefined,
                titres: titresData || undefined,
                immobiliers: immobiliersData || undefined,
                dettes: dettesData || undefined,
                assurances: assurancesData || undefined,
                autresDeductions: autresDeductionsData || undefined,
                autresInformations: autresInformationsData || undefined,
              };
              await onSubmitSuccess(formData);
            }
          } catch (error) {
            console.log(error)
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
              id="fo_enfants"
              checked={hasEnfants || formSections.fo_enfants}
                onCheckedChange={(checked) => {
    setHasEnfants(checked as boolean);
    handleSectionChange("fo_enfants", checked as boolean);
  }}
            />
            <Label htmlFor="hasEnfants">Avez-vous des enfants à charge?</Label>
          </div>
        </div>

        <h3 className="text-lg font-medium">Rubriques à remplir</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="fo_revenu"
              checked={formSections.fo_revenu}
              onCheckedChange={(checked) => handleSectionChange("fo_revenu", checked as boolean)}
            />
            <Label htmlFor="fo_revenu" className="font-medium">
              Percevez-vous un revenu, y compris d'une activité indépendante ?
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
              id="fo_assurances"
              checked={formSections.fo_assurances}
              onCheckedChange={(checked) => handleSectionChange("fo_assurances", checked as boolean)}
            />
            <Label htmlFor="fo_assurances" className="font-medium">
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
              id="fo_autresDeductions"
              checked={formSections.fo_autresDeductions}
              onCheckedChange={(checked) => handleSectionChange("fo_autresDeductions", checked as boolean)}
            />
            <Label htmlFor="fo_autresDeductions" className="font-medium">
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
              id="fo_autresInformations"
              checked={formSections.fo_autresInformations}
              onCheckedChange={(checked) => handleSectionChange("fo_autresInformations", checked as boolean)}
            />
            <Label htmlFor="fo_autresInformations" className="font-medium">
              Souhaitez-vous communiquer d'autres informations (dons, 3e pilier, cotisations AVS, handicap, etc.) ?
            </Label>
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
        <Conjoint
          data={conjointData}
          onUpdate={(newData) => setConjointData(newData)}
          onNext={nextStep}
          onPrev={prevStep}
        />
    )
  }

  // Rendu de l'étape 3: Informations des enfants (si a des enfants)
const renderStep3 = () => {
  if (!hasEnfants || !formSections.fo_enfants) {
    // Si pas d'enfants et pas de section enfants demandée, passer directement à l'étape suivante
    setTimeout(() => nextStep(), 0);
    return (
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  // Si nous avons des enfants OU que la section enfants est demandée
  // Convertir les enfants en objets Enfant complets
  const enfantsComplets = enfants.map((enfant) => ({
    nom: enfant.nom || "",
    prenom: enfant.prenom || "",
    dateNaissance: enfant.dateNaissance || "",
    adresse: enfant.adresse || "",
    codePostal: enfant.codePostal || "",
    localite: enfant.localite || "",
    noAVS: enfant.noAVS || "",
    noContribuable: enfant.noContribuable || "",
    revenuBrut: enfant.revenuBrut || "0",
    fortuneNet: enfant.fortuneNet || "0",
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
  }));

  // Initialiser les données seulement si elles n'existent pas encore
  if (!enfantsData) {
    const initialEnfantsData = {
      enfants: enfantsComplets,
      pensionsAlimentaires: pensionsAlimentaires || [],
    };
    setEnfantsData(initialEnfantsData);
  }

  return (
      <Enfants
        data={enfantsData || { enfants: [], pensionsAlimentaires: [] }}
        onUpdate={(newData) => setEnfantsData(newData)}
        onNext={nextStep}
        onPrev={prevStep}
      />
  );
};
  // Rendu de l'étape 4: Autres personnes à charge

  const renderStep4 = () => (
      <AutrePersonne
        data={autrePersonneData}
        onUpdate={(newData) => setAutrePersonneData(newData)}
        onNext={nextStep}
        onPrev={prevStep}
      />
  )

  // Rendu de l'étape 5: Revenu
  const renderStep5 = () => (
      <Revenu data={revenuData} onUpdate={(newData) => setRevenuData(newData)} onNext={nextStep} onPrev={prevStep} />
  )



  // Rendu de l'étape 14: Assurances
  const renderStep6 = () => (
      <Assurances
        data={assurancesData}
        onUpdate={(newData) => setAssurancesData(newData)}
        onNext={nextStep}
        onPrev={prevStep}
      />
  )
  

  // Rendu de l'étape 8: Rentier
  const renderStep7 = () => (
      <Rentier data={rentierData} onUpdate={(newData) => setRentierData(newData)} onNext={nextStep} onPrev={prevStep} />
  )


  // Rendu de l'étape 10: Banques
  const renderStep8 = () => (
      <Banques data={banquesData} onUpdate={(newData) => setBanquesData(newData)} onNext={nextStep} onPrev={prevStep} />
  )

  // Rendu de l'étape 11: Titres
  const renderStep9 = () => (
      <Titres data={titresData} onUpdate={(newData) => setTitresData(newData)} onNext={nextStep} onPrev={prevStep} />
  )

  // Rendu de l'étape 12: Immobiliers
  const renderStep10 = () => (
      <Immobiliers
        data={immobiliersData}
        onUpdate={(newData) => setImmobiliersData(newData)}
        onNext={nextStep}
        onPrev={prevStep}
      />
  )

  // Rendu de l'étape 13: Dettes
  const renderStep11 = () => (
      <Dettes data={dettesData} onUpdate={(newData) => setDettesData(newData)} onNext={nextStep} onPrev={prevStep} />
  )



  // Rendu de l'étape 15: Autres déductions
  const renderStep12 = () => (
      <AutresDeductions
        data={autresDeductionsData}
        onUpdate={(newData) => setAutresDeductionsData(newData)}
        onNext={nextStep}
        onPrev={prevStep}
      />
  )

  // Rendu de l'étape 16: Autres informations
  const renderStep13 = () => (
      <AutresInformations
        data={autresInformationsData}
        onUpdate={(newData) => setAutresInformationsData(newData)}
        onNext={nextStep}
        onPrev={prevStep}
      />
  )

  // Rendu de l'étape 18: Récapitulatif et confirmation
  const renderStep14 = () => (
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
                    : infoBase.etatCivil === "marie" || "marié"
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
                    <strong>Nom:</strong> {conjointData?.nom}
                  </p>
                  <p>
                    <strong>Prénom:</strong> {conjointData?.prenom}
                  </p>
                  <p>
                    <strong>Date de naissance:</strong> {conjointData?.dateNaissance}
                  </p>
                  <p>
                    <strong>Nationalité:</strong> {conjointData?.nationalite}
                  </p>
 
                  {conjointData?.adresse && (
                    <>
                      <p>
                        <strong>Adresse:</strong> {conjointData?.adresse}
                      </p>
                      <p>
                        <strong>Localité:</strong> {conjointData?.localite}
                      </p>
                      <p>
                        <strong>Code postal:</strong> {conjointData?.codePostal}
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
                {formSections.fo_revenu && <li>Revenu</li>}
                {formSections.fo_rentier && <li>Rentier</li>}
                {formSections.fo_banques && <li>Banques</li>}
                {formSections.fo_immobiliers && <li>Immobiliers</li>}
                {formSections.fo_dettes && <li>Dettes</li>}
                {formSections.fo_assurances && <li>Assurances</li>}
                {formSections.fo_autrePersonneCharge && <li>Autres personnes à charge</li>}
                {formSections.fo_titres && <li>Titres/Élement de fortunue</li>}
                {formSections.fo_autresDeductions && <li>Autres déductions</li>}
                {formSections.fo_autresInformations && <li>Autres informations</li>}
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
      default:
        return renderStep1()
    }
  }

  // Ajoute ce bloc juste avant le return principal du composant
  if (authentifie === null) {
    return null;
  }

  if (!authentifie) {
    return notFound();
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
  )
}


