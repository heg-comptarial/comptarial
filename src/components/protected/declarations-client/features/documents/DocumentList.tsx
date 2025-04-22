"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const cardRef = useRef<HTMLDivElement | null>(null);

  const {
    documents,
    setDocuments,
    commentMap,
    fetchComments,
    handleDelete,
    handleDownload,
  } = useDocumentActions(initialDocuments, rubriqueName);

  // 👇 Ajoute l’écoute de l’événement custom "closeUploader"
  useEffect(() => {
    const handler = () => setShowUploader(false);
    const el = cardRef.current;
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
    <Card className="w-full" data-hide-uploader ref={cardRef}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            Documents pour {rubriqueName}
          </CardTitle>
          {declarationStatus === "pending" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUploader((prev) => !prev)}
            >
              <Plus className="h-4 w-4 mr-2" /> Ajouter des documents
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {showUploader && declarationStatus === "pending" && (
          <DocumentUpload
            key={`uploader-${rubriqueId}`}
            rubriqueId={rubriqueId}
            rubriqueName={rubriqueName}
            userId={parseInt(localStorage.getItem("user_id") || "0")}
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
        )}

        {documents.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]" />
                  <TableHead className="w-1/2">Nom</TableHead>
                  <TableHead className="w-1/6">Type</TableHead>
                  <TableHead className="w-1/6">Statut</TableHead>
                  <TableHead className="w-1/6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <DocumentListItem
                    key={doc.doc_id}
                    doc={doc}
                    declarationStatus={declarationStatus}
                    onDownload={() => handleDownload(doc)}
                    onDelete={() => handleDelete(doc, setDocuments)}
                    comments={commentMap[doc.doc_id] ?? []}
                    onCommentsOpen={() => fetchComments(doc.doc_id)}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Aucun document trouvé pour cette rubrique
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentList;
