"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Edit, Trash2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Client {
  id: number
  name: string
  email: string
  phone: string
  created_at: string
}

export default function Dashboard() {
  const [message, setMessage] = useState("")
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  useEffect(() => {
    fetch("http://localhost:5000/api/test")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error:", error))
  }, [])

  const fetchClients = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:8000/api/clients")
      const data = await response.json()
      setClients(data)
    } catch (error) {
      console.error("Error fetching clients:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditClient = (client: Client) => {
    setSelectedClient(client)
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedClient) return

    try {
      const response = await fetch(`http://localhost:8000/api/clients/${selectedClient.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchClients()
      }
    } catch (error) {
      console.error("Error updating client:", error)
    }
  }

  const handleDeleteClient = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) return

    try {
      const response = await fetch(`http://localhost:8000/api/clients/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchClients()
      }
    } catch (error) {
      console.error("Error deleting client:", error)
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
          <TabsTrigger value="clients" onClick={fetchClients}>
            Mes Clients
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="space-y-6 mb-12">
            {/* General info content */}
            <Card>
              <CardContent className="pt-6">
                <p>Contenu des informations générales</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-between mt-16">
            <h2 className="text-xl font-medium">Grand livre (pdf à consulter)</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon">
                <FileText className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="clients">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Liste des clients</h2>
                <Button size="sm" onClick={fetchClients} disabled={loading}>
                  {loading ? "Chargement..." : "Rafraîchir"}
                </Button>
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
                      <TableHead>Date d'inscription</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.length > 0 ? (
                      clients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell>{client.id}</TableCell>
                          <TableCell>{client.name}</TableCell>
                          <TableCell>{client.email}</TableCell>
                          <TableCell>{client.phone}</TableCell>
                          <TableCell>{new Date(client.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => handleEditClient(client)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Modifier le client</DialogTitle>
                                  </DialogHeader>
                                  <form onSubmit={handleSubmit}>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid gap-2">
                                        <Label htmlFor="name">Nom</Label>
                                        <Input
                                          id="name"
                                          name="name"
                                          value={formData.name}
                                          onChange={handleInputChange}
                                        />
                                      </div>
                                      <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                          id="email"
                                          name="email"
                                          type="email"
                                          value={formData.email}
                                          onChange={handleInputChange}
                                        />
                                      </div>
                                      <div className="grid gap-2">
                                        <Label htmlFor="phone">Téléphone</Label>
                                        <Input
                                          id="phone"
                                          name="phone"
                                          value={formData.phone}
                                          onChange={handleInputChange}
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <DialogClose asChild>
                                        <Button type="button" variant="outline">
                                          Annuler
                                        </Button>
                                      </DialogClose>
                                      <Button type="submit">Enregistrer</Button>
                                    </DialogFooter>
                                  </form>
                                </DialogContent>
                              </Dialog>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteClient(client.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
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