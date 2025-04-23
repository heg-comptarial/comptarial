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

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`http://localhost:8000/api/users/${userId}`);
      const data = await res.json();
      const { declarations, notifications, ...filtered } = data;
      setUserData(filtered);
    };

    if (userId) fetchUser();
  }, [userId]);

  const renderInput = (label: string, id: string, value: any) => {
    const isBoolean = typeof value === "boolean";

    return (
      <div key={id} className="flex flex-col space-y-1">
        <Label htmlFor={id} className="capitalize">
          {label}
        </Label>
        {isBoolean ? (
          <Checkbox id={id} checked={value} disabled />
        ) : (
          <Input id={id} defaultValue={String(value)} readOnly />
        )}
      </div>
    );
  };

  const renderPersonalSection = () => {
    const {
      nom,
      email,
      localite,
      adresse,
      codePostal,
      numeroTelephone,
    } = userData;
    return renderSection("Informations personnelles", [
      renderInput("Nom", "nom", nom),
      renderInput("Email", "email", email),
      renderInput("Localité", "localite", localite),
      renderInput("Adresse", "adresse", adresse),
      renderInput("Code postal", "codePostal", codePostal),
      renderInput("Téléphone", "numeroTelephone", numeroTelephone),
    ]);
  };

  const renderEntrepriseSection = () => {
    const entreprise = userData.entreprises;
    if (!entreprise) return null;
    return renderSection("Entreprise", [
      renderInput("Raison sociale", "raisonSociale", entreprise.raisonSociale),
      renderInput("Prestations", "prestations", entreprise.prestations),
      renderInput("Grand livre", "grandLivre", entreprise.grandLivre),
      renderInput("Numéro fiscal", "numeroFiscal", entreprise.numeroFiscal),
    ]);
  };

  const renderPriveSection = () => {
    const prive = userData.prives;
    if (!prive) return null;
    return renderSection("Profil privé", [
      renderInput("Date de naissance", "dateNaissance", prive.dateNaissance),
      renderInput("Nationalité", "nationalite", prive.nationalite),
      renderInput("État civil", "etatCivil", prive.etatCivil),
      renderInput("Banques", "fo_banques", prive.fo_banques),
      renderInput("Dettes", "fo_dettes", prive.fo_dettes),
      renderInput("Biens immobiliers", "fo_immobiliers", prive.fo_immobiliers),
      renderInput("Salarié", "fo_salarie", prive.fo_salarie),
      renderInput(
        "Autres personnes à charge",
        "fo_autrePersonneCharge",
        prive.fo_autrePersonneCharge
      ),
      renderInput("Indépendant", "fo_independant", prive.fo_independant),
      renderInput("Rentier", "fo_rentier", prive.fo_rentier),
      renderInput("Autre revenu", "fo_autreRevenu", prive.fo_autreRevenu),
      renderInput("Assurance", "fo_assurance", prive.fo_assurance),
      renderInput("Autres déductions", "fo_autreDeduction", prive.fo_autreDeduction),
      renderInput("Autres informations", "fo_autreInformations", prive.fo_autreInformations),
    ]);
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
                {renderEntrepriseSection()}
                {renderPriveSection()}
              </>
            )}
            <div className="flex justify-end">
              <Button>Enregistrer les modifications</Button>
            </div>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Changer le mot de passe</CardTitle>
                <CardDescription>
                  Une fois le mot de passe changé, vous serez déconnecté.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="current">Mot de passe actuel</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">Nouveau mot de passe</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Enregistrer</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoutePending>
  );
}
