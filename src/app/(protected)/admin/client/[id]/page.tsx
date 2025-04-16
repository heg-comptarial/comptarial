"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileText, Edit, Download, Trash2, CheckCircle, MessageSquare, ChevronRight, ChevronDown } from "lucide-react"
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

interface User {
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
  entreprises?: Entreprise
  prives?: Prive
  declarations?: Declaration[]
}

interface Entreprise {
  entreprise_id: number
  user_id: number
  raisonSociale: string
  prestations: string
  grandLivre: string
  numeroFiscal: string
  nouvelleEntreprise: boolean
}

interface Prive {
  prive_id: number
  user_id: number
  dateNaissance: string | null
  nationalite: string | null
  etatCivil: string | null
  fo_banques: boolean
  fo_dettes: boolean
  fo_immobiliers: boolean
  fo_salarie: boolean
  fo_autrePersonneCharge: boolean
  fo_independant: boolean
  fo_rentier: boolean
  fo_autreRevenu: boolean
  fo_assurance: boolean
  fo_autreDeduction: boolean
  fo_autreInformations: boolean
}

interface Declaration {
  declaration_id: number
  user_id: number
  annee: number
  statut: string
  dateCreation: string
  dateModification: string
  rubriques?: Rubrique[]
}

interface Rubrique {
  rubrique_id: number
  declaration_id: number
  nom: string
  description: string
  documents?: Document[]
  sousRubriques?: SousRubrique[]
}

interface SousRubrique {
  sousRubrique_id: number
  rubrique_id: number
  nom: string
  description: string
  documents?: Document[]
}

interface Document {
  document_id: number
  rubrique_id?: number
  sousRubrique_id?: number
  nom: string
  chemin: string
  type: string
  taille: number
  statut: string
  dateUpload: string
  commentaire?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// Configuration par défaut pour les requêtes fetch
const fetchConfig = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
}

export default function ClientDetail() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string

  const [user, setUser] = useState<User | null>(null)
  const [declarations, setDeclarations] = useState<Declaration[]>([])
  const [loading, setLoading] = useState(true)
  const [activeDeclaration, setActiveDeclaration] = useState<Declaration | null>(null)
  const [commentaire, setCommentaire] = useState("")
  const [expandedRubriques, setExpandedRubriques] = useState<Record<number, boolean>>({})
  const [expandedSousRubriques, setExpandedSousRubriques] = useState<Record<number, boolean>>({})

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté en tant qu'admin
    const userRole = sessionStorage.getItem("userRole")
    if (userRole !== "admin") {
      router.push("/login")
      return
    }

    // Charger les données de l'utilisateur
    fetchUserData()
  }, [userId, router])

  const fetchUserData = async () => {
    setLoading(true)
    try {
      // Récupérer les informations de l'utilisateur
      const userResponse = await fetch(`${API_URL}/users/${userId}`, fetchConfig)
      if (!userResponse.ok) throw new Error(`HTTP error! Status: ${userResponse.status}`)
      const userData = await userResponse.json()
      setUser(userData)

      // Récupérer les déclarations de l'utilisateur
      const declarationsResponse = await fetch(`${API_URL}/users/${userId}/declarations`, fetchConfig)
      if (!declarationsResponse.ok) throw new Error(`HTTP error! Status: ${declarationsResponse.status}`)
      const declarationsData = await declarationsResponse.json()
      setDeclarations(declarationsData)

      // Si des déclarations existent, définir la première comme active
      if (declarationsData.length > 0) {
        setActiveDeclaration(declarationsData[0])
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDocumentStatusChange = async (documentId: number, newStatus: string) => {
    try {
      const response = await fetch(`${API_URL}/documents/${documentId}/status`, {
        method: "PATCH",
        ...fetchConfig,
        body: JSON.stringify({ statut: newStatus }),
      })

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

      // Mettre à jour l'état local
      const updatedDeclarations = declarations.map((declaration) => {
        const updatedRubriques = declaration.rubriques?.map((rubrique) => {
          const updatedDocuments = rubrique.documents?.map((doc) =>
            doc.document_id === documentId ? { ...doc, statut: newStatus } : doc,
          )

          const updatedSousRubriques = rubrique.sousRubriques?.map((sousRubrique) => {
            const updatedSousDocuments = sousRubrique.documents?.map((doc) =>
              doc.document_id === documentId ? { ...doc, statut: newStatus } : doc,
            )
            return { ...sousRubrique, documents: updatedSousDocuments }
          })

          return {
            ...rubrique,
            documents: updatedDocuments,
            sousRubriques: updatedSousRubriques,
          }
        })

        return { ...declaration, rubriques: updatedRubriques }
      })

      setDeclarations(updatedDeclarations)

      if (activeDeclaration) {
        const updatedActiveDeclaration = updatedDeclarations.find(
          (d) => d.declaration_id === activeDeclaration.declaration_id,
        )
        if (updatedActiveDeclaration) {
          setActiveDeclaration(updatedActiveDeclaration)
        }
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut du document:", error)
    }
  }

  const handleAddComment = async (documentId: number) => {
    if (!commentaire.trim()) return

    try {
      const response = await fetch(`${API_URL}/documents/${documentId}/comment`, {
        method: "POST",
        ...fetchConfig,
        body: JSON.stringify({ commentaire }),
      })

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

      // Mettre à jour l'état local
      const updatedDeclarations = declarations.map((declaration) => {
        const updatedRubriques = declaration.rubriques?.map((rubrique) => {
          const updatedDocuments = rubrique.documents?.map((doc) =>
            doc.document_id === documentId ? { ...doc, commentaire } : doc,
          )

          const updatedSousRubriques = rubrique.sousRubriques?.map((sousRubrique) => {
            const updatedSousDocuments = sousRubrique.documents?.map((doc) =>
              doc.document_id === documentId ? { ...doc, commentaire } : doc,
            )
            return { ...sousRubrique, documents: updatedSousDocuments }
          })

          return {
            ...rubrique,
            documents: updatedDocuments,
            sousRubriques: updatedSousRubriques,
          }
        })

        return { ...declaration, rubriques: updatedRubriques }
      })

      setDeclarations(updatedDeclarations)

      if (activeDeclaration) {
        const updatedActiveDeclaration = updatedDeclarations.find(
          (d) => d.declaration_id === activeDeclaration.declaration_id,
        )
        if (updatedActiveDeclaration) {
          setActiveDeclaration(updatedActiveDeclaration)
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
    const selected = declarations.find((d) => d.declaration_id === declarationId)
    if (selected) {
      setActiveDeclaration(selected)
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

  if (!user) {
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
                    <h3 className="font-medium">{user.nom}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground">{user.numeroTelephone}</p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium mb-1">Adresse</h4>
                    <p className="text-sm">{user.adresse}</p>
                    <p className="text-sm">
                      {user.codePostal} {user.localite}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium mb-1">Type de client</h4>
                    <Badge variant="outline" className="capitalize">
                      {user.role}
                    </Badge>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium mb-1">Statut</h4>
                    {getStatusBadge(user.statut)}
                  </div>

                  {user.entreprises && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-medium mb-1">Entreprise</h4>
                        <p className="text-sm">Raison sociale: {user.entreprises.raisonSociale}</p>
                        <p className="text-sm">N° fiscal: {user.entreprises.numeroFiscal}</p>
                      </div>

                      <div className="pt-2">
                        <Button variant="outline" size="sm" className="w-full">
                          <FileText className="h-4 w-4 mr-2" />
                          Grand Livre
                        </Button>
                      </div>
                    </>
                  )}

                  {user.prives && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-medium mb-1">Informations privées</h4>
                        {user.prives.dateNaissance && (
                          <p className="text-sm">
                            Né(e) le: {new Date(user.prives.dateNaissance).toLocaleDateString()}
                          </p>
                        )}
                        {user.prives.nationalite && <p className="text-sm">Nationalité: {user.prives.nationalite}</p>}
                        {user.prives.etatCivil && <p className="text-sm">État civil: {user.prives.etatCivil}</p>}
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
                    {declarations.length === 0 ? (
                      <div className="text-center py-8">
                        <p>Aucune déclaration trouvée pour ce client.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex flex-wrap gap-2">
                          {declarations.map((declaration) => (
                            <Button
                              key={declaration.declaration_id}
                              variant={
                                activeDeclaration?.declaration_id === declaration.declaration_id ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => handleDeclarationSelect(declaration.declaration_id)}
                            >
                              {declaration.annee}
                            </Button>
                          ))}
                        </div>

                        {activeDeclaration && (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-medium">Déclaration {activeDeclaration.annee}</h3>
                              <Badge>{getStatusBadge(activeDeclaration.statut)}</Badge>
                            </div>

                            <Separator />

                            {activeDeclaration.rubriques?.map((rubrique) => (
                              <div key={rubrique.rubrique_id} className="border rounded-md">
                                <div
                                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted"
                                  onClick={() => toggleRubrique(rubrique.rubrique_id)}
                                >
                                  <div className="flex items-center">
                                    {expandedRubriques[rubrique.rubrique_id] ? (
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

                                {expandedRubriques[rubrique.rubrique_id] && (
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
                                              <TableRow key={doc.document_id}>
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
                                                            onClick={() => handleAddComment(doc.document_id)}
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
                                                        handleDocumentStatusChange(doc.document_id, "validé")
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

                                    {/* Sous-rubriques */}
                                    {rubrique.sousRubriques && rubrique.sousRubriques.length > 0 && (
                                      <div className="space-y-3 ml-4">
                                        {rubrique.sousRubriques.map((sousRubrique) => (
                                          <div key={sousRubrique.sousRubrique_id} className="border rounded-md">
                                            <div
                                              className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted"
                                              onClick={() => toggleSousRubrique(sousRubrique.sousRubrique_id)}
                                            >
                                              <div className="flex items-center">
                                                {expandedSousRubriques[sousRubrique.sousRubrique_id] ? (
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

                                            {expandedSousRubriques[sousRubrique.sousRubrique_id] &&
                                              sousRubrique.documents && (
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
                                                        <TableRow key={doc.document_id}>
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
                                                                      onClick={() => handleAddComment(doc.document_id)}
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
                                                                  handleDocumentStatusChange(doc.document_id, "validé")
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
                    {declarations.length === 0 ? (
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
                            {declarations
                              .flatMap(
                                (declaration) =>
                                  declaration.rubriques?.flatMap((rubrique) => [
                                    ...(rubrique.documents || []).map((doc) => ({
                                      ...doc,
                                      rubriqueNom: rubrique.nom,
                                      sousRubriqueNom: null,
                                      annee: declaration.annee,
                                    })),
                                    ...(rubrique.sousRubriques || []).flatMap((sousRubrique) =>
                                      (sousRubrique.documents || []).map((doc) => ({
                                        ...doc,
                                        rubriqueNom: rubrique.nom,
                                        sousRubriqueNom: sousRubrique.nom,
                                        annee: declaration.annee,
                                      })),
                                    ),
                                  ]) || [],
                              )
                              .map((doc) => (
                                <TableRow key={doc.document_id}>
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
                                              onClick={() => handleAddComment(doc.document_id)}
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
                                        onClick={() => handleDocumentStatusChange(doc.document_id, "validé")}
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
