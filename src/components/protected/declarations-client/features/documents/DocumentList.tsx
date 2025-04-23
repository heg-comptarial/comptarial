"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import DocumentListItem from "./DocumentListItem";
import DocumentUpload from "./DocumentUpload";
import { useDocumentActions } from "@/hooks/useDocuments";
import type { DocumentListProps } from "@/types/interfaces";

const DocumentList = ({
  rubriqueId,
  rubriqueName,
  declarationStatus,
  documents: initialDocuments,
  onFilesSelected,
  onFileRemoved,
  onUploadCompleted,
}: DocumentListProps) => {
  const [showUploader, setShowUploader] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const {
    documents,
    setDocuments,
    commentMap,
    fetchComments,
    handleDelete,
    handleDownload,
  } = useDocumentActions(initialDocuments, rubriqueName);

  // 👇 Ajoute l'écoute de l'événement custom "closeUploader"
  useEffect(() => {
    const handler = () => setShowUploader(false);
    const el = containerRef.current;
    el?.addEventListener("closeUploader", handler as EventListener);
    return () => {
      el?.removeEventListener("closeUploader", handler as EventListener);
    };
  }, []);

  useEffect(() => {
    documents.forEach((doc) => {
      fetchComments(doc.doc_id);
    });
  }, [fetchComments, documents]);

  const getYearFromDate = (dateStr?: string): string => {
    if (!dateStr) return new Date().getFullYear().toString();
    const match = dateStr.match(/^\d{4}/);
    return match ? match[0] : new Date().getFullYear().toString();
  };

  const defaultYear = getYearFromDate(documents[0]?.dateCreation);

  return (
    <div
      className="w-full rounded-md bg-white border border-gray-100 shadow-sm overflow-hidden"
      data-hide-uploader
      ref={containerRef}
    >
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">
            Documents pour {rubriqueName}
          </h3>
          {declarationStatus === "pending" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUploader((prev) => !prev)}
              className="bg-white hover:bg-gray-50"
            >
              <Plus className="h-4 w-4 mr-2" /> Ajouter des documents
            </Button>
          )}
        </div>
      </div>

      <div className="p-4">
        {showUploader && declarationStatus === "pending" && (
          <div className="mb-6 bg-gray-50 rounded-md p-4">
            <DocumentUpload
              key={`uploader-${rubriqueId}`}
              rubriqueId={rubriqueId}
              rubriqueName={rubriqueName}
              userId={Number.parseInt(localStorage.getItem("user_id") || "0")}
              year={defaultYear}
              existingDocuments={documents.map((doc) => ({
                ...doc,
                dateCreation: doc.dateCreation ?? new Date().toISOString(),
              }))}
              onFilesSelected={onFilesSelected}
              onFileRemoved={onFileRemoved}
              hideExistingList={true}
              onUploadCompleted={onUploadCompleted}
              hideTitle={true}
            />
          </div>
        )}

        {documents.length > 0 ? (
          <div className="overflow-x-auto rounded-md border border-gray-100">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[40px]" />
                  <TableHead className="w-1/2 font-medium">Nom</TableHead>
                  <TableHead className="w-1/6 font-medium">Type</TableHead>
                  <TableHead className="w-1/6 font-medium">Statut</TableHead>
                  <TableHead className="w-1/6 text-right font-medium">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <DocumentListItem
                    key={doc.doc_id}
                    doc={doc}
                    declarationStatus={declarationStatus}
                    onDownload={() => handleDownload(doc)}
                    onDelete={() =>
                      handleDelete(doc, setDocuments, onUploadCompleted)
                    }
                    comments={commentMap[doc.doc_id] ?? []}
                    onCommentsOpen={() => fetchComments(doc.doc_id)}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-md">
            Aucun document trouvé pour cette rubrique
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentList;
