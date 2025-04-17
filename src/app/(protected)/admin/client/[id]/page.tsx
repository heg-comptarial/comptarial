"use client"

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
  Trash2,
  CheckCircle,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
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
  nom: string
  description: string
  documents?: Document[]
  sousRubriques?: SousRubrique[]
}

interface Declaration {
  id: number
  titre: string
  annee?: number
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

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeDeclaration, setActiveDeclaration] = useState<Declaration | null>(null)
  const [commentaire, setCommentaire] = useState("")
  const [expandedRubriques, setExpandedRubriques] = useState<Record<number, boolean>>({})
  const [expandedSousRubriques, setExpandedSousRubriques] = useState<Record<number, boolean>>({})

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true)
        // Vérifiez si l'ID utilisateur est déjà dans sessionStorage
        const cachedUserId = sessionStorage.getItem("user_id")
        if (cachedUserId && Number.parseInt(cachedUserId) === Number.parseInt(userId)) {
          // Si l'ID est déjà stocké, récupérez les détails depuis l'API
          const response = await fetch(`http://localhost:8000/api/users/${cachedUserId}/details`)
          if (!response.ok) {
            throw new Error(`Erreur HTTP ! Statut : ${response.status}`)
          }
          const data = await response.json()
          setUserDetails(data.data) // Stockez les détails dans l'état local

          // Si l'utilisateur a des déclarations, définir la première comme active
          if (data.data.declarations && data.data.declarations.length > 0) {
            setActiveDeclaration(data.data.declarations[0])
          }

          return
        }

        // Si l'ID n'est pas dans sessionStorage, faites une requête API
        const response = await fetch(`http://localhost:8000/api/users/${userId}/details`)
        if (!response.ok) {
          throw new Error(`Erreur HTTP ! Statut : ${response.status}`)
        }
        const data = await response.json()

        // Stockez uniquement l'ID dans sessionStorage
        sessionStorage.setItem("user_id", userId)

        // Mettez à jour l'état local avec les détails utilisateur
        setUserDetails(data.data)

        // Si l'utilisateur a des déclarations, définir la première comme active
        if (data.data.declarations && data.data.declarations.length > 0) {
          setActiveDeclaration(data.data.declarations[0])
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de l'utilisateur :", error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchUserDetails()
    }
  }, [userId])

  const handleDocumentStatusChange = async (documentId: number, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/documents/${documentId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ statut: newStatus }),
      })

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

      // Mettre à jour l'état local (cette partie dépendra de la structure exacte de vos données)
      // Pour l'instant, nous rechargeons simplement les données
      const fetchResponse = await fetch(`http://localhost:8000/api/users/${userId}/details`)
      if (fetchResponse.ok) {
        const data = await fetchResponse.json()
        setUserDetails(data.data)

        // Mettre à jour la déclaration active si nécessaire
        if (activeDeclaration && data.data.declarations) {
          const updatedActiveDeclaration = data.data.declarations.find(
            (d: Declaration) => d.id === activeDeclaration.id,
          )
          if (updatedActiveDeclaration) {
            setActiveDeclaration(updatedActiveDeclaration)
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut du document:", error)
    }
  }

  const handleAddComment = async (documentId: number) => {
    if (!commentaire.trim()) return

    try {
      const response = await fetch(`http://localhost:8000/api/documents/${documentId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentaire }),
      })

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

      // Mettre à jour l'état local (cette partie dépendra de la structure exacte de vos données)
      // Pour l'instant, nous rechargeons simplement les données
      const fetchResponse = await fetch(`http://localhost:8000/api/users/${userId}/details`)
      if (fetchResponse.ok) {
        const data = await fetchResponse.json()
        setUserDetails(data.data)

        // Mettre à jour la déclaration active si nécessaire
        if (activeDeclaration && data.data.declarations) {
          const updatedActiveDeclaration = data.data.declarations.find(
            (d: Declaration) => d.id === activeDeclaration.id,
          )
          if (updatedActiveDeclaration) {
            setActiveDeclaration(updatedActiveDeclaration)
          }
        }
      }

      setCommentaire("")
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error)
    }
  }

  const toggleRubrique = (rubriqueId: number) => {
    setExpandedRubriques((prev) => ({
      ...prev,
      [rubriqueId]: !prev[rubriqueId],
    }))
  }

  const toggleSousRubrique = (sousRubriqueId: number) => {
    setExpandedSousRubriques((prev) => ({
      ...prev,
      [sousRubriqueId]: !prev[sousRubriqueId],
    }))
  }

  const handleDeclarationSelect = (declarationId: number) => {
    if (userDetails && userDetails.declarations) {
      const selected = userDetails.declarations.find((d) => d.id === declarationId)
      if (selected) {
        setActiveDeclaration(selected)
      }
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
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
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <ProtectedRouteAdmin>
        <div className="container mx-auto py-10 px-4">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Chargement des données...</p>
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
                <CardTitle className="text-lg">Compte Client</CardTitle>
              </CardHeader>
              <CardContent>
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
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                  </div>
                </div>
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
                          {userDetails.declarations.map((declaration) => (
                            <Button
                              key={declaration.id}
                              variant={activeDeclaration?.id === declaration.id ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleDeclarationSelect(declaration.id)}
                            >
                              {declaration.annee || new Date(declaration.dateSoumission).getFullYear()}
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
                              <Badge>{getStatusBadge(activeDeclaration.statut)}</Badge>
                            </div>

                            <Separator />

                            {activeDeclaration.rubriques?.map((rubrique) => (
                              <div key={rubrique.id} className="border rounded-md">
                                <div
                                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted"
                                  onClick={() => toggleRubrique(rubrique.id)}
                                >
                                  <div className="flex items-center">
                                    {expandedRubriques[rubrique.id] ? (
                                      <ChevronDown className="h-4 w-4 mr-2" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4 mr-2" />
                                    )}
                                    <span className="font-medium">{rubrique.nom}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>

                                {expandedRubriques[rubrique.id] && (
                                  <div className="p-3 pt-0 border-t">
                                    {/* Documents de la rubrique */}
                                    {rubrique.documents && rubrique.documents.length > 0 && (
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
                                            {rubrique.documents.map((doc) => (
                                              <TableRow key={doc.id}>
                                                <TableCell>{doc.nom}</TableCell>
                                                <TableCell>{getStatusBadge(doc.statut)}</TableCell>
                                                <TableCell>{new Date(doc.dateUpload).toLocaleDateString()}</TableCell>
                                                <TableCell className="text-right">
                                                  <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon">
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
                                                    >
                                                      <CheckCircle className="h-4 w-4" />
                                                    </Button>

                                                    <Button variant="ghost" size="icon">
                                                      <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                  </div>
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </div>
                                    )}

                                    {/* Sous-rubriques */}
                                    {rubrique.sousRubriques && rubrique.sousRubriques.length > 0 && (
                                      <div className="space-y-3 ml-4">
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
                                              <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="icon">
                                                  <Edit className="h-4 w-4" />
                                                </Button>
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
                                                    {sousRubrique.documents.map((doc) => (
                                                      <TableRow key={doc.id}>
                                                        <TableCell>{doc.nom}</TableCell>
                                                        <TableCell>{getStatusBadge(doc.statut)}</TableCell>
                                                        <TableCell>
                                                          {new Date(doc.dateUpload).toLocaleDateString()}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                          <div className="flex justify-end gap-1">
                                                            <Button variant="ghost" size="icon">
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
                                                            >
                                                              <CheckCircle className="h-4 w-4" />
                                                            </Button>

                                                            <Button variant="ghost" size="icon">
                                                              <Trash2 className="h-4 w-4" />
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
                                )}
                              </div>
                            ))}
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
                        <Input type="search" placeholder="Rechercher un document..." className="mb-4" />

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
                            {userDetails.declarations
                              .flatMap(
                                (declaration) =>
                                  declaration.rubriques?.flatMap((rubrique) => [
                                    ...(rubrique.documents || []).map((doc) => ({
                                      ...doc,
                                      rubriqueNom: rubrique.nom,
                                      sousRubriqueNom: null,
                                      annee: declaration.annee || new Date(declaration.dateSoumission).getFullYear(),
                                    })),
                                    ...(rubrique.sousRubriques || []).flatMap((sousRubrique) =>
                                      (sousRubrique.documents || []).map((doc) => ({
                                        ...doc,
                                        rubriqueNom: rubrique.nom,
                                        sousRubriqueNom: sousRubrique.nom,
                                        annee: declaration.annee || new Date(declaration.dateSoumission).getFullYear(),
                                      })),
                                    ),
                                  ]) || [],
                              )
                              .map((doc) => (
                                <TableRow key={doc.id}>
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
                                      <Button variant="ghost" size="icon">
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
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                      </Button>

                                      <Button variant="ghost" size="icon">
                                        <Trash2 className="h-4 w-4" />
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
