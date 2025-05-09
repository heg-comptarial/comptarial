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

export default function AccountPage() {
  const params = useParams();
  const userId = Number(params?.userId);
  const [userData, setUserData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>(null);

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
        </Tabs>
      </div>
    </ProtectedRouteAdmin>
  );
}
