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
import ProtectedRoutePending from "@/components/routes/ProtectedRoutePending";
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

  const handleInputChange = (section: string, field: string, value: any) => {
    setEditedData((prev: any) => {
      // Cas d'un champ racine (ex: "personal")
      if (section === "personal") {
        return {
          ...prev,
          [field]: value,
        };
      }
  
      // Cas d'un champ imbriqué (ex: "prive", "entreprise")
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
        endpoint = `http://127.0.0.1:8000/api/users/${userId}`;
        payload = {
          nom: editedData.nom,
          email: editedData.email,
          localite: editedData.localite,
          adresse: editedData.adresse,
          codePostal: editedData.codePostal,
          numeroTelephone: editedData.numeroTelephone,
        };
      } else if (section === "prive") {
        // Vérifiez si la section `prive` existe avant de continuer
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
      throw error; // Propager l'erreur pour la gérer dans `handleSaveAll`
    }
  };

  const handleSaveAll = async () => {
    try {
      // Mettre à jour les sections nécessaires
      await handleSectionUpdate("personal");
      await handleSectionUpdate("prive");
  
      // Afficher une seule notification après toutes les mises à jour
      alert("Toutes les modifications ont été enregistrées avec succès !");
      setIsEditing(false); // Quitter le mode édition
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
    <ProtectedRoutePending>
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
      <Button
        variant="outline"
        onClick={handleSaveAll} // Appeler la fonction regroupée
      >
        Enregistrer
      </Button>
      <Button
        onClick={() => {
          setEditedData(userData); // Réinitialiser les données
          setIsEditing(false);     // Quitter le mode édition
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
    </ProtectedRoutePending>
  );
}
