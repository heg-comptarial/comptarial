import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import DocumentList from "./DocumentList";
import DocumentUpload from "./DocumentUpload";
import type { Rubrique, Document } from "@/types/interfaces";

interface Props {
  rubrique: Rubrique;
  declarationStatus: string;
  uploadedRubriques: number[];
  onFilesSelected: (rubriqueId: number, files: File[]) => void;
  onFileRemoved: (fileId: string) => void;
  onUploadCompleted: () => void;
  userId: number;
  year: string;
}

const RubriqueAccordionItem = ({
  rubrique,
  declarationStatus,
  uploadedRubriques,
  onFilesSelected,
  onFileRemoved,
  onUploadCompleted,
  userId,
  year,
}: Props) => {
  const hasDocuments = uploadedRubriques.includes(rubrique.rubrique_id);
  const documents: Document[] = (rubrique.documents || []).map((doc) => ({
    ...doc,
    sous_rubrique: doc.sous_rubrique ?? null,
  }));

  return (
    <AccordionItem
      key={rubrique.rubrique_id}
      value={`rubrique-${rubrique.rubrique_id}`}
      className="border rounded-md mb-4 overflow-hidden"
    >
      <AccordionTrigger className="text-xl font-medium px-4 py-3 hover:bg-gray-50">
        {rubrique.titre}
      </AccordionTrigger>
      <AccordionContent className="pt-0 px-0 pb-0">
        <div className="border-t">
          {hasDocuments ? (
            <DocumentList
              rubriqueId={rubrique.rubrique_id}
              rubriqueName={rubrique.titre}
              documents={documents}
              declarationStatus={declarationStatus}
              onFilesSelected={(files) =>
                onFilesSelected(rubrique.rubrique_id, files)
              }
              onFileRemoved={onFileRemoved}
              onUploadCompleted={onUploadCompleted}
            />
          ) : declarationStatus === "pending" ? (
            <div className="p-4">
              <DocumentUpload
                userId={userId}
                year={year}
                rubriqueId={rubrique.rubrique_id}
                rubriqueName={rubrique.titre}
                existingDocuments={rubrique.documents || []}
                onFilesSelected={(files) =>
                  onFilesSelected(rubrique.rubrique_id, files)
                }
                onFileRemoved={onFileRemoved}
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground p-4">
              Cette déclaration est figée. Vous ne pouvez plus ajouter de
              documents.
            </p>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default RubriqueAccordionItem;
