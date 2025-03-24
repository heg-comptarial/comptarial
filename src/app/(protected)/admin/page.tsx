"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit, Search, UserPlus, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

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
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

export default function Dashboard() {
  const [message, setMessage] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("general")

  useEffect(() => {
    fetch(`${API_URL}/test`, { credentials: "include" })
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Erreur:", error))
  }, [])

  const fetchUsers = async (status: string) => {
    setLoading(true)
    try {
      // Dans un environnement réel, vous auriez un endpoint qui filtre par statut
      // Par exemple: `${API_URL}/users?statut=${status}`
      const response = await fetch(`${API_URL}/users`, { credentials: "include" })
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

      const data = await response.json()

      // Filtrer les utilisateurs par statut côté client
      // Dans un environnement de production, ce filtrage devrait idéalement être fait côté serveur
      const filteredUsers = data.filter((user: User) => user.statut === status)
      setUsers(filteredUsers)
    } catch (error) {
      console.error(`Erreur lors du chargement des utilisateurs ${status}:`, error)
    } finally {
      setLoading(false)
    }
  }

  const searchUsers = async () => {
    if (!searchTerm.trim()) {
      // Si la recherche est vide, on recharge les utilisateurs selon l'onglet actif
      if (activeTab === "demandes") {
        fetchUsers("pending")
      } else if (activeTab === "clients") {
        fetchUsers("approved")
      }
      return
    }

    setLoading(true)
    try {
      // Dans un environnement réel, vous auriez un endpoint de recherche
      // Par exemple: `${API_URL}/users/search?q=${searchTerm}&statut=${activeTab === "demandes" ? "pending" : "approved"}`
      const response = await fetch(`${API_URL}/users`, { credentials: "include" })
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

      const data = await response.json()

      // Filtrer les résultats par statut et terme de recherche
      const filteredUsers = data.filter((user: User) => {
        const matchesStatus = activeTab === "demandes" ? user.statut === "pending" : user.statut === "approved"

        const matchesSearch =
          user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.numeroTelephone.includes(searchTerm)

        return matchesStatus && matchesSearch
      })

      setUsers(filteredUsers)
    } catch (error) {
      console.error("Erreur lors de la recherche des utilisateurs:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return "Accepté"
      case "pending":
        return "En attente"
      case "rejected":
        return "Refusé"
      default:
        return status
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setSearchTerm("")

    if (value === "demandes") {
      fetchUsers("pending")
    } else if (value === "clients") {
      fetchUsers("approved")
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <h1 className="text-2xl font-semibold mb-8">
        Tableau de bord administrateur
        <p className="text-sm text-muted-foreground mt-2">Backend Response: {message}</p>
      </h1>

      <Tabs defaultValue="general" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="general">Infos générales</TabsTrigger>
          <TabsTrigger value="demandes">
            <UserPlus className="h-4 w-4 mr-2" />
            Mes Demandes
          </TabsTrigger>
          <TabsTrigger value="clients">
            <Users className="h-4 w-4 mr-2" />
            Mes Clients
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardContent className="pt-6">
              <p>Contenu des informations générales</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demandes">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Nouvelles demandes</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Rechercher..."
                      className="pl-8 w-[200px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && searchUsers()}
                    />
                  </div>
                  <Button size="sm" onClick={searchUsers}>
                    Rechercher
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => fetchUsers("pending")} disabled={loading}>
                    {loading ? "Chargement..." : "Toutes les demandes"}
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">Chargement des demandes...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Localité</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Date de création</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <TableRow key={user.user_id}>
                          <TableCell>{user.user_id}</TableCell>
                          <TableCell>{user.nom}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.numeroTelephone}</TableCell>
                          <TableCell>{user.localite}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>{new Date(user.dateCreation).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`${getStatusClass(user.statut)}`}>
                              {getStatusLabel(user.statut)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-4">
                          Aucune demande en attente
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Liste des clients</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Rechercher..."
                      className="pl-8 w-[200px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && searchUsers()}
                    />
                  </div>
                  <Button size="sm" onClick={searchUsers}>
                    Rechercher
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => fetchUsers("approved")} disabled={loading}>
                    {loading ? "Chargement..." : "Tous les clients"}
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">Chargement des clients...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Localité</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Date de création</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <TableRow key={user.user_id}>
                          <TableCell>{user.user_id}</TableCell>
                          <TableCell>{user.nom}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.numeroTelephone}</TableCell>
                          <TableCell>{user.localite}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>{new Date(user.dateCreation).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`${getStatusClass(user.statut)}`}>
                              {getStatusLabel(user.statut)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-4">
                          Aucun client trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

