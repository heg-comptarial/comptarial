"use client";

import { JSX, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProtectedRouteAdmin from "@/components/routes/ProtectedRouteAdmin";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();
  const params = useParams();
  const userId = Number(params?.userId);
  const [userData, setUserData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`http://127.0.0.1:8000/api/users/${userId}`);
      const data = await res.json();
      const { declarations, notifications, ...filtered } = data;
      setUserData(filtered);
      setEditedData(filtered);
    };

    fetchUser();
  }, [userId]);

  const handleInputChange = (field: string, value: any) => {
    setEditedData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSectionUpdate = async () => {
    try {
      const endpoint = `http://127.0.0.1:8000/api/users/${userId}`;
      const payload = {
        nom: editedData.nom,
        email: editedData.email,
        localite: editedData.localite,
        adresse: editedData.adresse,
        codePostal: editedData.codePostal,
        numeroTelephone: editedData.numeroTelephone,
      };

      await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour des informations :", error);
      alert("Une erreur est survenue lors de l'enregistrement des modifications.");
    }
  };

  const handleSaveAll = async () => {
    try {
      await handleSectionUpdate();
      alert("Toutes les modifications ont été enregistrées avec succès !");
      setIsEditing(false); // Quitter le mode édition
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des modifications :", error);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("auth_token");
    if (!token) {
      alert("Token manquant");
      return;
    }
    setIsLoading(true);

    try {
      // 1. Vérification de l'ancien mot de passe auprès de l'API
      const check = await fetch("http://127.0.0.1:8000/api/users/check-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          currentPassword,
        }),
      });
      if (!check.ok) {
        alert("Mot de passe actuel incorrect");
        setIsLoading(false);
        return;
      }

      // 2. Vérification : nouveau mot de passe différent de l'ancien
      if (currentPassword === newPassword) {
        alert("Le nouveau mot de passe doit être différent de l'ancien.");
        setIsLoading(false);
        return;
      }

      // 3. Vérification : confirmation
      if (newPassword !== confirmPassword) {
        alert("Les nouveaux mots de passe ne correspondent pas");
        setIsLoading(false);
        return;
      }

      // 4. Vérification : complexité du mot de passe
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        alert(
          "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial."
        );
        setIsLoading(false);
        return;
      }

      // 5. Changement du mot de passe
      const update = await fetch("http://127.0.0.1:8000/api/users/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          newPassword,
        }),
      });
      if (!update.ok) {
        alert("Erreur lors de la mise à jour du mot de passe");
        setIsLoading(false);
        return;
      }
      alert("Mot de passe mis à jour avec succès !");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      router.push(`/admin/${userId}`);
    } catch (err) {
      console.error("Erreur:", err);
      alert("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (label: string, id: string, value: any) => {
    return (
      <div key={id} className="flex flex-col space-y-1">
        <Label htmlFor={id} className="capitalize">
          {label}
        </Label>
        {!isEditing ? (
          <p>{value || "—"}</p>
        ) : (
          <Input
            id={id}
            value={value || ""}
            onChange={(e) => handleInputChange(id, e.target.value)}
          />
        )}
      </div>
    );
  };

  const renderPersonalSection = () => {
    const { nom, email, localite, adresse, codePostal, numeroTelephone } = editedData;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput("Nom", "nom", nom)}
          {renderInput("Email", "email", email)}
          {renderInput("Localité", "localite", localite)}
          {renderInput("Adresse", "adresse", adresse)}
          {renderInput("Code postal", "codePostal", codePostal)}
          {renderInput("Téléphone", "numeroTelephone", numeroTelephone)}
        </CardContent>
      </Card>
    );
  };

  const renderPasswordSection = () => (
    <Card>
      <CardHeader>
        <CardTitle>Changer le mot de passe</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Mot de passe actuel</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Entrez le mot de passe actuel"
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
              placeholder="Entrez le nouveau mot de passe"
              required
            />
            <p className="text-xs text-gray-500">
              Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmez le nouveau mot de passe"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  return (
    <ProtectedRouteAdmin>
      <div className="flex justify-center px-4 py-8">
        <Tabs defaultValue="account" className="w-full max-w-4xl space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Informations</TabsTrigger>
            <TabsTrigger value="password">Mot de passe</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            {userData && renderPersonalSection()}
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
                      setEditedData(userData); // Réinitialiser les données
                      setIsEditing(false); // Quitter le mode édition
                    }}
                  >
                    Annuler
                  </Button>
                </>
              )}
            </div>
          </TabsContent>
          <TabsContent value="password" className="space-y-6">
            {renderPasswordSection()}
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRouteAdmin>
  );
}
