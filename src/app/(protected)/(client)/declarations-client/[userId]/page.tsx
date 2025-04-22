// Mise à jour de `page.tsx` pour utiliser `RubriqueAccordionItem`

"use client";

import { useEffect, useState } from "react";
import { Declaration, Prive, Rubrique } from "@/types/interfaces";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { toast, Toaster } from "sonner";
import ProtectedRoutePrive from "@/components/routes/ProtectedRouteApproved";
import { useParams } from "next/navigation";
import { foFields } from "@/utils/foFields";
import { getStatusBadge } from "@/utils/getStatusBadge";
import YearSelector from "@/components/protected/declarations-client/features/selector/YearSelector";
import RubriqueAccordionItem from "@/components/protected/declarations-client/features/documents/RubriqueAccordionItem";

export default function DeclarationsClientPage() {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [declaration, setDeclaration] = useState<Declaration | null>(null);
  const [userDeclarations, setUserDeclarations] = useState<Declaration[]>([]);
  const [declarationYears, setDeclarationYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastShown, setToastShown] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<
    { file: File; rubriqueId: number }[]
  >([]);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedRubriques, setUploadedRubriques] = useState<number[]>([]);
  const params = useParams();
  const userId = Number(params?.userId);

  useEffect(() => {
    const fetchDeclarations = async () => {
      if (!userId) return;
      try {
        const res = await fetch(`http://localhost:8000/api/users/${userId}`);
        const data = await res.json();
        const declarations = data.declarations || [];
        setUserDeclarations(declarations);
        const years = declarations.map((d: Declaration) => d.annee);
        setDeclarationYears(years);
        if (years.length > 0) setSelectedYear(years.sort().reverse()[0]);
      } catch (err) {
        toast.error("Erreur lors du chargement des déclarations");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeclarations();
  }, [userId]);

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

        const existingTitles = new Set(
          (data.rubriques || []).map((r: Rubrique) =>
            r.titre.trim().toLowerCase()
          )
        );

        const createdRubriques = [];
        const priveRes = await fetch("http://localhost:8000/api/prives");
        const prives: Prive[] = await priveRes.json();
        const userPrive = prives.find((p) => p.user_id === userId);

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
              "http://localhost:8000/api/rubriques",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  declaration_id: data.declaration_id,
                  titre: rubriqueInfo.titre,
                  description: rubriqueInfo.description,
                }),
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

  const handleYearChange = (year: number) => setSelectedYear(year.toString());

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
      toast.success(`${documents.length} documents enregistrés.`);
      setSelectedFiles([]);
      await refreshDeclaration();
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !userId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement...</span>
      </div>
    );
  }

  return (
    <ProtectedRoutePrive>
      <Toaster position="bottom-right" richColors closeButton />
      <div className="px-10">
        <h2 className="text-lg font-semibold px-2">Année de la déclaration</h2>
        <YearSelector
          years={declarationYears}
          selectedYear={selectedYear ?? ""}
          onYearChange={handleYearChange}
          className="w-full"
        />
      </div>

      <div className="p-10 pt-5">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{declaration?.titre}</h1>
          {declaration?.statut && getStatusBadge(declaration.statut)}
        </div>

        {declaration?.rubriques?.length ? (
          <Accordion type="multiple" className="w-full">
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
        ) : (
          <p className="text-center text-gray-500 py-8">
            Aucune rubrique trouvée pour cette déclaration
          </p>
        )}

        {selectedFiles.length > 0 && (
          <div className="fixed bottom-8 right-8 flex items-center gap-2 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
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
    </ProtectedRoutePrive>
  );
}
