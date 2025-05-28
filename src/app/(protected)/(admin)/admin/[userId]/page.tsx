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
  const [clients, setClients] = useState<User[]>([]);
  const [demandes, setDemandes] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [pendingDeclarations, setPendingDeclarations] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("clients");
  const [clientsFilter, setClientsFilter] = useState<"all" | "pendingDeclarations">("all");
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
      console.log("Demandes reçues:", data);
      setDemandes(data); // stocke les demandes
      setUsers(data);    // affiche dans le tableau
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
      setClients(data); // stocke les clients
      setUsers(data);   // affiche dans le tableau
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

      // Ajoute cette ligne pour mettre à jour la liste des demandes et donc le badge :
      fetchPendingUsers();

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
      setPendingDeclarations(json.data); // stocke la liste une fois
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
      setUsers(demandes);
    } else if (value === "clients") {
      setClientsFilter("all"); // <-- Ajoute ceci pour réinitialiser le filtre
      setUsers(clients);
    }
  };

  const updateUserStatus = async (userId: number, newStatus: string) => {
    const previousDemandes = demandes;
    const previousUsers = users;

    try {
      setDemandes((prev) => prev.filter((user) => user.user_id !== userId));
      setUsers((prev) => prev.filter((user) => user.user_id !== userId));

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

      // Optionnel : ajouter à la liste des clients si besoin
      if (newStatus === "approved") {
        const approvedUser = previousDemandes.find((u) => u.user_id === userId);
        if (approvedUser) setClients((prev) => [...prev, { ...approvedUser, statut: "approved" }]);
      }
    } catch (error) {
      setDemandes(previousDemandes);
      setUsers(previousUsers);
      toast.error("Erreur lors de la mise à jour du statut", {
        description: error instanceof Error ? error.message : String(error),
        icon: <AlertCircle className="h-5 w-5" />,
      });
    }
  };

  useEffect(() => {
    // Charge toutes les listes une seule fois au montage
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [clientsRes, demandesRes, pendingDeclarationsRes] = await Promise.all([
          fetch(`${API_URL}/users/status/approved`, fetchConfig),
          fetch(`${API_URL}/users/status/pending`, fetchConfig),
          fetch(`${API_URL}/users-with-pending-declarations`, fetchConfig),
        ]);
        if (!clientsRes.ok || !demandesRes.ok || !pendingDeclarationsRes.ok)
          throw new Error("Erreur lors du chargement des données");

        const clientsData = await clientsRes.json();
        const demandesData = await demandesRes.json();
        const pendingDeclarationsData = await pendingDeclarationsRes.json();

        setClients(clientsData);
        setDemandes(demandesData);
        setPendingDeclarations(pendingDeclarationsData.data);

        setUsers(activeTab === "demandes" ? demandesData : clientsData);
      } catch (error) {
        toast.error("Erreur lors du chargement initial", {
          description: error instanceof Error ? error.message : String(error),
          icon: <AlertCircle className="h-5 w-5" />,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Détermine la source selon l'onglet actif
    const source = activeTab === "demandes" ? demandes : clients;
    if (!searchTerm.trim()) {
      setUsers(source);
      return;
    }
    const lower = searchTerm.toLowerCase();
    setUsers(
      source.filter(
        (user) =>
          user.nom.toLowerCase().includes(lower) ||
          user.email.toLowerCase().includes(lower) ||
          user.numeroTelephone.toLowerCase().includes(lower) ||
          user.localite.toLowerCase().includes(lower)
      )
    );
  }, [searchTerm, activeTab, clients, demandes]);

  const renderDemandesNotification = () => {
    if (demandes.length === 0) return null;
    return (
      <span
        className="ml-2 inline-flex items-center justify-center rounded-full bg-red-600 text-white text-xs font-semibold px-2 py-0.5"
        style={{ minWidth: 24 }}
      >
        {demandes.length}
      </span>
    );
  };

  // Pastille pour le rôle
  const RoleBadge = ({ role }: { role: string }) => (
    <span
      className={
        "ml-2 px-2 py-0.5 rounded-full text-xs font-semibold " +
        (role === "entreprise"
          ? "bg-blue-100 text-blue-800"
          : "bg-green-100 text-green-800")
      }
    >
      {role === "entreprise" ? "Entreprise" : "Privé"}
    </span>
  );

  return (
    <ProtectedRouteAdmin>
      <Toaster position="bottom-right" richColors closeButton />
      <div className="container mx-auto px-4 max-w-full">
        <h1 className="text-2xl font-semibold mb-8">
          Tableau de bord administrateur
        </h1>

        <Tabs
          defaultValue="clients"
          className="w-full"
          onValueChange={handleTabChange}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="clients" className="cursor-pointer">
              <Users className="h-4 w-4 mr-2" />
              Mes Clients
            </TabsTrigger>
            <TabsTrigger value="demandes" className="cursor-pointer">
              <UserPlus className="h-4 w-4 mr-2" />
              Mes Demandes
              {renderDemandesNotification()}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clients">
            <Card>
              <CardContent className="pt-2">
                <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Rechercher..."
                        className="pl-8 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && searchUsers()}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Button
                      size="sm"
                      variant={clientsFilter === "all" ? "default" : "outline"}
                      onClick={() => {
                        setUsers(clients);
                        setClientsFilter("all");
                      }}
                      disabled={loading}
                      className="w-full sm:w-auto"
                    >
                      {loading ? "Chargement..." : "Tous les clients"}
                    </Button>
                    <Button
                      size="sm"
                      variant={clientsFilter === "pendingDeclarations" ? "default" : "outline"}
                      onClick={() => {
                        setUsers(pendingDeclarations);
                        setClientsFilter("pendingDeclarations");
                      }}
                      disabled={loading}
                      className="w-full sm:w-auto"
                    >
                      {loading ? "Chargement..." : "Déclarations en attente"}
                    </Button>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center py-8">
                    Chargement des clients...
                  </div>
                ) : (
                  <div className="w-full overflow-x-auto">
                    <Table className="min-w-[700px]">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="px-2 py-2">Nom</TableHead>
                          <TableHead className="px-2 py-2">Email</TableHead>
                          <TableHead className="px-2 py-2">Téléphone</TableHead>
                          <TableHead className="px-2 py-2">Localité</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.length > 0 ? (
                          users.map((user) => (
                            <TableRow
                              key={user.user_id}
                              onClick={() => router.push(`/admin/${userId}/client/${user.user_id}`)}
                              className="cursor-pointer hover:bg-muted transition-colors"
                            >
                              <TableCell className="px-2 py-2">
                                <div className="flex items-center gap-2">
                                  {user.nom}
                                  <RoleBadge role={user.role} />
                                </div>
                              </TableCell>
                              <TableCell className="px-2 py-2">{user.email}</TableCell>
                              <TableCell className="px-2 py-2">{user.numeroTelephone}</TableCell>
                              <TableCell className="px-2 py-2">{user.localite}</TableCell>
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
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demandes">
            <Card>
              <CardContent className="pt-2">
                <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Rechercher..."
                        className="pl-8 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && searchUsers()}
                      />
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center py-8">
                    Chargement des demandes...
                  </div>
                ) : (
                  // Le tableau doit être dans ce conteneur scrollable
                  <div className="w-full overflow-x-auto">
                    <Table className="min-w-[700px]">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="px-2 py-2">Nom</TableHead>
                          <TableHead className="px-2 py-2">Email</TableHead>
                          <TableHead className="px-2 py-2">Téléphone</TableHead>
                          <TableHead className="px-2 py-2">Localité</TableHead>
                          <TableHead className="text-right px-2 py-2"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.length > 0 ? (
                          users.map((user) => (
                            <TableRow key={user.user_id}>
                              <TableCell className="px-2 py-2">
                                <div className="flex items-center gap-2">
                                  {user.nom}
                                  <RoleBadge role={user.role} />
                                </div>
                              </TableCell>
                              <TableCell className="px-2 py-2">{user.email}</TableCell>
                              <TableCell className="px-2 py-2">{user.numeroTelephone}</TableCell>
                              <TableCell className="px-2 py-2">{user.localite}</TableCell>
                              <TableCell className="text-right px-2 py-2">
                                <div className="flex flex-col gap-2 min-w-[120px] sm:flex-row sm:justify-end sm:items-center">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="cursor-pointer bg-green-50 text-green-700 hover:bg-green-100 border-green-200 w-full sm:w-auto"
                                    onClick={() => {
                                      updateUserStatus(user.user_id, "approved");
                                      approveUser(user.user_id, user.role);
                                    }}
                                  >
                                    Accepter
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="cursor-pointer bg-red-50 text-red-700 hover:bg-red-100 border-red-200 w-full sm:w-auto"
                                    onClick={() => deleteUser(user.user_id, user.nom)}
                                  >
                                    Refuser
                                  </Button>
                                </div>
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
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRouteAdmin>
  );
}
