"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Edit, Search } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"

interface User {
  id: number;
  name: string;
  email: string;
  numero_telephone: string;
}

interface Client {
  client_id: number;
  user_id: number;
  type_entreprise: string;
  adresse: string;
  numero_fiscal: string;
  statut_client: string;
  user?: User;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

export default function Dashboard() {
  const [message, setMessage] = useState("")
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetch(`${API_URL}/test`, { credentials: "include" })
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Erreur:", error))
  }, [])

  const fetchClients = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/clients`, { credentials: "include" })
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

      const data = await response.json()
      setClients(data)
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error)
    } finally {
      setLoading(false)
    }
  }

  const searchClients = async () => {
    if (!searchTerm.trim()) {
      fetchClients()
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/clients/search?q=${encodeURIComponent(searchTerm)}`, { credentials: "include" })
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

      const data = await response.json()
      setClients(data)
    } catch (error) {
      console.error("Erreur lors de la recherche des clients:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Accepté': return "bg-green-100 text-green-800"
      case 'Suspendu': return "bg-yellow-100 text-yellow-800"
      case 'Refusé': return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <h1 className="text-2xl font-semibold mb-8">
        Tableau de bord administrateur
        <p className="text-sm text-muted-foreground mt-2">Backend Response: {message}</p>
      </h1>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">Infos générales</TabsTrigger>
          <TabsTrigger value="clients" onClick={fetchClients}>Mes Clients</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardContent className="pt-6">
              <p>Contenu des informations générales</p>
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
                      onKeyDown={(e) => e.key === 'Enter' && searchClients()}
                    />
                  </div>
                  <Button size="sm" onClick={searchClients}>Rechercher</Button>
                  <Button size="sm" variant="outline" onClick={fetchClients} disabled={loading}>
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
                      <TableHead>Type d'entreprise</TableHead>
                      <TableHead>Numéro fiscal</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.length > 0 ? (
                      clients.map((client) => (
                        <TableRow key={client.client_id}>
                          <TableCell>{client.client_id}</TableCell>
                          <TableCell>{client.user?.name || 'N/A'}</TableCell>
                          <TableCell>{client.user?.email || 'N/A'}</TableCell>
                          <TableCell>{client.user?.numero_telephone || 'N/A'}</TableCell>
                          <TableCell>{client.type_entreprise}</TableCell>
                          <TableCell>{client.numero_fiscal}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(client.statut_client)}`}>
                              {client.statut_client}
                            </span>
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
                        <TableCell colSpan={8} className="text-center py-4">
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