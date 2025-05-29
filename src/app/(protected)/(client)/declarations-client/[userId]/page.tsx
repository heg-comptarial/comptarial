"use client";

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Declaration, Prive, Rubrique } from "@/types/interfaces";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { foFields } from "@/utils/foFields";
import { getStatusBadge } from "@/utils/getStatusBadge";
import YearSelector from "@/components/protected/declarations-client/features/selector/YearSelector";
import RubriqueAccordionItem from "@/components/protected/declarations-client/features/documents/RubriqueAccordionItem";
import dynamic from "next/dynamic";
import router from "next/router";
import { useYearStore } from "@/store/useYear";

export default function DeclarationsClientPage() {
  //const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [declaration, setDeclaration] = useState<Declaration | null>(null);
  const [userDeclarations, setUserDeclarations] = useState<Declaration[]>([]);
  const [declarationYears, setDeclarationYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastShown, setToastShown] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<
    { file: File; rubriqueId: number }[]
  >([]);
  const [priveId, setPriveId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedRubriques, setUploadedRubriques] = useState<number[]>([]);
  const [userName, setUserName] = useState<string>("")
  const [authentifie, setAuthentifie] = useState<boolean | null>(null);

  const params = useParams();
  const searchParams = useSearchParams();
  const userId = Number(params?.userId);
  const typeFromUrl = searchParams.get("type");
  const [role, setRole] = useState<"prive" | "entreprise" | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const selectedYear = useYearStore((state) => state.selectedYear);
  const setSelectedYear = useYearStore((state) => state.setSelectedYear);

  const FormulaireDeclaration = dynamic(
    () => import("../../formulaire/[userId]/page"),
    {
      ssr: false,
      loading: () => (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ),
    }
  );

  useEffect(() => {
    const fetchDeclarations = async () => {
      if (!userId) return;
      setAuthentifie(null); // loading
      try {
        const token = localStorage.getItem("auth_token");
        const { data } = await axios.get(
          `http://localhost:8000/api/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        const declarations = data.declarations || [];
        const userRole = data.role as "prive" | "entreprise" | null;
        setRole(userRole);

        setUserName(data.nom || "Utilisateur");

        const filteredDeclarations =
          userRole === "entreprise" && typeFromUrl
            ? declarations.filter((d: Declaration) => d.titre === typeFromUrl)
            : declarations;

        setUserDeclarations(filteredDeclarations);

        const years = filteredDeclarations.map((d: Declaration) => d.annee);
        setDeclarationYears(years);

        if (years.length > 0) {
          setSelectedYear(years.sort().reverse()[0]);
        }
        setAuthentifie(true);
      } catch (err) {
        setAuthentifie(false);
        toast.error("Erreur lors du chargement des déclarations");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeclarations();
  }, [userId, typeFromUrl]);

  useEffect(() => {
    const fetchRubriques = async () => {
      if (!selectedYear || !userId) return;
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8000/api/users/${userId}/declarations/year/${selectedYear}`
        );
        if (!res.ok) throw new Error("Déclaration non trouvée");
        const data = await res.json();

        if (data.rubriques && data.rubriques.length > 0) {
          const fullRes = await fetch(
            `http://localhost:8000/api/users/${userId}/declarations/${data.declaration_id}`
          );
          const fullData = await fullRes.json();
          setDeclaration(fullData);

          setUploadedRubriques(
            fullData.rubriques
              .filter((r: Rubrique) => (r.documents ?? []).length > 0)
              .map((r: Rubrique) => r.rubrique_id)
          );
          setLoading(false);
          return;
        }

        const existingTitles = new Set(
          (data.rubriques || []).map((r: Rubrique) =>
            r.titre.trim().toLowerCase()
          )
        );

        const createdRubriques = [];
        const priveRes = await fetch("http://localhost:8000/api/prives");
        const prives: Prive[] = await priveRes.json();
        const userPrive = prives.find((p) => p.user_id === userId);

        console.log(data.declaration_id);

        for (const [field, value] of Object.entries(userPrive || {})) {
          if (
            field.startsWith("fo_") &&
            value === true &&
            foFields[field as keyof typeof foFields]
          ) {
            const rubriqueInfo = foFields[field as keyof typeof foFields];
            const titre = rubriqueInfo.titre.trim().toLowerCase();
            if (existingTitles.has(titre)) continue;
            const createRes = await fetch(
              `http://localhost:8000/api/rubriques?declaration_id=${data.declaration_id}}`,
              {
                method: "GET",
                headers: { "Content-Type": "application/json" },
              }
            );

            if (createRes.ok) createdRubriques.push(await createRes.json());
          }
        }

        const finalRes = await fetch(
          `http://localhost:8000/api/users/${userId}/declarations/${data.declaration_id}`
        );
        const finalData = await finalRes.json();
        setDeclaration(finalData);
        setUploadedRubriques(
          finalData.rubriques
            .filter((r: Rubrique) => r.documents && r.documents.length > 0)
            .map((r: Rubrique) => r.rubrique_id)
        );
        setToastShown(true);
      } catch (err) {
        toast.error("Erreur lors du chargement des rubriques");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRubriques();
  }, [selectedYear, userDeclarations, userId]);

  useEffect(() => {
    if (!loading && toastShown && declaration?.rubriques?.length) {
      toast.success(`${declaration.rubriques.length} rubriques chargées.`);
      setToastShown(false);
    }
  }, [loading, toastShown, declaration]);

  useEffect(() => {
    const fetchPriveId = async () => {
      try {
        const token = localStorage.getItem("auth_token");

        if (!token || !userId) {
          router.push("/connexion");
          return;
        }

        const response = await axios.get(
          `http://127.0.0.1:8000/api/prives/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        if (response.data?.prive_id) {
          setPriveId(response.data.prive_id);
        } else {
          setError("Identifiant privé introuvable.");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération du privé:", err);
        setError("Erreur de récupération du privé.");
      } finally {
        setLoading(false);
      }
    };

    fetchPriveId();
  }, [userId, router]);

  const handleYearChange = (year: number) => {
    setSelectedYear(year.toString());
    setShowForm(false); // Ferme le formulaire lors du changement
  };
  const handleFilesSelected = (rubriqueId: number, files: File[]) => {
    setSelectedFiles((prev) => [
      ...prev,
      ...files.map((file) => ({ file, rubriqueId })),
    ]);
  };

  const handleFileRemoved = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.filter((f) => f.file.name + f.file.size !== fileId)
    );
  };

  const refreshDeclaration = async () => {
    if (userId && declaration?.declaration_id) {
      const refreshedRes = await fetch(
        `http://localhost:8000/api/users/${userId}/declarations/${declaration.declaration_id}`
      );
      if (refreshedRes.ok) {
        const refreshedData = await refreshedRes.json();
        setDeclaration(refreshedData);
        const uploadedIds = (refreshedData.rubriques as Rubrique[])
          .filter((r) => r.documents && r.documents.length > 0)
          .map((r) => r.rubrique_id);
        setUploadedRubriques(uploadedIds);
      }
    }
  };
  const handleCloseForm = () => {
    console.log("handleCloseForm appelé");

    refreshDeclaration(); // recharge les données si nécessaire
    setShowForm(false); // referme le formulaire
  };

  const uploadAndSaveDocuments = async () => {
    if (selectedFiles.length === 0)
      return toast.warning("Aucun fichier sélectionné");
    setIsSaving(true);
    try {
      const documents = await Promise.all(
        selectedFiles.map(async ({ file, rubriqueId }) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("year", declaration?.annee || "");
          formData.append("userId", userId.toString());
          formData.append("rubriqueId", rubriqueId.toString());
          formData.append(
            "rubriqueName",
            declaration?.rubriques.find((r) => r.rubrique_id === rubriqueId)
              ?.titre || ""
          );

          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          if (!res.ok) throw new Error(await res.text());

          const result = await res.json();
          return {
            rubrique_id: rubriqueId,
            nom: result.fileName,
            type: result.fileType.split("/").pop() || "other",
            cheminFichier: result.url,
            statut: "pending",
            sous_rubrique: "default",
            fileSize: file.size,
          };
        })
      );

      const saveRes = await fetch("http://localhost:8000/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documents }),
      });

      if (!saveRes.ok) throw new Error(await saveRes.text());

      const savedDocuments = await saveRes.json();

      // Envoyer une notification pour chaque document
      if (savedDocuments && savedDocuments.documents) {
        for (const doc of savedDocuments.documents) {
          try {
            // Utiliser directement l'API pour envoyer la notification
            const notifRes = await fetch(
              "http://localhost:8000/api/notifications/admin",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  user_id: userId,
                  contenu: `${userName} a téléchargé un nouveau document: ${doc.nom}`,
                  resource_type: "document",
                  resource_id: doc.doc_id,
                }),
              }
            );

            if (!notifRes.ok) {
              console.error(
                "Erreur lors de l'envoi de la notification:",
                await notifRes.text()
              );
            } else {
              console.log(
                "Notification envoyée avec succès:",
                await notifRes.json()
              );
            }
          } catch (error) {
            console.error("Erreur lors de l'envoi de la notification:", error);
          }
        }
      }

      toast.success(`${documents.length} documents enregistrés.`);
      setSelectedFiles([]);
      document
        .querySelectorAll("[data-hide-uploader]")
        .forEach((el) => el.dispatchEvent(new CustomEvent("closeUploader")));
      await refreshDeclaration();

      // Envoi du mail de notification à l'administrateur
      await fetch(
        `http://localhost:8000/api/declarations/${userId}/${declaration?.declaration_id}/notify-update`,
        {
          method: "POST",
        }
      );
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
    }
  };

  if (authentifie === null || loading || !userId) {
    return;
  }

  if (!authentifie) {
    notFound();
    return null;
  }

  if (userDeclarations.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <h2 className="text-xl font-semibold mb-4">
          Aucune déclaration trouvée
        </h2>
        <p className="text-gray-600 max-w-md">
          Vous n’avez pas encore créé de déclaration. Veuillez en créer une
          nouvelle pour commencer.
        </p>
        <Link href={`/new-declaration/${userId}`}>
          <Button className="mt-6">Créer une nouvelle déclaration</Button>
        </Link>
      </div>
    );
  }

  if (
    role === "entreprise" &&
    (!typeFromUrl || userDeclarations.length === 0)
  ) {
    return (
      <div className="flex items-center justify-center h-screen text-center">
        <p className="text-lg text-muted-foreground">
          Aucune déclaration trouvée pour le type :{" "}
          <strong>{typeFromUrl}</strong>
        </p>
      </div>
    );
  }

  return (
    <div>
      <Toaster position="bottom-right" richColors closeButton />
      <div className="px-4 sm:px-6 md:px-10">
        <h2 className="text-lg font-semibold px-2">Année de la déclaration</h2>
        <YearSelector
          years={declarationYears}
          selectedYear={selectedYear ?? ""}
          onYearChange={handleYearChange}
          className="w-full"
        />
      </div>

      <div className="px-4 pt-5 sm:px-6 md:px-10">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">
            {declaration?.titre}
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            {declaration?.statut && getStatusBadge(declaration.statut)}
            {declaration?.statut === "pending" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowForm(!showForm)}
                className="w-full sm:w-auto"
              >
                {showForm
                  ? "Fermer"
                  : "Modifier les informations du formulaire"}
              </Button>
            )}
          </div>
        </div>
        {showForm && declaration?.statut === "pending" && (
          <div className="my-6">
            <FormulaireDeclaration
              mode="edit"
              priveId={priveId}
              onSubmitSuccess={async () => {
                try {
                  await refreshDeclaration();
                  setShowForm(false);
                  toast.success("Formulaire soumis avec succès");
                  return true;
                } catch (error) {
                  console.error(
                    "Erreur lors de la fermeture du formulaire:",
                    error
                  );
                  return false;
                }
              }}
            />
          </div>
        )}

        {/* Affichage du montant des impôts */}
        {declaration?.impots && (
          <p className="text-lg text-muted-foreground">
            Montant des impôts :{" "}
            <span className="font-semibold">{declaration.impots}</span>
          </p>
        )}

        {declaration?.rubriques?.length ? (
          <div className="overflow-x-auto">
            <Accordion
              type="multiple"
              defaultValue={declaration.rubriques
                .filter((rubrique) => (rubrique.documents ?? []).length > 0)
                .map((rubrique) => `rubrique-${rubrique.rubrique_id}`)}
              className="w-full"
            >
              {declaration.rubriques.map((rubrique) => (
                <RubriqueAccordionItem
                  key={rubrique.rubrique_id}
                  rubrique={rubrique}
                  declarationStatus={declaration?.statut ?? "pending"}
                  uploadedRubriques={uploadedRubriques}
                  onFilesSelected={handleFilesSelected}
                  onFileRemoved={handleFileRemoved}
                  onUploadCompleted={refreshDeclaration}
                  userId={userId}
                  year={declaration.annee}
                />
              ))}
            </Accordion>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            Aucune rubrique trouvée pour cette déclaration
          </p>
        )}

        {selectedFiles.length > 0 && (
          <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-8 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-50">
            <span className="text-sm font-medium">
              {selectedFiles.length} document
              {selectedFiles.length > 1 ? "s" : ""} prêt
              {selectedFiles.length > 1 ? "s" : ""} à enregistrer
            </span>
            <Button
              onClick={uploadAndSaveDocuments}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Enregistrer les documents
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
