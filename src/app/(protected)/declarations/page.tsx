"use client";

import { Save, Loader2 } from "lucide-react";
import { Toaster } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import YearSelector from "@/components/YearSelector";
import { Rubrique } from "@/types/interfaces";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DocumentUpload } from "@/components/protected/declaration-client/document-upload";
import { DocumentList } from "@/components/protected/declaration-client/document-list";
import { useDeclarations } from "@/hooks/useDeclarations";
import { useFileUpload } from "@/hooks/useFileUpload";

export default function DeclarationsClientPage() {
  const userId = 7;
  const {
    selectedYear,
    setSelectedYear,
    declaration,
    declarationYears,
    uploadedRubriques,
    setUploadedRubriques,
    loading,
    error,
    setDeclaration,
  } = useDeclarations(userId);

  const {
    selectedFiles,
    handleFilesSelected,
    uploadAndSaveDocuments,
    isSaving,
  } = useFileUpload(declaration, userId, setUploadedRubriques, setDeclaration);

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
        <YearSelector
          years={declarationYears}
          selectedYear={selectedYear ?? ""}
          onYearChange={(year) => setSelectedYear(year.toString())}
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
            {declaration.rubriques.map((rubrique: Rubrique) => (
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
                        onFileRemoved={(fileId) =>
                          console.log("File removed", fileId)
                        }
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
    </ProtectedRoute>
  );
}
