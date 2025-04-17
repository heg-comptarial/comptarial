"use client";

import { useEffect, useState } from "react";
import { Declaration, Prive, Rubrique } from "@/types/interfaces";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { toast, Toaster } from "sonner";
import { DocumentUpload } from "@/components/protected/declaration-client/document-upload";
import { DocumentList } from "@/components/protected/declaration-client/document-list";
import { foFields } from "@/utils/foFields";
import YearSelector from "@/components/YearSelector";
import ProtectedRoutePrive from "@/components/routes/ProtectedRoutePrive";

export default function DeclarationsClientPage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [declaration, setDeclaration] = useState<Declaration | null>(null);
  const [userDeclarations, setUserDeclarations] = useState<Declaration[]>([]);
  const [declarationYears, setDeclarationYears] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toastShown, setToastShown] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<
    { file: File; rubriqueId: number }[]
  >([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [uploadedRubriques, setUploadedRubriques] = useState<number[]>([]);

  // ✅ Safely read userId from localStorage
  useEffect(() => {
    const storedId = localStorage.getItem("user_id");
    if (storedId) {
      setUserId(Number(storedId));
    } else {
      setError("Utilisateur non identifié");
      setLoading(false);
    }
  }, []);

  // 🔄 Fetch user's declarations
  useEffect(() => {
    if (!userId) return;

    const fetchDeclarations = async () => {
      try {
        const userResponse = await fetch(
          `http://localhost:8000/api/users/${userId}`
        );
        const userData = await userResponse.json();

        const declarations = userData.declarations || [];
        setUserDeclarations(declarations);

        const years = declarations.map((d: Declaration) => d.annee);
        setDeclarationYears(years);

        if (years.length > 0) {
          const latestYear = years.sort().reverse()[0];
          setSelectedYear(latestYear);
        }

        setLoading(false);
      } catch (err) {
        setError("Impossible de charger les déclarations de l'utilisateur");
        console.error(err);
        setLoading(false);
      }
    };

    fetchDeclarations();
  }, [userId]);

  // 🔁 On year selection update declaration
  useEffect(() => {
    if (selectedYear && userDeclarations.length > 0) {
      const selected = userDeclarations.find((d) => d.annee === selectedYear);
      if (selected) {
        setDeclaration(selected);
        setUploadedRubriques(
          (selected.rubriques || [])
            .filter((r) => r.documents && r.documents.length > 0)
            .map((r) => r.rubrique_id)
        );

        const fetchOrCreateRubrique = async () => {
          if (!selectedYear || !userId) return;
          setLoading(true);
      
          try {
            const declarationResponse = await fetch(
              `http://127.0.0.1:8000/api/users/${userId}/declarations/year/${selectedYear}`
            );
      
            if (!declarationResponse.ok) {
              setError("Déclaration non trouvée");
              setLoading(false);
              return;
            }
      
            const declarationData = await declarationResponse.json();
      
            if (declarationData.rubriques && declarationData.rubriques.length > 0) {
              setDeclaration(declarationData);
      
              const alreadyUploaded = declarationData.rubriques
                .filter(
                  (rubrique: Rubrique) =>
                    rubrique.documents && rubrique.documents.length > 0
                )
                .map((r: Rubrique) => r.rubrique_id);
      
              setUploadedRubriques(alreadyUploaded);
              setLoading(false);
            } else {
              const priveResponse = await fetch(`http://localhost:8000/api/prives`);
              const privesData: Prive[] = await priveResponse.json();
      
              const userPrive: Prive | undefined = privesData.find(
                (prive) => prive.user_id === userId
              );
      
              if (!userPrive) {
                setError("Données privées non trouvées pour cet utilisateur");
                setLoading(false);
                return;
              }
      
              const createdRubriques = [];
      
              for (const [field, value] of Object.entries(userPrive)) {
                if (
                  field.startsWith("fo_") &&
                  value === true &&
                  foFields[field as keyof typeof foFields]
                ) {
                  const rubriqueInfo = foFields[field as keyof typeof foFields];
      
                  try {
                    const createResponse = await fetch(
                      `http://127.0.0.1:8000/api/rubriques`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          declaration_id: declarationData.declaration_id,
                          titre: rubriqueInfo.titre,
                          description: rubriqueInfo.description,
                        }),
                      }
                    );
      
                    if (createResponse.ok) {
                      const createdRubrique = await createResponse.json();
                      createdRubriques.push(createdRubrique);
                    }
                  } catch (err) {
                    console.error(`Error creating rubrique for ${field}:`, err);
                  }
                }
              }
      
              const updatedDeclarationResponse = await fetch(
                `http://127.0.0.1:8000/api/users/${userId}/declarations/${declarationData.declaration_id}`
              );
              if (updatedDeclarationResponse.ok) {
                const updatedDeclarationData =
                  await updatedDeclarationResponse.json();
                setDeclaration(updatedDeclarationData);
      
                const alreadyUploaded = updatedDeclarationData.rubriques
                  .filter(
                    (rubrique: Rubrique) =>
                      rubrique.documents && rubrique.documents.length > 0
                  )
                  .map((r: Rubrique) => r.rubrique_id);
                setUploadedRubriques(alreadyUploaded);
              } else {
                setDeclaration({
                  ...declarationData,
                  rubriques: createdRubriques,
                });
              }
      
              setToastShown(true);
            }
          } catch (err) {
            setError("Erreur lors de la récupération ou création des données");
            console.error(err);
          } finally {
            setLoading(false);
          }
        }

        fetchOrCreateRubrique();
      }
    }
  }, [selectedYear, userDeclarations, userId]);

  const handleYearChange = (year: number) => {
    setSelectedYear(year.toString());
  };



  useEffect(() => {
    if (!loading && toastShown) {
      const createdRubriques = declaration?.rubriques || [];

      if (createdRubriques.length > 0) {
        toast.success(
          `${createdRubriques.length} rubriques chargées avec succès.`,
          { duration: 5000 }
        );
      } else {
        toast.error("Aucune rubrique trouvée.", { duration: 5000 });
      }

      setToastShown(false);
    }
  }, [loading, toastShown, declaration]);

  const handleFilesSelected = (rubriqueId: number, files: File[]) => {
    setSelectedFiles((prev) => [
      ...prev,
      ...files.map((file) => ({ file, rubriqueId })),
    ]);
  };

  const handleFileRemoved = (fileId: string) => {
    console.log("File removed:", fileId);
  };

  const uploadAndSaveDocuments = async () => {
    if (selectedFiles.length === 0) {
      toast.warning("Aucun fichier sélectionné");
      return;
    }

    setIsSaving(true);

    try {
      const uploadPromises = selectedFiles.map(async (fileData) => {
        const formData = new FormData();
        formData.append("file", fileData.file);
        formData.append("year", declaration?.annee || "");
        formData.append("userId", userId!.toString());
        formData.append("rubriqueId", fileData.rubriqueId.toString());
        formData.append(
          "rubriqueName",
          declaration?.rubriques.find(
            (r) => r.rubrique_id === fileData.rubriqueId
          )?.titre || ""
        );

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${fileData.file.name}`);
        }

        const result = await response.json();
        return {
          rubrique_id: fileData.rubriqueId,
          nom: result.fileName,
          type: result.fileType.split("/").pop() || "other",
          cheminFichier: result.url,
          statut: "pending",
          sous_rubrique: "default",
          fileSize: fileData.file.size,
        };
      });

      const documentsToSave = await Promise.all(uploadPromises);

      const saveResponse = await fetch("http://127.0.0.1:8000/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documents: documentsToSave }),
      });

      if (!saveResponse.ok) {
        const errorText = await saveResponse.text();
        throw new Error(`Failed to save documents: ${errorText}`);
      }

      toast.success(
        `${documentsToSave.length} documents enregistrés avec succès`
      );

      const uploadedIds = documentsToSave.map((doc) => doc.rubrique_id);
      setUploadedRubriques((prev) => [...new Set([...prev, ...uploadedIds])]);
      setSelectedFiles([]);

      setDeclaration((prev) => {
        if (!prev) return prev;

        const updatedRubriques = prev.rubriques.map((rubrique) => {
          const newDocs = documentsToSave.filter(
            (doc) => doc.rubrique_id === rubrique.rubrique_id
          );

          return newDocs.length > 0
            ? ({
                ...rubrique,
                documents: [...(rubrique.documents || []), ...newDocs],
              } as Rubrique)
            : rubrique;
        });

        return { ...prev, rubriques: updatedRubriques };
      });
    } catch (error) {
      console.error("Error uploading and saving documents:", error);
      toast.error("Erreur lors de l'enregistrement des documents", {
        description:
          error instanceof Error
            ? error.message
            : "Une erreur inconnue est survenue",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !userId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement de l&apos;utilisateur...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold mb-4">Erreur</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approuvé</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">En attente</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejeté</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

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
              <AccordionItem
                key={rubrique.rubrique_id}
                value={`rubrique-${rubrique.rubrique_id}`}
              >
                <AccordionTrigger className="text-xl font-medium">
                  {rubrique.titre}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6">
                    {uploadedRubriques.includes(rubrique.rubrique_id) ? (
                      <DocumentList
                        rubriqueId={rubrique.rubrique_id}
                        rubriqueName={rubrique.titre}
                        documents={rubrique.documents || []}
                      />
                    ) : (
                      <DocumentUpload
                        userId={userId}
                        year={declaration.annee}
                        rubriqueId={rubrique.rubrique_id}
                        rubriqueName={rubrique.titre}
                        existingDocuments={rubrique.documents || []}
                        onFilesSelected={(files) =>
                          handleFilesSelected(rubrique.rubrique_id, files)
                        }
                        onFileRemoved={handleFileRemoved}
                      />
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
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
              {selectedFiles.length > 1 ? "s" : ""} à être enregistré
            </span>
            <Button
              onClick={uploadAndSaveDocuments}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Enregistrer les documents
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </ProtectedRoutePrive>
  );
}
