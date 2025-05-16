"use client";

import { useState } from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Search,
  UserPlus,
  Users,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast, Toaster } from "sonner";
import { Input } from "@/components/ui/input";
import { getStatusBadge } from "@/utils/getStatusBadge";
import ProtectedRouteAdmin from "@/components/routes/ProtectedRouteAdmin";
import { useParams, useRouter } from "next/navigation";

interface User {
  user_id: number;
  nom: string;
  email: string;
  numeroTelephone: string;
  localite: string;
  adresse: string;
  codePostal: string;
  role: string;
  statut: string;
  dateCreation: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Configuration par défaut pour les requêtes fetch
const fetchConfig = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    // Vous pouvez ajouter un token d'authentification ici si nécessaire
    // 'Authorization': `Bearer ${token}`
  },
  // Ne pas inclure credentials pour éviter les problèmes CORS
  // credentials: "include"
};

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("general");
  const params = useParams();
  const userId = Number(params?.userId);
  const router = useRouter();

  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/users/status/pending`,
        fetchConfig
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast.error(
        "Une erreur est survenue, veuillez vérifier votre connexion internet",
        {
          description: error instanceof Error ? error.message : String(error),
          icon: <AlertCircle className="h-5 w-5" />,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/users/status/approved`,
        fetchConfig
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast.error(
        "Une erreur est survenue, veuillez vérifier votre connexion internet",
        {
          description: error instanceof Error ? error.message : String(error),
          icon: <AlertCircle className="h-5 w-5" />,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (userId: number, role: string) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: role }),
      });

      if (response.ok) {
        toast.success("Utilisateur approuvé avec succès.", {
          description: "L'utilisateur a été approuvé et un email a été envoyé.",
          icon: <CheckCircle className="h-5 w-5" />,
        });

        // Envoi de l'email d'approbation
        await sendApprovalEmail(userId);
      } else {
        const data = await response.json();
        toast.error("Une erreur est survenue", {
          description: data.message,
          icon: <AlertCircle className="h-5 w-5" />,
        });
      }
    } catch (error) {
      toast.error("Erreur lors de l'acceptation de l'utilisateur", {
        description: error instanceof Error ? error.message : String(error),
        icon: <AlertCircle className="h-5 w-5" />,
      });
    }
  };

  /**
   * Envoie un email de confirmation à l'utilisateur
   * @param userId L'ID de l'utilisateur à qui envoyer l'email de confirmation
   */
  const sendApprovalEmail = async (userId: number) => {
    try {
      await fetch(`${API_URL}/users/${userId}/approve-registration`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      toast.error("Erreur lors de l'envoi du mail de confirmation", {
        description: error instanceof Error ? error.message : String(error),
        icon: <AlertCircle className="h-5 w-5" />,
      });
    }
  };

  const deleteUser = async (userId: number, userName: string) => {
    if (
      !confirm(
        `Êtes-vous sûr de vouloir refuser et supprimer l'utilisateur ${userName} ?`
      )
    ) {
      return;
    }

    try {
      // Optimistic UI update - Supprimer immédiatement l'utilisateur de la liste
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.user_id !== userId)
      );

      // Envoyer l'email de rejet
      await sendRejectionEmail(userId);

      // Envoyer la requête au backend
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "DELETE",
        ...fetchConfig,
      });

      toast.success("Utilisateur supprimé", {
        description: "L'utilisateur a été supprimé avec succès.",
        icon: <CheckCircle className="h-5 w-5" />,
      });

      if (!response.ok) {
        // En cas d'erreur, recharger la liste pour restaurer l'état
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Pas besoin de recharger la liste car nous avons déjà mis à jour l'UI
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'utilisateur", {
        description: error instanceof Error ? error.message : String(error),
        icon: <AlertCircle className="h-5 w-5" />,
      });
      // En cas d'erreur, recharger la liste pour restaurer l'état correct
      fetchPendingUsers();
    }
  };

  /**
   * Envoie un email de rejet à l'utilisateur
   * @param userId L'ID de l'utilisateur à qui envoyer l'email de rejet
   */
  const sendRejectionEmail = async (userId: number) => {
    try {
      await fetch(`${API_URL}/users/${userId}/reject-registration`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      toast.error("Erreur lors de l'envoi du mail de refus", {
        description: error instanceof Error ? error.message : String(error),
        icon: <AlertCircle className="h-5 w-5" />,
      });
    }
  };

  const fetchUsersWithPendingDeclarations = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/users-with-pending-declarations`,
        fetchConfig
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const json = await response.json();
      setUsers(json.data); // on suppose que tu veux stocker uniquement la propriété "data"
    } catch (error) {
      toast.error(
        "Erreur lors du chargement des utilisateurs avec déclarations pending",
        {
          description: error instanceof Error ? error.message : String(error),
          icon: <AlertCircle className="h-5 w-5" />,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    if (!searchTerm.trim()) {
      // Si la recherche est vide, on recharge les utilisateurs selon l'onglet actif
      if (activeTab === "demandes") {
        fetchPendingUsers()
      } else if (activeTab === "clients") {
        fetchApprovedUsers()
      }
      return
    }

    setLoading(true)
    try {
      const statut = activeTab === "demandes" ? "pending" : "approved"
      const response = await fetch(
        `${API_URL}/users?query=${encodeURIComponent(searchTerm)}&statut=${statut}`,
        fetchConfig,
      )

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

      const data = await response.json()
      setUsers(data.results || []);
    } catch (error) {
      console.error("Erreur lors de la recherche des utilisateurs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchTerm("");

    if (value === "demandes") {
      fetchPendingUsers();
    } else if (value === "clients") {
      fetchApprovedUsers();
    }
  };

  const updateUserStatus = async (userId: number, newStatus: string) => {
    const previousUsers = users; // Sauvegarde de l'état actuel

    try {
      // Supprime immédiatement l'utilisateur de la liste pour un effet optimiste
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.user_id !== userId)
      );

      // Envoi de la requête au backend
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "PATCH",
        ...fetchConfig,
        body: JSON.stringify({ statut: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }

      // toast.success("Statut mis à jour avec succès", {
      //   description: "L'utilisateur a été mis à jour.",
      //   icon: <CheckCircle className="h-5 w-5" />,
      // });

      // Recharger uniquement si nécessaire
      if (activeTab === "demandes") {
        fetchPendingUsers(); // Recharge uniquement les utilisateurs en attente
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut", {
        description: error instanceof Error ? error.message : String(error),
        icon: <AlertCircle className="h-5 w-5" />,
      });
      setUsers(previousUsers); // Rétablir la liste en cas d'échec
    }
  };

  // Charger les demandes au montage de la page
  useEffect(() => {
    fetchPendingUsers();
  }, []); // Le tableau vide [] signifie que cet effet s'exécute uniquement au montage

  return (
    <ProtectedRouteAdmin>
      <Toaster position="bottom-right" richColors closeButton />
      <div className="container mx-auto py-10 px-4 max-w-full">
        <h1 className="text-2xl font-semibold mb-8">
          Tableau de bord administrateur
        </h1>

        <Tabs
          defaultValue="demandes"
          className="w-full"
          onValueChange={handleTabChange}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="demandes">
              <UserPlus className="h-4 w-4 mr-2" />
              Mes Demandes
            </TabsTrigger>
            <TabsTrigger value="clients">
              <Users className="h-4 w-4 mr-2" />
              Mes Clients
            </TabsTrigger>
          </TabsList>

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
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={fetchPendingUsers}
                      disabled={loading}
                    >
                      {loading ? "Chargement..." : "Toutes les demandes"}
                    </Button>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center py-8">
                    Chargement des demandes...
                  </div>
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
                            <TableCell>
                              {new Date(user.dateCreation).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{getStatusBadge(user.statut)}</TableCell>
                            <TableCell className="text-right space-x-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                                onClick={() => {
                                  // Mettre à jour le statut de l'utilisateur (en passant "approved")
                                  updateUserStatus(user.user_id, "approved");

                                  // Puis, associer l'utilisateur à l'entité correspondante (Prive ou Entreprise)
                                  approveUser(user.user_id, user.role);
                                }}
                              >
                                Accepter
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                                onClick={() =>
                                  deleteUser(user.user_id, user.nom)
                                }
                              >
                                Refuser
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
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={fetchApprovedUsers}
                      disabled={loading}
                    >
                      {loading ? "Chargement..." : "Tous les clients"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={fetchUsersWithPendingDeclarations}
                      disabled={loading}
                    >
                      {loading ? "Chargement..." : "Declarations en attente"}
                    </Button>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center py-8">
                    Chargement des clients...
                  </div>
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
                            <TableCell>
                              {new Date(user.dateCreation).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{getStatusBadge(user.statut)}</TableCell>
                            <TableCell className="text-right space-x-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  router.push(
                                    `/admin/${userId}/client/${user.user_id}`
                                  )
                                }
                              >
                                Voir détails
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
    </ProtectedRouteAdmin>
  );
}
