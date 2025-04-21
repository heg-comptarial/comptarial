"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import axios from "axios";
import dynamic from "next/dynamic";
import { FormDataType } from "@/types/interfaces";
import ProtectedRoutePrive from "@/components/routes/ProtectedRouteApprovedPrive";
import { useParams } from "next/navigation";

const FormulaireDeclaration = dynamic(() => import("../../formulaire/[userId]/page"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  ),
});

type Declaration = {
  declaration_id: number;
  annee: string;
  [key: string]: unknown;
};

export default function NouvelleDeclaration() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priveId, setPriveId] = useState<number | null>(null);
  const [hasDeclaration, setHasDeclaration] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [hasChanges, setHasChanges] = useState<string | null>(null);
  const params = useParams()
  const userId = Number(params?.userId)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          router.push("/connexion");
          return;
        }

        if (!userId) {
          router.push("/connexion");
          return;
        }

        const priveResponse = await axios.get(
          `http://127.0.0.1:8000/api/prives/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        if (priveResponse.data && priveResponse.data.prive_id) {
          setPriveId(priveResponse.data.prive_id);

          const declarationsResponse = await axios.get(
            `http://127.0.0.1:8000/api/users/${userId}/declarations`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const currentYear = new Date().getFullYear().toString();
          const existingForYear = declarationsResponse.data.find(
            (d: Declaration) => d.annee === currentYear
          );

          if (existingForYear) {
            setError(
              `Vous avez déjà une déclaration pour l'année ${currentYear}.`
            );
            return;
          }

          if (declarationsResponse.data.length > 0) {
            setHasDeclaration(true);
          }
        }
      } catch (err) {
        // Assertion de type pour indiquer que err est une erreur Axios
        if (axios.isAxiosError(err) && err.response && err.response.status === 404) {
          console.log("Erreur 404 : L'utilisateur n'a pas été trouvé. Le compte est peut-être en attente d'approbation.");
          setError("Votre compte n'as pas été encore approuvé par l'admin");
        }else{
              console.error("Erreur lors de la récupération des données:", err);
              setError(
                "Impossible de récupérer vos informations. Veuillez vous reconnecter."
              );
            }} finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleChangesChoice = (value: string) => {
    setHasChanges(value);
    if (value === "oui") setShowForm(true);
  };

  const createDeclaration = async (formData: FormDataType) => {
    try {
      const token = localStorage.getItem("auth_token");

      if (!token || !userId) {
        throw new Error("Authentification requise");
      }

      const currentYear = new Date().getFullYear().toString();

      const existingResponse = await axios.get(
        `http://127.0.0.1:8000/api/users/${userId}/declarations`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const alreadyExists = existingResponse.data.some(
        (decl: Declaration) => decl.annee === currentYear
      );

      if (alreadyExists) {
        setError(`Vous avez déjà une déclaration pour l'année ${currentYear}.`);
        return false;
      }

      const declarationData = {
        ...formData,
        user_id: userId,
        titre: `Déclaration ${currentYear}`,
        statut: "pending",
        annee: currentYear,
        dateCreation: new Date().toISOString(),
        
      };

      await axios.post(
        "http://127.0.0.1:8000/api/declarations",
        declarationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      router.push("/declarations-client");
    } catch (error: unknown) {
      console.error("Erreur création déclaration:", error);
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setError(error.response.data.message);
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
      return false;
    }

    return true;
  };

  // ✅ CORRECTION : Créer déclaration uniquement 1x
  useEffect(() => {
    const createNewDeclarationFromPrive = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token || !priveId) {
          router.push("/connexion");
          return;
        }

        const response = await axios.get(
          `http://127.0.0.1:8000/api/prives/${priveId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data) {
          await createDeclaration(response.data);
        }
      } catch (error) {
        console.error("Erreur récupération privé:", error);
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    };

    if (hasChanges === "non" && priveId) {
      createNewDeclarationFromPrive();
    }
  }, [hasChanges, priveId, router]);

  // === RENDER ===

  if (isLoading) {
    return (
      <ProtectedRoutePrive>
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
      </ProtectedRoutePrive>
    );
  }

  if (error) {
    return (
      <ProtectedRoutePrive>
      <div className="w-full px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-500">
              Erreur
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button className="mt-4" onClick={() => router.push("/dashboard")}>
              Retour au tableau de bord
            </Button>
          </CardContent>
        </Card>
      </div>
      </ProtectedRoutePrive>
    );
  }

  if (!hasDeclaration && !showForm) {
    return (
      <ProtectedRoutePrive>
      <div className="w-full px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Nouvelle déclaration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6">
              Bienvenue ! Comme c&apos;est votre première déclaration, nous
              allons vous guider à travers le processus.
            </p>
            <Button onClick={() => setShowForm(true)} className="w-full">
              Commencer ma déclaration
            </Button>
          </CardContent>
        </Card>
      </div>
      </ProtectedRoutePrive>
    );
  }

  if (hasDeclaration && hasChanges === null && !showForm) {
    return (
      <ProtectedRoutePrive>
      <div className="w-full px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Nouvelle déclaration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6">
              Avez-vous eu des changements dans votre situation par rapport à
              l&apos;année précédente ?
            </p>
            <RadioGroup className="space-y-4 mb-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="oui"
                  id="oui"
                  onClick={() => handleChangesChoice("oui")}
                />
                <Label htmlFor="oui">Oui, ma situation a changé</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="non"
                  id="non"
                  onClick={() => handleChangesChoice("non")}
                />
                <Label htmlFor="non">Non, ma situation est identique</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
      </ProtectedRoutePrive>
    );
  }

  if (hasChanges === "non" && priveId) {
    return (
      <ProtectedRoutePrive>
      <div className="w-full px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Création de votre déclaration
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Création de votre nouvelle déclaration en cours...</p>
          </CardContent>
        </Card>
      </div>
      </ProtectedRoutePrive>
    );
  }

  if (showForm) {
    return (
      <ProtectedRoutePrive>
      <>
        {hasDeclaration && (
          <div className="w-full px-4 py-8">
            <Card className="bg-blue-50">
              <CardContent className="pt-4">
                <p className="text-blue-700">
                  <strong>Note :</strong> Le formulaire sera pré-rempli avec vos
                  informations existantes. Vous pourrez les modifier.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
        <FormulaireDeclaration
          onSubmitSuccess={createDeclaration}
          priveId={priveId}
        />
      </>
      </ProtectedRoutePrive>
    );
  }

  return (
    <ProtectedRoutePrive>
    <div className="w-full px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Erreur inattendue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Une erreur inattendue s&apos;est produite. Veuillez réessayer.</p>
          <Button className="mt-4" onClick={() => router.push("/dashboard")}>
            Retour au tableau de bord
          </Button>
        </CardContent>
      </Card>
    </div>
    </ProtectedRoutePrive>
  );
}
