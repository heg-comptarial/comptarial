"use client";

import { JSX, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";
import { NotificationService } from "@/services/notification-service"
import { notFound } from "next/navigation";



function ResetPassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const token = localStorage.getItem("auth_token");
  const userId = localStorage.getItem("user_id");
  if (!userId) {
    alert("Utilisateur non identifié");
    return;
  }

  // 1. Vérification du mot de passe actuel auprès de l’API
  try {
    const check = await fetch("http://127.0.0.1:8000/api/users/check-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: parseInt(userId),
        currentPassword,
      }),
    });

    if (!check.ok) {
      alert("Mot de passe actuel incorrect");
      return;
    }

    // 2. Vérification : nouveau mot de passe différent de l'ancien
    if (currentPassword === newPassword) {
      alert("Le nouveau mot de passe doit être différent de l'ancien.");
      return;
    }

    // 3. Vérification : confirmation
    if (newPassword !== confirmPassword) {
      alert("Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    // 4. Vérification : complexité du mot de passe
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      alert(
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial."
      );
      return;
    }

    // 5. Mise à jour du mot de passe
    const update = await fetch("http://127.0.0.1:8000/api/users/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: parseInt(userId),
        newPassword,
      }),
    });

    if (!update.ok) {
      throw new Error("Échec de la mise à jour");
    }

    alert("Mot de passe mis à jour avec succès !");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  } catch (err) {
    console.error("Erreur:", err);
    alert("Une erreur est survenue");
  }
};


  return (
    <Card>
      <CardHeader>
        <CardTitle>Changer votre mot de passe</CardTitle>
        <CardDescription>
          Pour modifier votre mot de passe, veuillez saisir votre mot de passe actuel puis le nouveau.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Mot de passe actuel</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Entrez votre mot de passe actuel"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Entrez votre nouveau mot de passe"
              required
            />
            <p className="text-xs text-gray-500">
              Le mot de passe doit contenir au moins 8 caractères, une majuscule,
              un chiffre et un caractère spécial.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmez votre nouveau mot de passe"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Mettre à jour le mot de passe
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function AccountPage() {
  const params = useParams();
  const userId = Number(params?.userId);
  const [userData, setUserData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>(null);
  const [userName, setUserName] = useState<string>("");
    const [authentifie, setAuthentifie] = useState<boolean | null>(true);

  useEffect(() => {
    setAuthentifie(null); // Initialiser à null pour indiquer le chargement
    const fetchUser = async () => {
      const token = localStorage.getItem("auth_token");
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/users/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          setAuthentifie(false); // Utiliser notFound() pour gérer les erreurs 404
        }
        const data = await res.json();
        console.log("Données utilisateur récupérées :", data);
        const { declarations, notifications, ...filtered } = data;
        setUserData(filtered);
        setEditedData(filtered);
        setUserName(filtered.nom || "Utilisateur");
        setAuthentifie(true);
      } catch (error) {
        setAuthentifie(false); // Utiliser notFound() pour gérer les erreurs de récupération
      }
    };

    fetchUser();
  }, [userId]);

    if (authentifie === null) {
    // Affiche un loader ou rien du tout pendant le chargement
    return;
    }

    if (!authentifie) {
    notFound();
    }

  const handleInputChange = (section: string, field: string, value: any) => {
    setEditedData((prev: any) => {
      if (section === "personal") {
        return {
          ...prev,
          [field]: value,
        };
      }
  
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      };
    });
  };

  const handleSectionUpdate = async (section: string) => {
    try {
      let endpoint = "";
      let payload = {};

      if (section === "personal") {
        const token = localStorage.getItem("auth_token");
        const endpoint = await fetch(`http://127.0.0.1:8000/api/users/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        payload = {
          nom: editedData.nom,
          email: editedData.email,
          localite: editedData.localite,
          adresse: editedData.adresse,
          codePostal: editedData.codePostal,
          numeroTelephone: editedData.numeroTelephone,
        };
      } else if (section === "prive") {
        if (!userData.prives) {
          console.warn("La section 'prive' est absente, aucune mise à jour effectuée.");
          return;
        }
        endpoint = `http://127.0.0.1:8000/api/prives/${userData.prives.prive_id}`;
        payload = editedData.prives;
      }

      if (endpoint) {
        await fetch(endpoint, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la section "${section}" :`, error);
      throw error;
    }
  };

  const handleSaveAll = async () => {
    try {
      await handleSectionUpdate("personal");
      await handleSectionUpdate("prive");

      // Envoyer une notification aux administrateurs
      try {
        await NotificationService.createAdminNotification(
          userId,
          `${userName} a mis à jour ses informations personnelles`,
          "user",
          userId,
        )
      } catch (notifError) {
        console.error("Erreur lors de l'envoi de la notification:", notifError)
        // Ne pas bloquer le processus si la notification échoue
      }
  
      alert("Toutes les modifications ont été enregistrées avec succès !");
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des modifications :", error);
      alert("Une erreur est survenue lors de l'enregistrement des modifications.");
    }
  };

  const renderInput = (label: string, id: string, value: any, section: string) => {
    const isBoolean = typeof value === "boolean";
  
    return (
      <div key={id} className="flex flex-col space-y-1">
        <Label htmlFor={id} className="capitalize">
          {label}
        </Label>
  
        {!isEditing ? (
          isBoolean ? (
            <p>{value ? "Oui" : "Non"}</p>
          ) : (
            <p>{value || "—"}</p>
          )
        ) : isBoolean ? (
          <Checkbox
            id={id}
            checked={value}
            onChange={(e) =>
              handleInputChange(section, id, (e.target as HTMLInputElement).checked)
            }
          />
        ) : id === "etatCivil" ? (
          <select
            id={id}
            value={value || ""}
            onChange={(e) =>
              handleInputChange(section, id, e.target.value)
            }
            className="border rounded px-2 py-1"
          >
            <option value="Célibataire">Célibataire</option>
            <option value="Marié(e)">Marié(e)</option>
            <option value="Pacsé(e)">Pacsé(e)</option>
            <option value="Divorcé(e)">Divorcé(e)</option>
            <option value="Veuf/Veuve">Veuf/Veuve</option>
          </select>
        ) : (
          <Input
            id={id}
            value={value || ""}
            onChange={(e) =>
              handleInputChange(section, id, e.target.value)
            }
          />
        )}
      </div>
    );
  };

  const renderSection = (title: string, inputs: JSX.Element[]) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {inputs}
      </CardContent>
    </Card>
  );

  const renderPersonalSection = () => {
    const { role, nom, raisonSociale, email, localite, adresse, codePostal, numeroTelephone } = editedData;

    return renderSection("Informations personnelles", [
      renderInput(
        role === "entreprise" ? "Raison sociale" : "Nom",
        role === "entreprise" ? "raisonSociale" : "nom",
        nom,
        "personal"
      ),
      renderInput("Email", "email", email, "personal"),
      renderInput("Localité", "localite", localite, "personal"),
      renderInput("Adresse", "adresse", adresse, "personal"),
      renderInput("Code postal", "codePostal", codePostal, "personal"),
      renderInput("Téléphone", "numeroTelephone", numeroTelephone, "personal"),
    ]);
  };

  const renderPriveSection = () => {
    const prive = editedData.prives;
    if (!prive) return null;
    return renderSection("Profil privé", [
      renderInput("Date de naissance", "dateNaissance", prive.dateNaissance, "prives"),
      renderInput("Nationalité", "nationalite", prive.nationalite, "prives"),
      renderInput("État civil", "etatCivil", prive.etatCivil, "prives"),
    ]);
  };

  return (
      <div className="flex justify-center px-4 py-8">
        <Tabs defaultValue="account" className="w-full max-w-4xl space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Informations</TabsTrigger>
            <TabsTrigger value="password">Mot de passe</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            {userData && (
              <>
                {renderPersonalSection()}
                {renderPriveSection()}
              </>
            )}
            <div className="flex justify-end gap-4">
              {!isEditing ? (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Modifier
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={handleSaveAll}>
                    Enregistrer
                  </Button>
                  <Button
                    onClick={() => {
                      setEditedData(userData);
                      setIsEditing(false);
                    }}
                  >
                    Annuler
                  </Button>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="password" className="space-y-6">
            <ResetPassword />
          </TabsContent>
        </Tabs>
      </div>
  );
}