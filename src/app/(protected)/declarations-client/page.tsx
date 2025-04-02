"use client";

import { useState, useEffect } from "react";
import { Declaration, Prive } from "@/types/interfaces";
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
import { foFields } from "@/utils/foFields";
import YearSelector from "@/components/YearSelector";
import { useUser } from "@/components/context/UserContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { DocumentList } from "@/components/protected/declaration-client/document-list";

export default function DeclarationsClientPage() {
  const { user } = useUser();
  console.log("User data", user);
  const userId = 7;
  const declarationId = 6;
  const declarationYear = "2025";

  const [documentsSaved, setDocumentsSaved] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [declaration, setDeclaration] = useState<Declaration | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toastShown, setToastShown] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<
    { file: File; rubriqueId: number }[]
  >([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  /* Vérification de l'année sélectionnée */
  useEffect(() => {
    if (selectedYear) {
      console.log(`Selected year: ${selectedYear}`);
    }
  }, [selectedYear]);

  useEffect(() => {
    fetchOrCreateRubrique();
  }, []);

  /* Sélection de l'année */
  const handleYearChange = (year: number) => {
    setSelectedYear(year.toString());
  };

  async function fetchOrCreateRubrique() {
    try {
      setLoading(true);

      const declarationResponse = await fetch(
        `http://127.0.0.1:8000/api/users/${userId}/declarations/year/${declarationYear}`
      );

      if (!declarationResponse.ok) {
        setError("Déclaration non trouvée");
        setLoading(false);
        return;
      }

      const declarationData = await declarationResponse.json();

      if (declarationData.rubriques && declarationData.rubriques.length > 0) {
        setDeclaration(declarationData);
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
            const rubriqueName = foFields[field as keyof typeof foFields].titre;
            const rubriqueDescription =
              foFields[field as keyof typeof foFields].description;

            try {
              const createResponse = await fetch(
                `http://127.0.0.1:8000/api/rubriques`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    declaration_id: declarationId,
                    titre: rubriqueName,
                    description: rubriqueDescription,
                  }),
                }
              );

              if (createResponse.ok) {
                const createdRubrique = await createResponse.json();
                createdRubriques.push(createdRubrique);
              } else {
                console.error(
                  `Failed to create rubrique for ${field}: ${await createResponse.text()}`
                );
              }
            } catch (err) {
              console.error(`Error creating rubrique for ${field}:`, err);
            }
          }
        }

        const updatedDeclarationResponse = await fetch(
          `http://127.0.0.1:8000/api/users/${userId}/declarations/${declarationId}`
        );
        if (updatedDeclarationResponse.ok) {
          const updatedDeclarationData =
            await updatedDeclarationResponse.json();
          setDeclaration(updatedDeclarationData);
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

  /* Notification de création des rubriques */
  useEffect(() => {
    if (!loading && toastShown) {
      const createdRubriques = declaration?.rubriques || [];

      if (createdRubriques.length > 0) {
        toast.success(
          `${createdRubriques.length} rubriques chargées avec succès.`,
          {
            duration: 5000,
          }
        );
      } else {
        toast.error("Aucune rubrique trouvée.", {
          duration: 5000,
        });
      }

      setToastShown(false);
    }
  }, [loading, toastShown, declaration]);

  /* Badge du status de la déclaration */
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

  const handleFilesSelected = (rubriqueId: number, files: File[]) => {
    setSelectedFiles((prev) => [
      ...prev,
      ...files.map((file) => ({ file, rubriqueId })),
    ]);
  };

  const handleFileRemoved = (fileId: string) => {
    // Implement if needed
  };

  const uploadAndSaveDocuments = async () => {
    if (selectedFiles.length === 0) {
      toast.warning("Aucun fichier sélectionné");
      return;
    }

    setIsSaving(true);

    try {
      // Upload des fichiers sélectionnés dans le bucket S3 Infomaniak
      const uploadPromises = selectedFiles.map(async (fileData) => {
        const formData = new FormData();
        formData.append("file", fileData.file);
        formData.append("year", declaration?.annee || "");
        formData.append("userId", userId.toString());
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
        };
      });

      const documentsToSave = await Promise.all(uploadPromises);

      // Then save to database
      const saveResponse = await fetch("http://127.0.0.1:8000/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documents: documentsToSave }),
      });

      if (!saveResponse.ok) {
        const errorText = await saveResponse.text();
        throw new Error(`Failed to save documents: ${errorText}`);
      }

      // const saveResult = await saveResponse.json();

      toast.success(
        `${documentsToSave.length} documents enregistrés avec succès`
      );
      setDocumentsSaved(true);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des rubriques...</span>
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

  return (
    <ProtectedRoute>
      <Toaster position="bottom-right" richColors closeButton />
      <div className="px-10">
        <h2 className="text-lg font-semibold px-2">Année de la déclaration</h2>
        <YearSelector onYearChange={handleYearChange} className="w-full" />
      </div>

      <div className="p-10 pt-5">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{declaration?.titre}</h1>
          {declaration?.statut && getStatusBadge(declaration.statut)}
        </div>

        {declaration?.rubriques && declaration.rubriques.length > 0 ? (
          <Accordion type="multiple" className="w-full">
            {declaration.rubriques.map((rubrique) => (
              <AccordionItem
                key={rubrique.rubrique_id}
                value={`rubrique-${rubrique.rubrique_id}`}
              >
                <AccordionTrigger className="text-xl font-medium">
                  {rubrique.titre}
                </AccordionTrigger>
                {/* <AccordionContent>
                  <div className="space-y-6">
                    <DocumentUpload
                      userId={userId}
                      year={declaration.annee}
                      rubriqueId={rubrique.rubrique_id}
                      rubriqueName={rubrique.titre}
                      onFilesSelected={(files) =>
                        handleFilesSelected(rubrique.rubrique_id, files)
                      }
                      onFileRemoved={handleFileRemoved}
                    />
                  </div>
                </AccordionContent> */}
                <AccordionContent>
                  <div className="space-y-6">
                    {documentsSaved ? (
                      <DocumentList
                        rubriqueId={rubrique.rubrique_id}
                        rubriqueName={rubrique.titre}
                        documents={rubrique.documents || []}
                        onAddMore={() => setDocumentsSaved(false)}
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
              {selectedFiles.length > 1 ? "s" : ""}
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
    </ProtectedRoute>
  );
}
