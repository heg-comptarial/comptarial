/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Edit,
  Download,
  CheckCircle,
  MessageSquare,
  ArrowLeft,
  AlertTriangle,
  XCircle,
  Save,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast, Toaster } from "sonner"
import axios from "axios"
import AddRubriqueDialog from "@/components/adminPage/add-rubrique"
import ConfirmationDialog from "@/components/confirmation-dialog"
import CreateDeclarationDialog from "@/components/adminPage/declaration-dialog"
import DocumentUpload from "@/components/protected/declarations-client/features/documents/DocumentUpload"
import FormulairePrive from "@/components/adminPage/formulaire-prive"
import { getStatusBadge } from "@/utils/getStatusBadge"

// Définition des types pour les modèles
interface Entreprise {
  id: number
  nom: string
  adresse: string
  codePostal: string
  localite: string
  numeroFiscal?: string
  raisonSociale?: string
}

interface Prive {
  id: number
  nom: string
  prenom: string
  dateNaissance: string
  nationalite?: string
  etatCivil?: string
}

// Mettre à jour l'interface Document pour correspondre à la structure de la table
interface Document {
  doc_id: number
  rubrique_id: number
  nom: string
  type: "pdf" | "doc" | "xls" | "xlsx" | "ppt" | "jpeg" | "jpg" | "png" | "other"
  cheminFichier: string
  statut: "pending" | "rejected" | "approved"
  sous_rubrique?: string | null
  dateCreation: string
  rubrique?: Rubrique // Relation hasOne
  // Propriétés supplémentaires pour la compatibilité avec le code existant
  chemin?: string // Alias pour cheminFichier
  dateUpload?: string // Alias pour dateCreation
  commentaire?: string // Ajouté pour les commentaires
  taille?: number
  rubriqueNom?: string
  annee?: number | string
}

// Mettre à jour l'interface Rubrique pour correspondre à la structure de la table
interface Rubrique {
  rubrique_id: number
  declaration_id: number
  titre: string
  declaration?: Declaration
  // Propriétés supplémentaires pour la compatibilité avec le code existant
  id?: number // Alias pour rubrique_id
  nom?: string // Alias pour titre
  documents?: Document[]
}

// Mettre à jour l'interface Declaration pour correspondre à la structure de la table
interface Declaration {
  declaration_id: number
  user_id: number
  titre: string
  statut: "pending" | "approved"
  annee: number | string
  dateCreation: string
  impots: string
  // Propriétés supplémentaires pour la compatibilité avec le code existant
  id?: number // Alias pour declaration_id
  dateSoumission?: string // Alias pour dateCreation
  rubriques?: Rubrique[]
}

// Interface principale pour les détails utilisateur
interface UserDetails {
  user_id: number
  nom: string
  email: string
  numeroTelephone: string
  localite: string
  adresse: string
  codePostal: string
  role: string
  statut: string
  dateCreation: string
  entreprises?: Entreprise // Relation hasOne
  prives?: Prive // Relation hasOne
  declarations?: Declaration[] // Relation hasMany
}

export default function ClientDetail() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false)

  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeDeclaration, setActiveDeclaration] = useState<Declaration | null>(null)
  const [commentaire, setCommentaire] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([])
  const [declarationYears, setDeclarationYears] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isEditingUser, setIsEditingUser] = useState<boolean>(false)
  const [editedUser, setEditedUser] = useState<Partial<UserDetails> | null>(null)
  const [uploadCompletedRubriques, setUploadCompletedRubriques] = useState<number[]>([])
  // Ajouter un état pour stocker l'ID de l'administrateur
  const [adminId, setAdminId] = useState<number | null>(null)

  // État pour gérer l'ouverture de la boîte de dialogue d'ajout de rubrique
  const [isAddingRubrique, setIsAddingRubrique] = useState(false)

  // Ajouter un nouvel état pour gérer le dialogue de confirmation
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false)
  const [pendingDeclarationAction, setPendingDeclarationAction] = useState<{
    declarationId: number
    status: "approved" | "pending" | "rejected"
  } | null>(null)
  const [documentsNonValides, setDocumentsNonValides] = useState<string[]>([])

  // Ajouter ces états pour gérer la modification de rubrique
  const [isEditingRubrique, setIsEditingRubrique] = useState(false)
  const [currentRubriqueId, setCurrentRubriqueId] = useState<number | string | null>(null)

  const [adminSelectedFiles, setAdminSelectedFiles] = useState<{ file: File; rubriqueId: number }[]>([])

  const [editedImpots, setEditedImpots] = useState(activeDeclaration?.impots || "")
  const [isImpotsDialogOpen, setIsImpotsDialogOpen] = useState(false)

  // État pour gérer l'envoi de notifications
  const [lastNotificationSentAt, setLastNotificationSentAt] = useState<Date | null>(null)

  const handleUpdateImpots = async (declarationId: number, newImpots: string) => {
    try {
      const response = await axios.patch(`${API_URL}/declarations/${declarationId}`, {
        impots: newImpots,
      })

      if (response.status === 200) {
        // Créer une notification pour le client
        await axios.post(`${API_URL}/notifications`, {
          user_id: userDetails?.user_id,
          contenu: `Le montant des impôts de votre déclaration a été mis à jour: ${newImpots}`,
        })

        toast.success("Montant des impôts mis à jour avec succès !")
        await refreshUserData() // Rafraîchir les données utilisateur
      } else {
        toast.error("Erreur lors de la mise à jour des impôts.")
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des impôts :", error)
      toast.error("Erreur lors de la mise à jour des impôts.")
    }
  }

  // Fonction pour rafraîchir les données utilisateur
  const refreshUserData = async () => {
    try {
      // Conserver l'année active avant le rafraîchissement
      const activeYear = activeDeclaration ? getYearOfDeclaration(activeDeclaration) : null

      // Récupérer les données utilisateur depuis l'API
      const response = await axios.get(`${API_URL}/users/${userId}/full-data`)
      const data = response.data

      if (data.success) {
        // Trier les déclarations par année (du plus grand au plus petit)
        const sortedDeclarations = data.data.declarations.sort(
          (a: Declaration, b: Declaration) => Number(b.annee) - Number(a.annee),
        )

        // Mettre à jour les données utilisateur avec les déclarations triées
        setUserDetails({ ...data.data, declarations: sortedDeclarations })

        // Rétablir la déclaration active en fonction de l'année
        if (activeYear && sortedDeclarations) {
          const updatedActiveDeclaration = sortedDeclarations.find(
            (d: Declaration) => getYearOfDeclaration(d) === activeYear,
          )
          if (updatedActiveDeclaration) {
            setActiveDeclaration(updatedActiveDeclaration)
          }
        }
      } else {
        toast.error(data.message || "Erreur lors du rechargement des données")
      }

      if (data.data.declarations && data.data.declarations.length > 0) {
        const years = data.data.declarations.map((d: Declaration) =>
          d.annee ? d.annee.toString() : new Date(d.dateCreation || d.dateSoumission || "").getFullYear().toString(),
        )

        const uniqueSortedYears = Array.from(new Set(years) as Set<string>).sort(
          (a, b) => Number.parseInt(b) - Number.parseInt(a),
        )

        setDeclarationYears(uniqueSortedYears)
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error)
      toast.error("Erreur lors du rechargement des données utilisateur")
    }
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_URL}/users/${userId}/full-data`)

        const data = response.data
        if (!data.success) {
          throw new Error(data.message || "Erreur lors de la récupération des données")
        }
          console.log(data)

        setUserDetails(data.data)
        setEditedUser(data.data)

        // Extraire les années des déclarations et définir la déclaration active
        if (data.data.declarations && data.data.declarations.length > 0) {
          const sortedDeclarations = data.data.declarations.sort(
            (a: Declaration, b: Declaration) => Number(b.annee) - Number(a.annee),
          )

          const years = sortedDeclarations.map((d: Declaration) =>
            d.annee ? d.annee.toString() : new Date(d.dateCreation || d.dateSoumission || "").getFullYear().toString(),
          )

          const uniqueSortedYears = Array.from(new Set(years) as Set<string>)
          setDeclarationYears(uniqueSortedYears)

          // Définir la déclaration avec l'année la plus grande comme active
          setActiveDeclaration(sortedDeclarations[0])
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de l'utilisateur :", error)
        toast.error("Erreur lors du chargement des données utilisateur")
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchUserDetails()
    }
  }, [userId, API_URL])

  // Effet pour filtrer les documents en fonction du terme de recherche
  useEffect(() => {
    if (!userDetails?.declarations) return

    const allDocuments = userDetails.declarations.flatMap(
      (declaration) =>
        declaration.rubriques?.flatMap((rubrique) =>
          (rubrique.documents || []).map((doc) => ({
            ...doc,
            rubriqueNom: rubrique.titre || rubrique.nom || "",
            declarationId: declaration.declaration_id || declaration.id,
            annee:
              declaration.annee || new Date(declaration.dateCreation || declaration.dateSoumission || "").getFullYear(),
          })),
        ) || [],
    )

    if (!searchTerm.trim()) {
      setFilteredDocuments(allDocuments)
      return
    }

    const filtered = allDocuments.filter(
      (doc) =>
        doc.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.rubriqueNom && doc.rubriqueNom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.sous_rubrique && doc.sous_rubrique.toLowerCase().includes(searchTerm.toLowerCase())) ||
        doc.statut.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    setFilteredDocuments(filtered)
  }, [searchTerm, userDetails])

  // Modifier la fonction handleDocumentStatusChange pour recharger les données avec la nouvelle route
  const handleDocumentStatusChange = async (documentId: number, newStatus: string) => {
    try {
      await axios.patch(`${API_URL}/documents/${documentId}`, {
        statut: newStatus,
      })

      // Créer une notification pour le client
      await axios.post(`${API_URL}/notifications/document-status`, {
        document_id: documentId,
        status: newStatus,
      })

      toast.success(`Statut du document mis à jour avec succès`)

      // Mettre à jour l'état local en utilisant la nouvelle route
      await refreshUserData()
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut du document:", error)
      toast.error("Erreur lors de la mise à jour du statut du document")
    }
  }

  // Modifier la fonction handleDeclarationStatusChange pour recharger les données avec la nouvelle route
  const handleDeclarationStatusChange = async (
    declarationId: number,
    newStatus: "approved" | "pending" | "rejected",
  ) => {
    // Si ce n'est pas une validation, on procède normalement
    if (newStatus !== "approved") {
      try {
        const response = await fetch(`${API_URL}/declarations/${declarationId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ statut: newStatus }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          toast.error(errorData.message || "Erreur lors de la mise à jour du statut")
          return
        }

        // Créer une notification pour le client
        await axios.post(`${API_URL}/notifications/declaration-status`, {
          declaration_id: declarationId,
          status: newStatus,
        })

        toast.success("Statut de la déclaration mis à jour avec succès")

        const fetchResponse = await fetch(`${API_URL}/users/${userId}/full-data`)
        if (fetchResponse.ok) {
          const data = await fetchResponse.json()
          if (data.success) {
            setUserDetails(data.data)

            const updated = data.data.declarations.find(
              (d: Declaration) => d.id === declarationId || d.declaration_id === declarationId,
            )
            if (updated) {
              setActiveDeclaration(updated)
            }
          }
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la déclaration:", error)
        toast.error("Erreur inattendue lors de la mise à jour")
      }
      return
    }

    // Pour les validations, vérifier d'abord si tous les documents sont approuvés
    try {
      // Vérifier si tous les documents sont approuvés
      const checkResponse = await fetch(`${API_URL}/declarations/${declarationId}/check-documents`)
      const checkData = await checkResponse.json()

      if (!checkResponse.ok) {
        toast.error(checkData.message || "Erreur lors de la vérification des documents")
        return
      }

      // Si tous les documents sont approuvés, procéder normalement
      if (checkData.all_documents_approved) {
        const response = await fetch(`${API_URL}/declarations/${declarationId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ statut: newStatus }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          toast.error(errorData.message || "Erreur lors de la mise à jour du statut")
          return
        }

        // Créer une notification pour le client
        await axios.post(`${API_URL}/notifications/declaration-status`, {
          declaration_id: declarationId,
          status: newStatus,
        })

        toast.success("Statut de la déclaration mis à jour avec succès")

        // Rafraîchir les données
        const fetchResponse = await fetch(`${API_URL}/users/${userId}/full-data`)
        if (fetchResponse.ok) {
          const data = await fetchResponse.json()
          if (data.success) {
            setUserDetails(data.data)

            const updated = data.data.declarations.find(
              (d: Declaration) => d.id === declarationId || d.declaration_id === declarationId,
            )
            if (updated) {
              setActiveDeclaration(updated)
            }
          }
        }
      } else {
        // Si certains documents ne sont pas approuvés, ouvrir le dialogue de confirmation
        setDocumentsNonValides(checkData.documents_non_valides || [])
        setPendingDeclarationAction({
          declarationId,
          status: newStatus,
        })
        setConfirmationDialogOpen(true)
      }
    } catch (error) {
      console.error("Erreur lors de la vérification des documents:", error)
      toast.error("Erreur inattendue lors de la vérification des documents")
    }
  }

  // Modifier la fonction handleAddComment pour utiliser directement un ID administrateur par défaut
  const handleAddComment = async (documentId: number) => {
    if (!commentaire.trim()) {
      toast.error("Veuillez saisir un commentaire")
      return
    }

    if (!adminId) {
      toast.error("ID administrateur non trouvé. Veuillez vous reconnecter à la page d'administration.")
      return
    }

    // Vérifier explicitement que l'ID du document est valide
    if (!documentId || isNaN(Number(documentId))) {
      toast.error("ID du document invalide ou manquant")
      console.error("ID du document invalide:", documentId)
      return
    }

    try {
      // Formater la date au format requis: YYYY-MM-DD HH:MM:SS
      const now = new Date()
      const dateCreation = now.toISOString().slice(0, 19).replace("T", " ")

      await axios.post(`${API_URL}/commentaires`, {
        document_id: documentId,
        admin_id: adminId,
        contenu: commentaire,
        dateCreation: dateCreation,
      })

      // Créer une notification pour le client
      await axios.post(`${API_URL}/notifications/document-comment`, {
        admin_id: adminId,
        document_id: documentId,
        contenu: commentaire,
      })

      toast.success("Commentaire ajouté avec succès")

      // Mettre à jour l'état local
      await refreshUserData()

      setCommentaire("")
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error)

      // Afficher des détails plus précis sur l'erreur
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message || "Erreur lors de l'ajout du commentaire"
        toast.error(errorMessage)
        console.error("Détails de l'erreur:", error.response.data)
      } else {
        toast.error("Erreur lors de l'ajout du commentaire")
      }
    }
  }

  const fetchAdminID = async () => {
    const token = localStorage.getItem("auth_token")

    if (!token) {
      console.error("Token manquant !")
      return null
    }

    try {
      const response = await axios.get(`${API_URL}/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data.admin_id
    } catch (error) {
      console.error("Erreur lors de la récupération de l'admin :", error)
    }
  }

  // Effet pour récupérer l'ID administrateur depuis les paramètres d'URL
  useEffect(() => {
    fetchAdminID()
      .then((id) => {
        if (id !== null) {
          setAdminId(Number(id))
        }
      })
      .catch((err) => {
        console.error("Impossible de récupérer l'admin_id :", err)
      })
  }, [])

  // Remplacer la fonction handleYearChange par celle-ci pour corriger le problème de sélection des années
  const handleYearChange = (year: string) => {
    if (userDetails?.declarations) {
      const selected = userDetails.declarations.find((d) => {
        const dYear = d.annee?.toString() ?? new Date(d.dateCreation || d.dateSoumission || "").getFullYear().toString()
        return dYear === year
      })

      if (selected) {
        setActiveDeclaration(selected)
      }
    }
  }

  const getYearOfDeclaration = (d: Declaration) => {
    if (d.annee != null) {
      return d.annee.toString()
    }
    const date = d.dateCreation || d.dateSoumission
    return date ? new Date(date).getFullYear().toString() : ""
  }

  const handleUserUpdate = async () => {
    if (!editedUser) return

    setIsSaving(true)
    try {
      // 1. Mettre à jour les informations de l'utilisateur
      await axios.put(
        `${API_URL}/users/${userId}`,
        editedUser,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      )
      // 2. Après la mise à jour réussie, récupérer toutes les données complètes
      await refreshUserData()

      setIsEditingUser(false)
      toast.success("Informations utilisateur mises à jour avec succès")
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error)
      toast.error("Erreur lors de la mise à jour de l'utilisateur")
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditedUser((prev: any) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDeleteRubrique = async (id: string | number) => {
    // Petite confirmation avant suppression (optionnel)
    const confirmed = window.confirm("Voulez-vous vraiment supprimer cette rubrique ?")
    if (!confirmed) return

    try {
      await axios.delete(`${API_URL}/rubriques/${id}`)
      await refreshUserData()
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      toast.error("Erreur lors de la suppression")
    }
  }

  // Remplacer la fonction handleModifierRubrique par celle-ci
  const handleModifierRubrique = (id: string | number) => {
    setCurrentRubriqueId(id)
    setIsEditingRubrique(true)
  }

  const handleDownload = async (doc: Document, rubrique: Rubrique) => {
    try {
      const query = new URLSearchParams({
        fileName: doc.nom,
        year: rubrique.declaration?.annee?.toString() ?? activeDeclaration?.annee?.toString() ?? "",
        userId: userDetails?.user_id?.toString() || "",
        rubriqueName: rubrique.titre || rubrique.nom || "",
      })

      console.log("/api/download?" + query.toString())

      const res = await fetch(`/api/download?${query.toString()}`)
      if (!res.ok) throw new Error("Téléchargement échoué")

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = doc.nom
      document.body.appendChild(a)
      a.click()
      a.remove()

      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      toast.error("Erreur lors du téléchargement")
    }
  }

  const handleDeleteDocument = async (doc: Document, rubrique: Rubrique) => {
    try {
      const fileName = doc.nom
      const year = activeDeclaration?.annee
      const rubriqueName = rubrique.titre || rubrique.nom || ""
      const userId = userDetails?.user_id

      if (!fileName || !year || !rubriqueName || !userId) {
        console.warn("Paramètres manquants", {
          fileName,
          year,
          rubriqueName,
          userId,
        })
        toast.error("Paramètres manquants pour la suppression")
        return
      }

      // Supprimer le document de S3
      const res = await fetch(
        `/api/delete?fileName=${encodeURIComponent(
          fileName,
        )}&year=${year}&userId=${userId}&rubriqueName=${encodeURIComponent(rubriqueName)}`,
        {
          method: "DELETE",
        },
      )

      // Supprimer aussi de la BDD Laravel
      // Supprimer aussi de la BDD Laravel
      await fetch(`${API_URL}/documents/${doc.doc_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) throw new Error(await res.text())
      toast.success("Document supprimé")
      await refreshUserData()
    } catch (err) {
      console.error("Erreur de suppression", err)
      toast.error("Erreur lors de la suppression du document")
    }
  }

  const rubriqueMap = Object.fromEntries(
    (activeDeclaration?.rubriques || []).map((r) => [r.rubrique_id, r.titre || r.nom || ""]),
  )

  const handleAdminFilesSelected = (rubriqueId: number, files: File[]) => {
    setAdminSelectedFiles((prev) => [...prev, ...files.map((file) => ({ file, rubriqueId }))])
  }

  const handleAdminFileRemoved = (fileId: string) => {
    setAdminSelectedFiles((prev) => prev.filter((f) => f.file.name + f.file.size !== fileId))
  }

  const uploadAdminDocuments = async () => {
    if (adminSelectedFiles.length === 0) {
      toast.warning("Aucun fichier à enregistrer")
      return
    }

    try {
      for (const { file, rubriqueId } of adminSelectedFiles) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("rubriqueId", rubriqueId.toString())
        formData.append("rubriqueName", rubriqueMap[rubriqueId] || "")
        formData.append("userId", userDetails?.user_id.toString() || "")
        formData.append("year", activeDeclaration?.annee?.toString() || "")

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        if (!uploadRes.ok) throw new Error(`Échec de l'upload pour ${file.name}`)

        const uploaded = await uploadRes.json()
        const extension = uploaded.fileType?.split("/").pop()?.toLowerCase() || "other"

        const payload = {
          documents: [
            {
              rubrique_id: rubriqueId,
              nom: uploaded.fileName,
              type: extension,
              cheminFichier: uploaded.key,
              statut: "pending",
              sous_rubrique: rubriqueMap[rubriqueId] || "",
            },
          ],
        }

        const res = await fetch(`${API_URL}/documents`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (!res.ok) throw new Error("Erreur enregistrement BDD")
      }

      // Créer une notification pour le client
      await axios.post(`${API_URL}/notifications`, {
        user_id: userDetails?.user_id,
        contenu: `Vos documents ont été enregistrés avec succès.`,
      })

      // Envoi de la notification à l'utilisateur (max 1 fois toutes les 10 minutes)
      const now = new Date()
      if (lastNotificationSentAt && now.getTime() - lastNotificationSentAt.getTime() < 10 * 60 * 1000) {
        console.log("Notification déjà envoyée récemment, skip.")
      } else {
        await fetch(`${API_URL}/documents/admin-upload-notification`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userDetails?.user_id,
            title: activeDeclaration?.titre,
            year: activeDeclaration?.annee,
          }),
        })
        setLastNotificationSentAt(now)
      }

      toast.success("Documents enregistrés avec succès")
      setAdminSelectedFiles([])
      const uploadedRubriqueIds = adminSelectedFiles.map((f) => f.rubriqueId)
      setUploadCompletedRubriques((prev) => [...prev, ...uploadedRubriqueIds.filter((id) => !prev.includes(id))])

      await refreshUserData()

      router.refresh()
    } catch (err) {
      console.error(err)
      toast.error("Erreur pendant l'envoi ou l'enregistrement")
    }
  }

  const handleDeleteDocumentSansRubrique = async (doc: Document) => {
    try {
      const fileName = doc.nom
      const year = doc.annee
      const rubriqueName = doc.rubriqueNom || ""
      const userId = userDetails?.user_id

      if (!fileName || !year || !rubriqueName || !userId) {
        toast.error("Paramètres manquants pour la suppression")
        return
      }

      // Supprimer le document de S3
      const res = await fetch(
        `/api/delete?fileName=${encodeURIComponent(
          fileName,
        )}&year=${year}&userId=${userId}&rubriqueName=${encodeURIComponent(rubriqueName)}`,
        { method: "DELETE" },
      )

      // Supprimer aussi de la BDD Laravel
      await fetch(`${API_URL}/documents/${doc.doc_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) throw new Error(await res.text())
      toast.success("Document supprimé")
      await refreshUserData()
    } catch (err) {
      console.error("Erreur de suppression", err)
      toast.error("Erreur lors de la suppression du document")
    }
  }

  // Fonction pour valider la déclaration sans les documents
  const validateDeclarationOnly = async () => {
    if (!pendingDeclarationAction) return

    try {
      const response = await fetch(`${API_URL}/declarations/${pendingDeclarationAction.declarationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          statut: pendingDeclarationAction.status,
          force_validation: true,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.message || "Erreur lors de la mise à jour du statut")
        return
      }

      // Créer une notification pour le client
      await axios.post(`${API_URL}/notifications/declaration-status`, {
        declaration_id: pendingDeclarationAction.declarationId,
        status: pendingDeclarationAction.status,
      })

      toast.success("Déclaration validée avec succès (sans les documents)")

      // Rafraîchir les données
      const fetchResponse = await fetch(`${API_URL}/users/${userId}/full-data`)
      if (fetchResponse.ok) {
        const data = await fetchResponse.json()
        if (data.success) {
          setUserDetails(data.data)

          const updated = data.data.declarations.find(
            (d: Declaration) =>
              d.id === pendingDeclarationAction.declarationId ||
              d.declaration_id === pendingDeclarationAction.declarationId,
          )
          if (updated) {
            setActiveDeclaration(updated)
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors de la validation de la déclaration:", error)
      toast.error("Erreur inattendue lors de la validation")
    } finally {
      setConfirmationDialogOpen(false)
      setPendingDeclarationAction(null)
    }
  }

  const validateDeclarationAndDocuments = async () => {
    if (!pendingDeclarationAction) return

    try {
      // Envoi de la requête PATCH pour valider la déclaration et les documents
      const response = await fetch(
        `${API_URL}/declarations/${pendingDeclarationAction.declarationId}/validateDecEtDoc`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            approve_all_documents: true, // Indiquer qu'on souhaite valider tous les documents
          }),
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.message || "Erreur lors de la validation de la déclaration et des documents")
        return
      }

      // Créer une notification pour le client
      await axios.post(`${API_URL}/notifications/declaration-status`, {
        declaration_id: pendingDeclarationAction.declarationId,
        status: "approved",
        message: "Votre déclaration et tous ses documents ont été validés",
      })

      toast.success("Déclaration et documents validés avec succès")

      // Rafraîchir les données de l'utilisateur
      const fetchResponse = await fetch(`${API_URL}/users/${userId}/full-data`)
      if (fetchResponse.ok) {
        const data = await fetchResponse.json()
        if (data.success) {
          setUserDetails(data.data)

          // Trouver et mettre à jour la déclaration active si nécessaire
          const updated = data.data.declarations.find(
            (d: Declaration) =>
              d.id === pendingDeclarationAction.declarationId ||
              d.declaration_id === pendingDeclarationAction.declarationId,
          )
          if (updated) {
            setActiveDeclaration(updated)
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors de la validation de la déclaration et des documents:", error)
      toast.error("Erreur inattendue lors de la validation")
    } finally {
      // Fermer le dialogue et réinitialiser l'action en attente
      setConfirmationDialogOpen(false)
      setPendingDeclarationAction(null)
    }
  }

  // Fonction pour supprimer une déclaration
  const handleDeleteDeclaration = async (declarationId: number) => {
    const confirmed = window.confirm("Voulez-vous vraiment supprimer cette déclaration ?")
    if (!confirmed) return

    try {
      await axios.delete(`${API_URL}/declarations/${declarationId}`)
      toast.success("Déclaration supprimée avec succès !")
      await refreshUserData()
    } catch (error) {
      console.error("Erreur lors de la suppression de la déclaration:", error)
      toast.error("Erreur lors de la suppression de la déclaration.")
    }
  }

  // Fonction pour gérer la soumission réussie du formulaire
  const handleFormSubmitSuccess = async () => {
    toast.success("Formulaire soumis avec succès")
    await refreshUserData()
    return true
  }

  if (loading || !userId) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto py-4 px-4 sm:py-10 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Chargement des données...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!userDetails) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto py-4 px-4 sm:py-10 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Utilisateur non trouvé</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="bottom-right" richColors closeButton />

      <div className="container mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
        {/* Header responsive */}
        <div className="flex flex-col space-y-4 mb-6 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <Button variant="outline" size="sm" onClick={() => router.push(`/admin/${adminId}`)} className="w-fit">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-xl font-semibold sm:text-2xl">Détails du client</h1>
          </div>
        </div>

        {/* Layout responsive avec sidebar */}
        <div className="flex flex-col space-y-6 lg:flex-row lg:space-y-0 lg:space-x-6">
          {/* Sidebar - Informations client */}
          <div className="w-full lg:w-80 lg:flex-shrink-0">
            <Card className="sticky top-4">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex justify-between items-center">
                  Compte Client
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingUser(!isEditingUser)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditingUser ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
                      <div>
                        <label className="text-sm font-medium">Nom</label>
                        <Input
                          name="nom"
                          value={editedUser?.nom || ""}
                          onChange={(e) => handleInputChange(e)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input
                          name="email"
                          value={editedUser?.email || ""}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Téléphone</label>
                        <Input
                          name="numeroTelephone"
                          value={editedUser?.numeroTelephone || ""}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Adresse</label>
                        <Input
                          name="adresse"
                          value={editedUser?.adresse || ""}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Code Postal</label>
                        <Input
                          name="codePostal"
                          value={editedUser?.codePostal || ""}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Localité</label>
                        <Input
                          name="localite"
                          value={editedUser?.localite || ""}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Statut</label>
                        <select
                          name="statut"
                          value={editedUser?.statut || ""}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                          <option value="approved">Validé</option>
                          <option value="pending">En attente</option>
                          <option value="rejected">Refusé</option>
                          <option value="archived">Archivé</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        name="email"
                        value={editedUser?.email || ""}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Téléphone</label>
                      <Input
                        name="numeroTelephone"
                        value={editedUser?.numeroTelephone || ""}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Adresse</label>
                      <Input
                        name="adresse"
                        value={editedUser?.adresse || ""}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Code Postal</label>
                      <Input
                        name="codePostal"
                        value={editedUser?.codePostal || ""}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Localité</label>
                      <Input
                        name="localite"
                        value={editedUser?.localite || ""}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Statut</label>
                      <select
                        name="statut"
                        value={editedUser?.statut || ""}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-700 sm:text-sm h-10"
                      >
                        <option value="approved">Validé</option>
                        <option value="pending">En attente</option>
                        <option value="rejected">Refusé</option>
                        <option value="archived">Archivé</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={handleUserUpdate}
                        disabled={isSaving}
                        className="w-full"
                      >
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
                      <Button
                        onClick={() => setIsEditingUser(false)}
                        variant="outline"
                        className="w-full"
                        disabled={isSaving}
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-base">{userDetails.nom}</h3>
                      <p className="text-sm text-muted-foreground break-all">{userDetails.email}</p>
                      <p className="text-sm text-muted-foreground">{userDetails.numeroTelephone}</p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium mb-2">Adresse</h4>
                      <p className="text-sm">{userDetails.adresse}</p>
                      <p className="text-sm">
                        {userDetails.codePostal} {userDetails.localite}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium mb-2">Type de client</h4>
                      <Badge variant="outline" className="capitalize">
                        {userDetails.role}
                      </Badge>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium mb-2">Statut</h4>
                      {getStatusBadge(userDetails.statut)}
                    </div>

                    {userDetails.entreprises && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="text-sm font-medium mb-2">Entreprise</h4>
                          <div className="space-y-1">
                            <p className="text-sm">
                              <span className="font-medium">Nom:</span> {userDetails.entreprises.nom}
                            </p>
                            {userDetails.entreprises.raisonSociale && (
                              <p className="text-sm">
                                <span className="font-medium">Raison sociale:</span>{" "}
                                {userDetails.entreprises.raisonSociale}
                              </p>
                            )}
                            {userDetails.entreprises.numeroFiscal && (
                              <p className="text-sm">
                                <span className="font-medium">N° fiscal:</span> {userDetails.entreprises.numeroFiscal}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <Button variant="outline" size="sm" className="w-full">
                            <FileText className="h-4 w-4 mr-2" />
                            Grand Livre
                          </Button>
                        </div>
                      </>
                    )}

                    {userDetails.prives && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="text-sm font-medium mb-2">Informations privées</h4>
                          <div className="space-y-1">
                            <p className="text-sm">
                              <span className="font-medium">Nom:</span> {userDetails.prives.prenom}{" "}
                              {userDetails.prives.nom}
                            </p>
                            {userDetails.prives.dateNaissance && (
                              <p className="text-sm">
                                <span className="font-medium">Né(e) le:</span>{" "}
                                {new Date(userDetails.prives.dateNaissance).toLocaleDateString()}
                              </p>
                            )}
                            {userDetails.prives.nationalite && (
                              <p className="text-sm">
                                <span className="font-medium">Nationalité:</span> {userDetails.prives.nationalite}
                              </p>
                            )}
                            {userDetails.prives.etatCivil && (
                              <p className="text-sm">
                                <span className="font-medium">État civil:</span> {userDetails.prives.etatCivil}
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => setIsEditingUser(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 min-w-0">
            <Tabs defaultValue="declarations" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="declarations" className="text-xs sm:text-sm">
                  Déclarations
                </TabsTrigger>
                <TabsTrigger value="documents" className="text-xs sm:text-sm">
                  Documents
                </TabsTrigger>
                <TabsTrigger value="formulaire" className="text-xs sm:text-sm">
                  Formulaire
                </TabsTrigger>
              </TabsList>

              <CreateDeclarationDialog
                isOpen={openCreateDialog}
                onClose={() => setOpenCreateDialog(false)}
                onDeclarationAdded={refreshUserData}
                userId={userId}
              />

              <TabsContent value="declarations" className="space-y-6">
                <Card>
                  <CardHeader className="space-y-4">
                    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                      <CardTitle className="text-lg">Déclarations</CardTitle>
                      {activeDeclaration && (
                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 border border-gray-300 hover:border-blue-500"
                            onClick={() => setOpenCreateDialog(true)}
                          >
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:inline">Nouvelle déclaration</span>
                            <span className="sm:hidden">Nouvelle</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                            onClick={async () => {
                              await handleDeleteDeclaration(
                                activeDeclaration.declaration_id || activeDeclaration.id || 0,
                              )
                              await refreshUserData()
                              setActiveDeclaration(null)
                            }}
                          >
                            <Trash2 className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Supprimer</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {!userDetails.declarations || userDetails.declarations.length === 0 ? (
                      <div className="text-center py-8">
                        <p>Aucune déclaration trouvée pour ce client.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Sélecteur d'années responsive */}
                        <div className="flex flex-wrap gap-2">
                          {declarationYears.map((year) => {
                            const isActive = activeDeclaration && getYearOfDeclaration(activeDeclaration) === year
                            return (
                              <Button
                                key={year}
                                variant={isActive ? "default" : "outline"}
                                size="sm"
                                className="flex-shrink-0"
                                onClick={() => handleYearChange(year)}
                              >
                                {year}
                              </Button>
                            )
                          })}
                        </div>

                        {/* Montant des impôts responsive */}
                        {activeDeclaration && (
                          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4 p-4 bg-blue-50 rounded-lg">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-blue-900">Montant des impôts</p>
                              <p className="text-lg font-bold text-blue-700">
                                {activeDeclaration.impots || "Non renseigné"}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setIsImpotsDialogOpen(true)
                                setEditedImpots(activeDeclaration?.impots || "")
                              }}
                              className="w-full sm:w-auto"
                            >
                              Modifier
                            </Button>
                          </div>
                        )}

                        {/* Dialogue pour modifier les impôts */}
                        <Dialog open={isImpotsDialogOpen} onOpenChange={setIsImpotsDialogOpen}>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Modifier le montant des impôts</DialogTitle>
                              <DialogDescription>
                                Saisissez le nouveau montant des impôts pour cette déclaration.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <Input
                                type="text"
                                value={editedImpots}
                                onChange={(e) => setEditedImpots(e.target.value)}
                                placeholder="Entrez le montant des impôts"
                                className="w-full"
                              />
                            </div>
                            <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setIsImpotsDialogOpen(false)
                                  setEditedImpots(activeDeclaration?.impots || "")
                                }}
                                className="w-full sm:w-auto"
                              >
                                Annuler
                              </Button>
                              <Button
                                onClick={async () => {
                                  await handleUpdateImpots(activeDeclaration?.declaration_id || 0, editedImpots)
                                  setIsImpotsDialogOpen(false)
                                }}
                                className="w-full sm:w-auto"
                              >
                                Enregistrer
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {activeDeclaration && (
                          <div className="space-y-4">
                            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                              <h3 className="text-lg font-medium">
                                {activeDeclaration.titre ||
                                  `Déclaration ${
                                    activeDeclaration.annee ||
                                    new Date(
                                      activeDeclaration.dateCreation || activeDeclaration.dateSoumission || "",
                                    ).getFullYear()
                                  }`}
                              </h3>
                              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
                                {getStatusBadge(activeDeclaration.statut)}
                                <div className="flex space-x-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200 flex-1 sm:flex-none"
                                    onClick={() =>
                                      handleDeclarationStatusChange(
                                        activeDeclaration.declaration_id || activeDeclaration.id || 0,
                                        "approved",
                                      )
                                    }
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    <span className="hidden sm:inline">Valider</span>
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200 flex-1 sm:flex-none"
                                    onClick={() =>
                                      handleDeclarationStatusChange(
                                        activeDeclaration.declaration_id || activeDeclaration.id || 0,
                                        "pending",
                                      )
                                    }
                                  >
                                    <AlertTriangle className="h-4 w-4 mr-1" />
                                    <span className="hidden sm:inline">En attente</span>
                                  </Button>
                                </div>
                              </div>
                            </div>

                            <Separator />

                            <Accordion type="multiple" className="w-full">
                              {activeDeclaration.rubriques?.map((rubrique) => (
                                <AccordionItem
                                  key={rubrique.rubrique_id || rubrique.id}
                                  value={`rubrique-${rubrique.rubrique_id || rubrique.id}`}
                                >
                                  <div className="flex flex-col space-y-2 sm:flex-row sm:items-center">
                                    <AccordionTrigger className="flex-1 text-left">
                                      <span className="text-base font-medium truncate">
                                        {rubrique.titre || rubrique.nom}
                                      </span>
                                    </AccordionTrigger>
                                    <div className="flex space-x-2 sm:px-4 sm:justify-end justify-start">
                                      <Button
                                        className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 text-xs px-2 py-1"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleModifierRubrique(rubrique.rubrique_id)}
                                      >
                                        Modifier
                                      </Button>
                                      <Button
                                        className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200 text-xs px-2 py-1"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDeleteRubrique(rubrique.rubrique_id)}
                                      >
                                        Supprimer
                                      </Button>
                                    </div>
                                  </div>

                                  <AccordionContent>
                                    <div className="space-y-6">
                                      {/* Documents de la rubrique */}
                                      {rubrique.documents && rubrique.documents.length > 0 ? (
                                        <div className="mb-4">
                                          <h4 className="text-sm font-medium mb-2">Documents</h4>
                                          {/* Table responsive avec scroll horizontal sur mobile */}
                                          <div className="overflow-x-auto">
                                            <Table className="min-w-full">
                                              <TableHeader>
                                                <TableRow>
                                                  <TableHead className="min-w-[120px]">Nom</TableHead>
                                                  <TableHead className="min-w-[100px]">Statut</TableHead>
                                                  <TableHead className="min-w-[100px]">Date</TableHead>
                                                  <TableHead className="text-right min-w-[200px]">Actions</TableHead>
                                                </TableRow>
                                              </TableHeader>
                                              <TableBody>
                                                {rubrique.documents.map((doc, index) => (
                                                  <TableRow key={`rubrique-doc-${doc.doc_id || "unknown"}-${index}`}>
                                                    <TableCell className="font-medium">
                                                      <div className="truncate max-w-[120px]" title={doc.nom}>
                                                        {doc.nom}
                                                      </div>
                                                    </TableCell>
                                                    <TableCell>{getStatusBadge(doc.statut)}</TableCell>
                                                    <TableCell className="text-sm">
                                                      {new Date(
                                                        doc.dateCreation || doc.dateUpload || "",
                                                      ).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                      <div className="flex justify-end gap-1 flex-wrap">
                                                        <Button
                                                          variant="ghost"
                                                          size="icon"
                                                          onClick={() => handleDownload(doc, rubrique)}
                                                          title="Télécharger"
                                                        >
                                                          <Download className="h-4 w-4" />
                                                        </Button>

                                                        <Button
                                                          variant="ghost"
                                                          size="icon"
                                                          onClick={() => handleDeleteDocument(doc, rubrique)}
                                                          title="Supprimer le document"
                                                        >
                                                          <Trash2 className="h-4 w-4" />
                                                        </Button>

                                                        <Dialog>
                                                          <DialogTrigger asChild>
                                                            <Button
                                                              variant="ghost"
                                                              size="icon"
                                                              title="Ajouter un commentaire"
                                                            >
                                                              <MessageSquare className="h-4 w-4" />
                                                            </Button>
                                                          </DialogTrigger>
                                                          <DialogContent className="sm:max-w-md">
                                                            <DialogHeader>
                                                              <DialogTitle>Ajouter un commentaire</DialogTitle>
                                                              <DialogDescription>Document: {doc.nom}</DialogDescription>
                                                            </DialogHeader>
                                                            <div className="py-4">
                                                              {doc.commentaire && (
                                                                <div className="mb-4 p-3 bg-muted rounded-md">
                                                                  <p className="text-sm font-medium mb-1">
                                                                    Commentaire actuel:
                                                                  </p>
                                                                  <p className="text-sm">{doc.commentaire}</p>
                                                                </div>
                                                              )}
                                                              <Textarea
                                                                placeholder="Saisissez votre commentaire ici..."
                                                                value={commentaire}
                                                                onChange={(e) => setCommentaire(e.target.value)}
                                                                className="min-h-[100px] w-full"
                                                              />
                                                            </div>
                                                            <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0">
                                                              <Button
                                                                onClick={() => handleAddComment(doc.doc_id)}
                                                                disabled={!commentaire.trim()}
                                                                className="w-full sm:w-auto"
                                                              >
                                                                Enregistrer
                                                              </Button>
                                                            </DialogFooter>
                                                          </DialogContent>
                                                        </Dialog>

                                                        <Button
                                                          variant="ghost"
                                                          size="icon"
                                                          onClick={() =>
                                                            handleDocumentStatusChange(doc.doc_id, "approved")
                                                          }
                                                          title="Valider le document"
                                                        >
                                                          <CheckCircle className="h-4 w-4" />
                                                        </Button>

                                                        <Button
                                                          variant="ghost"
                                                          size="icon"
                                                          onClick={() =>
                                                            handleDocumentStatusChange(doc.doc_id, "rejected")
                                                          }
                                                          title="Refuser le document"
                                                        >
                                                          <XCircle className="h-4 w-4" />
                                                        </Button>

                                                        <Button
                                                          variant="ghost"
                                                          size="icon"
                                                          onClick={() =>
                                                            handleDocumentStatusChange(doc.doc_id, "pending")
                                                          }
                                                          title="Mettre en attente"
                                                        >
                                                          <AlertTriangle className="h-4 w-4" />
                                                        </Button>
                                                      </div>
                                                    </TableCell>
                                                  </TableRow>
                                                ))}
                                              </TableBody>
                                            </Table>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="text-center py-4">
                                          <p className="text-muted-foreground">Aucun document pour cette rubrique</p>
                                        </div>
                                      )}
                                      <DocumentUpload
                                        key={`rubrique-${
                                          rubrique.rubrique_id
                                        }-upload-${uploadCompletedRubriques.includes(rubrique.rubrique_id)}`}
                                        rubriqueId={rubrique.rubrique_id}
                                        rubriqueName={rubrique.titre}
                                        userId={userDetails.user_id}
                                        year={activeDeclaration?.annee?.toString() || ""}
                                        hideExistingList={true}
                                        onFilesSelected={(files) =>
                                          handleAdminFilesSelected(rubrique.rubrique_id, files)
                                        }
                                        onFileRemoved={handleAdminFileRemoved}
                                      />
                                      {adminSelectedFiles.some((f) => f.rubriqueId === rubrique.rubrique_id) && (
                                        <Button
                                          onClick={uploadAdminDocuments}
                                          className="mt-2 w-full sm:w-auto"
                                          variant="default"
                                        >
                                          Valider l&apos;envoi
                                        </Button>
                                      )}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsAddingRubrique(true)}
                              className="flex items-center gap-2 border border-gray-300 hover:border-blue-500 w-full sm:w-auto"
                            >
                              <Plus className="h-4 w-4" />
                              Ajouter une rubrique
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tous les documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!userDetails.declarations || userDetails.declarations.length === 0 ? (
                      <div className="text-center py-8">
                        <p>Aucun document trouvé pour ce client.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Input
                          type="search"
                          placeholder="Rechercher un document..."
                          className="w-full"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        {/* Table responsive avec scroll horizontal */}
                        <div className="overflow-x-auto">
                          <Table className="min-w-full">
                            <TableHeader>
                              <TableRow>
                                <TableHead className="min-w-[150px]">Nom</TableHead>
                                <TableHead className="min-w-[120px]">Rubrique</TableHead>
                                <TableHead className="min-w-[100px]">Statut</TableHead>
                                <TableHead className="min-w-[100px]">Date</TableHead>
                                <TableHead className="text-right min-w-[200px]">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredDocuments.map((doc, index) => (
                                <TableRow key={`doc-${doc.doc_id || "unknown"}-${index}`}>
                                  <TableCell className="font-medium">
                                    <div className="truncate max-w-[150px]" title={doc.nom}>
                                      {doc.nom}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="space-y-1">
                                      <div className="truncate max-w-[120px]" title={doc.rubriqueNom}>
                                        {doc.rubriqueNom}
                                      </div>
                                      {doc.sous_rubrique && (
                                        <span className="text-muted-foreground text-xs">/ {doc.sous_rubrique}</span>
                                      )}
                                      <div className="text-xs text-muted-foreground">Année {doc.annee}</div>
                                    </div>
                                  </TableCell>
                                  <TableCell>{getStatusBadge(doc.statut)}</TableCell>
                                  <TableCell className="text-sm">
                                    {new Date(doc.dateCreation || doc.dateUpload || "").toLocaleDateString()}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-1 flex-wrap">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                          if (doc.rubrique) {
                                            handleDownload(doc, doc.rubrique)
                                          } else {
                                            toast.error("Rubrique introuvable pour ce document")
                                          }
                                        }}
                                        title="Télécharger"
                                      >
                                        <Download className="h-4 w-4" />
                                      </Button>

                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteDocumentSansRubrique(doc)}
                                        title="Supprimer le document"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>

                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button variant="ghost" size="icon" title="Ajouter un commentaire">
                                            <MessageSquare className="h-4 w-4" />
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                          <DialogHeader>
                                            <DialogTitle>Ajouter un commentaire</DialogTitle>
                                            <DialogDescription>Document: {doc.nom}</DialogDescription>
                                          </DialogHeader>
                                          <div className="py-4">
                                            {doc.commentaire && (
                                              <div className="mb-4 p-3 bg-muted rounded-md">
                                                <p className="text-sm font-medium mb-1">Commentaire actuel:</p>
                                                <p className="text-sm">{doc.commentaire}</p>
                                              </div>
                                            )}
                                            <Textarea
                                              placeholder="Saisissez votre commentaire ici..."
                                              value={commentaire}
                                              onChange={(e) => setCommentaire(e.target.value)}
                                              className="min-h-[100px]"
                                            />
                                          </div>
                                          <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0">
                                            <Button
                                              onClick={() => {
                                                handleAddComment(doc.doc_id)
                                              }}
                                              disabled={!commentaire.trim()}
                                              className="w-full sm:w-auto"
                                            >
                                              Enregistrer
                                            </Button>
                                          </DialogFooter>
                                        </DialogContent>
                                      </Dialog>

                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDocumentStatusChange(doc.doc_id, "approved")}
                                        title="Valider le document"
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                      </Button>

                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDocumentStatusChange(doc.doc_id, "rejected")}
                                        title="Refuser le document"
                                      >
                                        <XCircle className="h-4 w-4" />
                                      </Button>

                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDocumentStatusChange(doc.doc_id, "pending")}
                                        title="Mettre en attente"
                                      >
                                        <AlertTriangle className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="formulaire">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Formulaire de {userDetails.nom}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userDetails.user_id ? (
                      <FormulairePrive userId={userDetails.user_id} onSubmitSuccess={handleFormSubmitSuccess} />
                    ) : (
                      <div className="text-center py-8">
                        <p>Ce client n&apos;a pas de profil privé associé.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddRubriqueDialog
        isOpen={isAddingRubrique || isEditingRubrique}
        onClose={() => {
          if (isAddingRubrique) setIsAddingRubrique(false)
          if (isEditingRubrique) setIsEditingRubrique(false)
        }}
        declarationId={activeDeclaration?.declaration_id || activeDeclaration?.id}
        declarationTitle={activeDeclaration?.titre}
        onRubriqueAdded={refreshUserData}
        userId={userId}
        isEditing={isEditingRubrique}
        rubriqueId={isEditingRubrique ? currentRubriqueId : undefined}
      />
      <ConfirmationDialog
        open={confirmationDialogOpen}
        setOpen={setConfirmationDialogOpen}
        documentsNonValides={documentsNonValides}
        validateDeclarationOnly={validateDeclarationOnly}
        validateDeclarationAndDocuments={validateDeclarationAndDocuments}
        setPendingDeclarationAction={setPendingDeclarationAction}
      />
    </div>
  )
}
