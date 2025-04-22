"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
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
} from "lucide-react"
import ProtectedRouteAdmin from "@/components/routes/ProtectedRouteAdmin"
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
  type: string
  cheminFichier: string
  statut: "pending" | "rejected" | "approved"
  sous_rubrique?: string | null
  dateCreation: string
  // Propriétés supplémentaires pour la compatibilité avec le code existant
  chemin?: string // Alias pour cheminFichier
  dateUpload?: string // Alias pour dateCreation
  commentaire?: string // Ajouté pour les commentaires
  taille?: number // Conservé pour la compatibilité
  // Propriétés calculées pour l'affichage
  rubriqueNom?: string
  annee?: number | string
}

// Mettre à jour l'interface Rubrique pour correspondre à la structure de la table
interface Rubrique {
  rubrique_id: number
  declaration_id: number
  titre: string
  description: string
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

  // Fonction pour rafraîchir les données utilisateur
  const refreshUserData = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}/full-data`)
      const data = response.data

      if (data.success) {
        setUserDetails(data.data)

        // Mettre à jour la déclaration active si nécessaire
        if (activeDeclaration && data.data.declarations) {
          const updatedActiveDeclaration = data.data.declarations.find(
            (d: Declaration) => d.id === activeDeclaration.id || d.declaration_id === activeDeclaration.declaration_id,
          )
          if (updatedActiveDeclaration) {
            setActiveDeclaration(updatedActiveDeclaration)
          }
        }
      } else {
        toast.error(data.message || "Erreur lors du rechargement des données")
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

        setUserDetails(data.data)
        setEditedUser(data.data)

        // Extraire les années des déclarations
        if (data.data.declarations && data.data.declarations.length > 0) {
          const years = data.data.declarations.map((d: Declaration) =>
            d.annee ? d.annee.toString() : new Date(d.dateCreation || d.dateSoumission || "").getFullYear().toString(),
          )
          setDeclarationYears(Array.from(new Set(years))) // Éliminer les doublons
          setActiveDeclaration(data.data.declarations[0])
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
    const token = localStorage.getItem("auth_token");
  
    if (!token) {
      console.error("Token manquant !");
      return null;
    }
  
    try {
      const response = await axios.get(`${API_URL}/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.admin_id
    } catch (error) {
      console.error("Erreur lors de la récupération de l'admin :", error);
    }
  };

  // Effet pour récupérer l'ID administrateur depuis les paramètres d'URL
  useEffect(() => {
    fetchAdminID()
      .then((id) => {
        if (id !== null) {
          setAdminId(Number(id));
        }
      })
      .catch((err) => {
        console.error("Impossible de récupérer l'admin_id :", err);
      });
  }, []);

  // Remplacer la fonction handleYearChange par celle-ci pour corriger le problème de sélection des années
  const handleYearChange = (year: string) => {
    if (userDetails?.declarations) {
      const selected = userDetails.declarations.find((d) => {
        const dYear =
          d.annee?.toString() ??
          new Date(d.dateCreation || d.dateSoumission || "").getFullYear().toString();
        return dYear === year;
      });
  
      if (selected) {
        setActiveDeclaration(selected);
      }
    }
  };

  const getYearOfDeclaration = (d:Declaration) => {
    if (d.annee != null) {
      return d.annee.toString();
    }
    const date = d.dateCreation || d.dateSoumission;
    return date ? new Date(date).getFullYear().toString() : "";
  }

  const handleUserUpdate = async () => {
    if (!editedUser) return

    setIsSaving(true)
    try {
      // 1. Mettre à jour les informations de l'utilisateur
      await axios.put(`${API_URL}/users/${userId}`, editedUser)

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedUser((prev: any) => ({
      ...prev,
      [name]: value,
    }))
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "validé":
        return <Badge className="bg-green-100 text-green-800">Validé</Badge>
      case "pending":
      case "en_attente":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
      case "rejected":
      case "refusé":
        return <Badge className="bg-red-100 text-red-800">Refusé</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status || "Inconnu"}</Badge>
    }
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

  const handleDownloadDocument = (documentPath: string, documentName: string) => {
    // Dans un environnement réel, vous devriez vérifier si le chemin est complet ou relatif
    const downloadUrl = documentPath.startsWith("http")
      ? documentPath
      : `${API_URL}/documents/download?path=${encodeURIComponent(documentPath)}`

    // Créer un élément a temporaire pour déclencher le téléchargement
    const link = document.createElement("a")
    link.href = downloadUrl
    link.download = documentName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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

  // Fonction pour valider la déclaration et tous les documents
  const validateDeclarationAndDocuments = async () => {
    if (!pendingDeclarationAction) return

    try {
      // Envoi de la requête PATCH pour valider la déclaration et les documents
      const response = await fetch(`${API_URL}/declarations/${pendingDeclarationAction.declarationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          statut: pendingDeclarationAction.status,
          approve_all_documents: true, // Indiquer qu'on souhaite valider tous les documents
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.message || "Erreur lors de la mise à jour du statut")
        return
      }

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

  if (loading || !userId) {
    return (
      <ProtectedRouteAdmin>
        <div className="container mx-auto py-10 px-4">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Chargement des données...</span>
          </div>
        </div>
      </ProtectedRouteAdmin>
    )
  }

  if (!userDetails) {
    return (
      <ProtectedRouteAdmin>
        <div className="container mx-auto py-10 px-4">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Utilisateur non trouvé</p>
          </div>
        </div>
      </ProtectedRouteAdmin>
    )
  }

  return (
    <ProtectedRouteAdmin>
      <Toaster position="bottom-right" richColors closeButton />

      <div className="container mx-auto py-10 px-4">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="sm" onClick={() => router.push(`/admin/${params.adminId}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-semibold">Détails du client</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar avec informations client */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex justify-between items-center">
                  Compte Client
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingUser(!isEditingUser)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditingUser ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Nom</label>
                      <Input name="nom" value={editedUser?.nom || ""} onChange={handleInputChange} className="mt-1" />
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
                    <Button onClick={handleUserUpdate} disabled={isSaving} className="w-full">
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
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">{userDetails.nom}</h3>
                      <p className="text-sm text-muted-foreground">{userDetails.email}</p>
                      <p className="text-sm text-muted-foreground">{userDetails.numeroTelephone}</p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium mb-1">Adresse</h4>
                      <p className="text-sm">{userDetails.adresse}</p>
                      <p className="text-sm">
                        {userDetails.codePostal} {userDetails.localite}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium mb-1">Type de client</h4>
                      <Badge variant="outline" className="capitalize">
                        {userDetails.role}
                      </Badge>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium mb-1">Statut</h4>
                      {getStatusBadge(userDetails.statut)}
                    </div>

                    {userDetails.entreprises && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="text-sm font-medium mb-1">Entreprise</h4>
                          <p className="text-sm">Nom: {userDetails.entreprises.nom}</p>
                          {userDetails.entreprises.raisonSociale && (
                            <p className="text-sm">Raison sociale: {userDetails.entreprises.raisonSociale}</p>
                          )}
                          {userDetails.entreprises.numeroFiscal && (
                            <p className="text-sm">N° fiscal: {userDetails.entreprises.numeroFiscal}</p>
                          )}
                        </div>

                        <div className="pt-2">
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
                          <h4 className="text-sm font-medium mb-1">Informations privées</h4>
                          <p className="text-sm">
                            Nom: {userDetails.prives.prenom} {userDetails.prives.nom}
                          </p>
                          {userDetails.prives.dateNaissance && (
                            <p className="text-sm">
                              Né(e) le: {new Date(userDetails.prives.dateNaissance).toLocaleDateString()}
                            </p>
                          )}
                          {userDetails.prives.nationalite && (
                            <p className="text-sm">Nationalité: {userDetails.prives.nationalite}</p>
                          )}
                          {userDetails.prives.etatCivil && (
                            <p className="text-sm">État civil: {userDetails.prives.etatCivil}</p>
                          )}
                        </div>
                      </>
                    )}

                    <div className="pt-2">
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
          <div className="md:col-span-3">
            <Tabs defaultValue="declarations">
              <TabsList className="mb-6">
                <TabsTrigger value="declarations">Déclarations</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="declarations">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Déclarations</CardTitle>
                    {activeDeclaration && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsAddingRubrique(true)}
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-4 w-4" />
                        Ajouter une rubrique
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {!userDetails.declarations || userDetails.declarations.length === 0 ? (
                      <div className="text-center py-8">
                        <p>Aucune déclaration trouvée pour ce client.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Remplacer la partie du rendu des boutons d'années (vers la ligne 870) par celle-ci */}
                        <div className="flex flex-wrap gap-2">
                          {declarationYears.map((year) => {
                            // Déterminer si ce bouton correspond à l'année active
                            const isActive =
                            activeDeclaration &&
                            getYearOfDeclaration(activeDeclaration) === year;

                            return (
                              <Button
                                key={year}
                                variant={isActive ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleYearChange(year)}
                              >
                                {year}
                              </Button>
                            )
                          })}
                        </div>

                        {activeDeclaration && (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-medium">
                                {activeDeclaration.titre ||
                                  `Déclaration ${
                                    activeDeclaration.annee ||
                                    new Date(
                                      activeDeclaration.dateCreation || activeDeclaration.dateSoumission || "",
                                    ).getFullYear()
                                  }`}
                              </h3>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(activeDeclaration.statut)}
                                <div className="flex gap-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                                    onClick={() =>
                                      handleDeclarationStatusChange(
                                        activeDeclaration.declaration_id || activeDeclaration.id || 0,
                                        "approved",
                                      )
                                    }
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Valider
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200"
                                    onClick={() =>
                                      handleDeclarationStatusChange(
                                        activeDeclaration.declaration_id || activeDeclaration.id || 0,
                                        "pending",
                                      )
                                    }
                                  >
                                    <AlertTriangle className="h-4 w-4 mr-1" />
                                    En attente
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                                    onClick={() =>
                                      handleDeclarationStatusChange(
                                        activeDeclaration.declaration_id || activeDeclaration.id || 0,
                                        "rejected",
                                      )
                                    }
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Refuser
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
                                  <div className="flex items-center justify-between">
                                    <AccordionTrigger className="text-xl font-medium flex-1">
                                      {rubrique.titre || rubrique.nom}
                                    </AccordionTrigger>
                                    <div className="flex gap-2 pr-4">
                                      <Button
                                        className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleModifierRubrique(rubrique.rubrique_id)}
                                      >
                                        Modifier
                                      </Button>
                                      <Button
                                        className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
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
                                          <Table>
                                            <TableHeader>
                                              <TableRow>
                                                <TableHead>Nom</TableHead>
                                                <TableHead>Statut</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                              </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                              {rubrique.documents.map((doc, index) => (
                                                <TableRow key={`rubrique-doc-${doc.doc_id || "unknown"}-${index}`}>
                                                  <TableCell>{doc.nom}</TableCell>
                                                  <TableCell>{getStatusBadge(doc.statut)}</TableCell>
                                                  <TableCell>
                                                    {new Date(
                                                      doc.dateCreation || doc.dateUpload || "",
                                                    ).toLocaleDateString()}
                                                  </TableCell>
                                                  <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                      <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                          handleDownloadDocument(
                                                            doc.cheminFichier || doc.chemin || "",
                                                            doc.nom,
                                                          )
                                                        }
                                                      >
                                                        <Download className="h-4 w-4" />
                                                      </Button>

                                                      <Dialog>
                                                        <DialogTrigger asChild>
                                                          <Button variant="ghost" size="icon">
                                                            <MessageSquare className="h-4 w-4" />
                                                          </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
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
                                                          <DialogFooter>
                                                            <Button
                                                              onClick={() => handleAddComment(doc.doc_id)}
                                                              disabled={!commentaire.trim()}
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
                                      ) : (
                                        <div className="text-center py-4">
                                          <p className="text-muted-foreground">Aucun document pour cette rubrique</p>
                                        </div>
                                      )}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents">
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
                      <div>
                        <Input
                          type="search"
                          placeholder="Rechercher un document..."
                          className="mb-4"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nom</TableHead>
                              <TableHead>Rubrique</TableHead>
                              <TableHead>Statut</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredDocuments.map((doc, index) => (
                              <TableRow key={`doc-${doc.doc_id || "unknown"}-${index}`}>
                                <TableCell>{doc.nom}</TableCell>
                                <TableCell>
                                  {doc.rubriqueNom}
                                  {doc.sous_rubrique && (
                                    <span className="text-muted-foreground"> / {doc.sous_rubrique}</span>
                                  )}
                                  <div className="text-xs text-muted-foreground">Année {doc.annee}</div>
                                </TableCell>
                                <TableCell>{getStatusBadge(doc.statut)}</TableCell>
                                <TableCell>
                                  {new Date(doc.dateCreation || doc.dateUpload || "").toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        handleDownloadDocument(doc.cheminFichier || doc.chemin || "", doc.nom)
                                      }
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>

                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                          <MessageSquare className="h-4 w-4" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
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
                                        <DialogFooter>
                                          <Button
                                            onClick={() => {
                                              handleAddComment(doc.doc_id)
                                            }}
                                            disabled={!commentaire.trim()}
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
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Utilisation du composant AddRubriqueDialog */}
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
    </ProtectedRouteAdmin>
  )


}
