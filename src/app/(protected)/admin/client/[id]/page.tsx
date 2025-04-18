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
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  AlertTriangle,
  XCircle,
  Save,
  Loader2,
} from "lucide-react"
import ProtectedRouteAdmin from "@/components/ProtectedRouteAdmin"
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

interface Document {
  id: number
  nom: string
  chemin: string
  type: string
  taille: number
  statut: string
  dateUpload: string
  commentaire?: string
}

interface SousRubrique {
  id: number
  nom: string
  description: string
  documents?: Document[]
}

interface Rubrique {
  id: number
  rubrique_id?: number
  nom: string
  titre?: string
  description: string
  documents?: Document[]
  sousRubriques?: SousRubrique[]
}

interface Declaration {
  id: number
  declaration_id?: number
  titre: string
  annee?: number | string
  dateSoumission: string
  statut: string
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
  const [expandedRubriques, setExpandedRubriques] = useState<Record<number, boolean>>({})
  const [expandedSousRubriques, setExpandedSousRubriques] = useState<Record<number, boolean>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredDocuments, setFilteredDocuments] = useState<any[]>([])
  const [declarationYears, setDeclarationYears] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isEditingUser, setIsEditingUser] = useState<boolean>(false)
  const [editedUser, setEditedUser] = useState<any>(null)
  // Ajouter un état pour stocker l'ID de l'administrateur
  const [adminId, setAdminId] = useState<number | null>(null)
  

  // Fonction pour basculer l'état d'une sous-rubrique
  const toggleSousRubrique = (sousRubriqueId: number) => {
    setExpandedSousRubriques((prevState) => ({
      ...prevState,
      [sousRubriqueId]: !prevState[sousRubriqueId],
    }))
  }


  // Supprimer la partie qui utilise sessionStorage car nous utilisons maintenant directement l'API
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true)
        // Utiliser la nouvelle route API pour récupérer les données complètes
        const response = await fetch(`${API_URL}/users/${userId}/full-data`)
        if (!response.ok) {
          throw new Error(`Erreur HTTP ! Statut : ${response.status}`)
        }
        const data = await response.json()

        if (!data.success) {
          throw new Error(data.message || "Erreur lors de la récupération des données")
        }

        setUserDetails(data.data) // Stockez les détails dans l'état local
        setEditedUser(data.data)

        // Extraire les années des déclarations
        if (data.data.declarations && data.data.declarations.length > 0) {
          const years = data.data.declarations.map((d: Declaration) =>
            d.annee ? d.annee.toString() : new Date(d.dateSoumission).getFullYear().toString(),
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
        declaration.rubriques?.flatMap((rubrique) => [
          ...(rubrique.documents || []).map((doc) => ({
            ...doc,
            rubriqueNom: rubrique.nom || rubrique.titre,
            sousRubriqueNom: null,
            declarationId: declaration.id || declaration.declaration_id,
            annee: declaration.annee || new Date(declaration.dateSoumission).getFullYear(),
          })),
          ...(rubrique.sousRubriques || []).flatMap((sousRubrique) =>
            (sousRubrique.documents || []).map((doc) => ({
              ...doc,
              rubriqueNom: rubrique.nom || rubrique.titre,
              sousRubriqueNom: sousRubrique.nom,
              declarationId: declaration.id || declaration.declaration_id,
              annee: declaration.annee || new Date(declaration.dateSoumission).getFullYear(),
            })),
          ),
        ]) || [],
    )

    if (!searchTerm.trim()) {
      setFilteredDocuments(allDocuments)
      return
    }

    const filtered = allDocuments.filter(
      (doc) =>
        doc.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.rubriqueNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.sousRubriqueNom && doc.sousRubriqueNom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        doc.statut.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    setFilteredDocuments(filtered)
  }, [searchTerm, userDetails])

  // Fonction pour récupérer l'ID administrateur
  const fetchAdminId = async () => {
    try {
      const response = await fetch(`${API_URL}/users/admin`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Remplacez par votre méthode d'authentification
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération de l'ID administrateur");
      }

      const data = await response.json();
      if (data.success) {
        console.log("Admin ID:", data.admin_id);
        setAdminId(data.admin_id); // Stocke l'ID administrateur dans l'état local
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Impossible de récupérer l'ID administrateur");
    }
  };


  // Modifier la fonction handleDocumentStatusChange pour recharger les données avec la nouvelle route
  const handleDocumentStatusChange = async (documentId: number, newStatus: string) => {
    try {
      const response = await fetch(`${API_URL}/documents/${documentId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ statut: newStatus }),
      })

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

      toast.success(`Statut du document mis à jour avec succès`)

      // Mettre à jour l'état local en utilisant la nouvelle route
      const fetchResponse = await fetch(`${API_URL}/users/${userId}/full-data`)
      if (fetchResponse.ok) {
        const data = await fetchResponse.json()
        if (data.success) {
          setUserDetails(data.data)

          // Mettre à jour la déclaration active si nécessaire
          if (activeDeclaration && data.data.declarations) {
            const updatedActiveDeclaration = data.data.declarations.find(
              (d: Declaration) =>
                d.id === activeDeclaration.id || d.declaration_id === activeDeclaration.declaration_id,
            )
            if (updatedActiveDeclaration) {
              setActiveDeclaration(updatedActiveDeclaration)
            }
          }
        } else {
          toast.error(data.message || "Erreur lors du rechargement des données")
        }
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut du document:", error)
      toast.error("Erreur lors de la mise à jour du statut du document")
    }
  }

  // Modifier la fonction handleDeclarationStatusChange pour recharger les données avec la nouvelle route
  const handleDeclarationStatusChange = async (declarationId: number, newStatus: string) => {
    try {
      const response = await fetch(`${API_URL}/declarations/${declarationId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ statut: newStatus }),
      })

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

      toast.success(`Statut de la déclaration mis à jour avec succès`)

      // Mettre à jour l'état local en utilisant la nouvelle route
      const fetchResponse = await fetch(`${API_URL}/users/${userId}/full-data`)
      if (fetchResponse.ok) {
        const data = await fetchResponse.json()
        if (data.success) {
          setUserDetails(data.data)

          // Mettre à jour la déclaration active
          if (activeDeclaration && data.data.declarations) {
            const updatedActiveDeclaration = data.data.declarations.find(
              (d: Declaration) =>
                d.id === activeDeclaration.id || d.declaration_id === activeDeclaration.declaration_id,
            )
            if (updatedActiveDeclaration) {
              setActiveDeclaration(updatedActiveDeclaration)
            }
          }
        } else {
          toast.error(data.message || "Erreur lors du rechargement des données")
        }
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut de la déclaration:", error)
      toast.error("Erreur lors de la mise à jour du statut de la déclaration")
    }
  }

  // Fonction pour ajouter un commentaire
  const handleAddComment = async (documentId: number) => {
    if (!commentaire.trim()) {
      toast.error("Veuillez saisir un commentaire");
      return;
    }

    if (!adminId) {
      toast.error("ID administrateur non trouvé. Veuillez vous reconnecter à la page d'administration.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/commentaires`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          document_id: documentId,
          admin_id: adminId,
          contenu: commentaire,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      toast.success("Commentaire ajouté avec succès");
      setCommentaire(""); // Réinitialise le champ de commentaire
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
      toast.error("Erreur lors de l'ajout du commentaire");
    }
  };


  // Effet pour récupérer l'ID administrateur au chargement de la page
  useEffect(() => {
    fetchAdminId();
  }, []);

  const handleYearChange = (year: string) => {
    if (userDetails && userDetails.declarations) {
      const selected = userDetails.declarations.find(
        (d) => d.annee?.toString() === year || new Date(d.dateSoumission).getFullYear().toString() === year,
      )
      if (selected) {
        setActiveDeclaration(selected)
      }
    }
  }

  const handleUserUpdate = async () => {
    if (!editedUser) return

    setIsSaving(true)
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedUser),
      })

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

      const updatedUser = await response.json()
      setUserDetails(updatedUser)
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
          <Button variant="outline" size="sm" onClick={() => router.push("/admin")}>
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
                      <Input name="nom" value={editedUser.nom} onChange={handleInputChange} className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input name="email" value={editedUser.email} onChange={handleInputChange} className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Téléphone</label>
                      <Input
                        name="numeroTelephone"
                        value={editedUser.numeroTelephone}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Adresse</label>
                      <Input name="adresse" value={editedUser.adresse} onChange={handleInputChange} className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Code Postal</label>
                      <Input
                        name="codePostal"
                        value={editedUser.codePostal}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Localité</label>
                      <Input
                        name="localite"
                        value={editedUser.localite}
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
                  <CardHeader>
                    <CardTitle className="text-lg">Déclarations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!userDetails.declarations || userDetails.declarations.length === 0 ? (
                      <div className="text-center py-8">
                        <p>Aucune déclaration trouvée pour ce client.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex flex-wrap gap-2">
                          {declarationYears.map((year) => (
                            <Button
                              key={year}
                              variant={
                                activeDeclaration?.annee?.toString() === year ||
                                new Date(activeDeclaration?.dateSoumission || "").getFullYear().toString() === year
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => handleYearChange(year)}
                            >
                              {year}
                            </Button>
                          ))}
                        </div>

                        {activeDeclaration && (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-medium">
                                {activeDeclaration.titre ||
                                  `Déclaration ${activeDeclaration.annee || new Date(activeDeclaration.dateSoumission).getFullYear()}`}
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
                                        activeDeclaration.id || activeDeclaration.declaration_id || 0,
                                        "validé",
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
                                        activeDeclaration.id || activeDeclaration.declaration_id || 0,
                                        "en_attente",
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
                                        activeDeclaration.id || activeDeclaration.declaration_id || 0,
                                        "refusé",
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
                                  key={rubrique.id || rubrique.rubrique_id}
                                  value={`rubrique-${rubrique.id || rubrique.rubrique_id}`}
                                >
                                  <AccordionTrigger className="text-xl font-medium">
                                    {rubrique.titre || rubrique.nom}
                                  </AccordionTrigger>
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
                                                <TableRow key={`rubrique-doc-${doc.id || "unknown"}-${index}`}>
                                                  <TableCell>{doc.nom}</TableCell>
                                                  <TableCell>{getStatusBadge(doc.statut)}</TableCell>
                                                  <TableCell>{new Date(doc.dateUpload).toLocaleDateString()}</TableCell>
                                                  <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                      <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDownloadDocument(doc.chemin, doc.nom)}
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
                                                              className="min-h-[100px]"
                                                            />
                                                          </div>
                                                          <DialogFooter>
                                                            <Button
                                                              onClick={() => handleAddComment(doc.id)}
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
                                                        onClick={() => handleDocumentStatusChange(doc.id, "validé")}
                                                        title="Valider le document"
                                                      >
                                                        <CheckCircle className="h-4 w-4" />
                                                      </Button>

                                                      <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDocumentStatusChange(doc.id, "refusé")}
                                                        title="Refuser le document"
                                                      >
                                                        <XCircle className="h-4 w-4" />
                                                      </Button>

                                                      <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDocumentStatusChange(doc.id, "en_attente")}
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

                                      {/* Sous-rubriques */}
                                      {rubrique.sousRubriques && rubrique.sousRubriques.length > 0 && (
                                        <div className="space-y-3 ml-4">
                                          <h4 className="text-sm font-medium mb-2">Sous-rubriques</h4>
                                          {rubrique.sousRubriques.map((sousRubrique) => (
                                            <div key={sousRubrique.id} className="border rounded-md">
                                              <div
                                                className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted"
                                                onClick={() => toggleSousRubrique(sousRubrique.id)}
                                              >
                                                <div className="flex items-center">
                                                  {expandedSousRubriques[sousRubrique.id] ? (
                                                    <ChevronDown className="h-4 w-4 mr-2" />
                                                  ) : (
                                                    <ChevronRight className="h-4 w-4 mr-2" />
                                                  )}
                                                  <span className="font-medium">{sousRubrique.nom}</span>
                                                </div>
                                              </div>

                                              {expandedSousRubriques[sousRubrique.id] && sousRubrique.documents && (
                                                <div className="p-3 pt-0 border-t">
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
                                                      {sousRubrique.documents.map((doc, index) => (
                                                        <TableRow
                                                          key={`sous-rubrique-doc-${doc.id || "unknown"}-${index}`}
                                                        >
                                                          <TableCell>{doc.nom}</TableCell>
                                                          <TableCell>{getStatusBadge(doc.statut)}</TableCell>
                                                          <TableCell>
                                                            {new Date(doc.dateUpload).toLocaleDateString()}
                                                          </TableCell>
                                                          <TableCell className="text-right">
                                                            <div className="flex justify-end gap-1">
                                                              <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() =>
                                                                  handleDownloadDocument(doc.chemin, doc.nom)
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
                                                                    <DialogDescription>
                                                                      Document: {doc.nom}
                                                                    </DialogDescription>
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
                                                                      className="min-h-[100px]"
                                                                    />
                                                                  </div>
                                                                  <DialogFooter>
                                                                    <Button
                                                                      onClick={() => handleAddComment(doc.id)}
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
                                                                  handleDocumentStatusChange(doc.id, "validé")
                                                                }
                                                                title="Valider le document"
                                                              >
                                                                <CheckCircle className="h-4 w-4" />
                                                              </Button>

                                                              <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() =>
                                                                  handleDocumentStatusChange(doc.id, "refusé")
                                                                }
                                                                title="Refuser le document"
                                                              >
                                                                <XCircle className="h-4 w-4" />
                                                              </Button>

                                                              <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() =>
                                                                  handleDocumentStatusChange(doc.id, "en_attente")
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
                                              )}
                                            </div>
                                          ))}
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
                              <TableRow key={`doc-${doc.id || "unknown"}-${index}`}>
                                <TableCell>{doc.nom}</TableCell>
                                <TableCell>
                                  {doc.rubriqueNom}
                                  {doc.sousRubriqueNom && (
                                    <span className="text-muted-foreground"> / {doc.sousRubriqueNom}</span>
                                  )}
                                  <div className="text-xs text-muted-foreground">Année {doc.annee}</div>
                                </TableCell>
                                <TableCell>{getStatusBadge(doc.statut)}</TableCell>
                                <TableCell>{new Date(doc.dateUpload).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDownloadDocument(doc.chemin, doc.nom)}
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
                                            onClick={() => handleAddComment(doc.id)}
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
                                      onClick={() => handleDocumentStatusChange(doc.id, "validé")}
                                      title="Valider le document"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>

                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDocumentStatusChange(doc.id, "refusé")}
                                      title="Refuser le document"
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </Button>

                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDocumentStatusChange(doc.id, "en_attente")}
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
    </ProtectedRouteAdmin>
  )
}
