import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import DocumentList from "./DocumentList";
import DocumentUpload from "./DocumentUpload";
import { Rubrique, Document } from "@/types/interfaces";

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
    >
      <AccordionTrigger className="text-xl font-medium">
        {rubrique.titre}
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-6">
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
          ) : (
            <p className="text-sm text-muted-foreground">
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
