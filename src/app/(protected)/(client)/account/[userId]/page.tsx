"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { Utilisateur } from "@/types/interfaces";
import { toast, Toaster } from "sonner";

export default function AccountPage() {
  const params = useParams();
  const userId = Number(params?.userId);
  const [userData, setUserData] = useState<Utilisateur | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Utilisateur | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [authentifie, setAuthentifie] = useState<boolean | null>(null);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setAuthentifie(false);
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/users/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        setAuthentifie(false);
        return;
      }
      const data = await res.json();
      setUserData(data);
      setEditedData(data);
      setAuthentifie(true);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données utilisateur :",
        error
      );
      setAuthentifie(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId, fetchUser]);

  // Bloc d'authentification à placer juste avant le rendu
  if (authentifie === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!authentifie) {
    return notFound();
  }

  const handleInputChange = <K extends keyof Utilisateur>(
    field: K,
    value: Utilisateur[K]
  ) => {
    setEditedData((prev) =>
      prev
        ? {
            ...prev,
            [field]: value,
          }
        : null
    );
  };

  const handleSectionUpdate = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Token d'authentification manquant");
    }

    const endpoint = `http://127.0.0.1:8000/api/users/${userId}`;
    const payload = {
      nom: editedData?.nom,
      email: editedData?.email,
      localite: editedData?.localite,
      adresse: editedData?.adresse,
      codePostal: editedData?.codePostal,
      numeroTelephone: editedData?.numeroTelephone,
    };

    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const updatedUser = await handleSectionUpdate();

      // Mettre à jour les données locales avec la réponse du serveur
      setUserData(updatedUser);
      setEditedData(updatedUser);

      toast.success(
        "Toutes les modifications ont été enregistrées avec succès !"
      );
      setIsEditing(false);

      await fetchUser();
      window.location.reload();
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement des modifications :",
        error
      );
      toast.error(
        `Une erreur est survenue lors de l'enregistrement des modifications: ${error}`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("auth_token");
    if (!token) {
      toast.error("Token d'authentification manquant");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Vérification de l'ancien mot de passe auprès de l'API
      const check = await fetch(
        "http://127.0.0.1:8000/api/users/check-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: userId,
            currentPassword,
          }),
        }
      );

      if (!check.ok) {
        toast.error("Mot de passe actuel incorrect");
        return;
      }

      // 2. Vérification : nouveau mot de passe différent de l'ancien
      if (currentPassword === newPassword) {
        toast.error("Le nouveau mot de passe doit être différent de l'ancien");
        return;
      }

      // 3. Vérification : confirmation
      if (newPassword !== confirmPassword) {
        toast.error("Les nouveaux mots de passe ne correspondent pas");
        return;
      }

      // 4. Vérification : complexité du mot de passe
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        toast.error(
          "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial."
        );
        return;
      }

      // 5. Changement du mot de passe
      const update = await fetch(
        "http://127.0.0.1:8000/api/users/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: userId,
            newPassword,
          }),
        }
      );

      if (!update.ok) {
        toast.error(
          "Une erreur est survenue lors de la mise à jour du mot de passe"
        );
        return;
      }

      toast.success("Mot de passe mis à jour avec succès !");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Erreur:", err);
      toast.error(
        `Une erreur est survenue lors du changement de mot de passe: ${err}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedData(userData); // Réinitialiser les données
    setIsEditing(false); // Quitter le mode édition
  };

  const renderInput = (
    label: string,
    id: string,
    value: string | number | undefined
  ) => {
    return (
      <div key={id} className="flex flex-col space-y-1">
        <Label htmlFor={id} className="capitalize">
          {label}
        </Label>
        {!isEditing ? (
          <p className="py-2 px-3 bg-gray-50 rounded-md min-h-[40px] flex items-center">
            {value || "—"}
          </p>
        ) : (
          <Input
            id={id}
            value={value || ""}
            onChange={(e) =>
              handleInputChange(id as keyof Utilisateur, e.target.value)
            }
          />
        )}
      </div>
    );
  };

  const renderPersonalSection = () => {
    if (!editedData) return null;

    const { nom, email, localite, adresse, codePostal, numeroTelephone } =
      editedData;

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
              Le mot de passe doit contenir au moins 8 caractères, une
              majuscule, un chiffre et un caractère spécial.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Confirmer le nouveau mot de passe
            </Label>
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
    <div className="flex justify-center px-4 py-8">
      <Toaster position="bottom-right" richColors closeButton />
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
                <Button
                  variant="outline"
                  onClick={handleSaveAll}
                  disabled={isSaving}
                >
                  {isSaving ? "Enregistrement..." : "Enregistrer"}
                </Button>
                <Button onClick={handleCancelEdit} disabled={isSaving}>
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
  );
}
