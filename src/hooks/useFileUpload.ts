// hooks/useFileUpload.ts
import { useState } from "react";
import { toast } from "sonner";
import { Declaration, Rubrique } from "@/types/interfaces";

export function useFileUpload(
  declaration: Declaration | null,
  userId: number,
  setUploadedRubriques: (fn: (prev: number[]) => number[]) => void,
  setDeclaration: (fn: (prev: Declaration | null) => Declaration | null) => void
) {
  const [selectedFiles, setSelectedFiles] = useState<
    { file: File; rubriqueId: number }[]
  >([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleFilesSelected = (rubriqueId: number, files: File[]) => {
    setSelectedFiles((prev) => [
      ...prev,
      ...files.map((file) => ({ file, rubriqueId })),
    ]);
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
          throw new Error(`Erreur upload: ${fileData.file.name}`);
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

      const saveRes = await fetch("http://127.0.0.1:8000/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documents: documentsToSave }),
      });

      if (!saveRes.ok) {
        throw new Error("Erreur lors de l'enregistrement des documents");
      }

      toast.success(
        `${documentsToSave.length} documents enregistrés avec succès`
      );

      const uploadedIds = documentsToSave.map((d) => d.rubrique_id);
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
    } catch (err) {
      console.error(err);
      toast.error("Erreur d'enregistrement", {
        description: err instanceof Error ? err.message : "Erreur inconnue",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    selectedFiles,
    handleFilesSelected,
    uploadAndSaveDocuments,
    isSaving,
  };
}
