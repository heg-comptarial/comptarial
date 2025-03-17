"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Edit } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
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

