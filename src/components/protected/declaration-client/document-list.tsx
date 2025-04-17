"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CommentsDialog } from "@/components/protected/declaration-client/comment-dialog";
import { DocumentUpload } from "@/components/protected/declaration-client/document-upload";
import { Download, Trash2, MessageSquareMore, Plus } from "lucide-react";
import { getFileTypeIcon } from "@/utils/getFileTypeIcon";
import { getStatusBadge } from "@/utils/getStatusBadge";
import { Commentaire } from "@/types/interfaces";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";

interface Document {
  doc_id: number;
  rubrique_id: number;
  nom: string;
  type: string;
  cheminFichier: string;
  statut: string;
  sous_rubrique: string | null;
  dateCreation?: string;
  fileSize?: number;
}

interface DocumentListProps {
  rubriqueId: number;
  rubriqueName: string;
  declarationStatus: string;
  documents: Document[];
  onFilesSelected: (files: File[]) => void;
  onFileRemoved: (fileId: string) => void;
  onUploadCompleted?: () => void;
}

export function DocumentList({
  rubriqueId,
  rubriqueName,
  declarationStatus,
  documents: initialDocuments,
  onFilesSelected,
  onFileRemoved,
  onUploadCompleted,
}: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);

  useEffect(() => {
    setDocuments(initialDocuments);
  }, [initialDocuments]);

  const [commentMap, setCommentMap] = useState<Record<number, Commentaire[]>>(
    {}
  );
  const [showUploader, setShowUploader] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = () => setShowUploader(false);
    const el = cardRef.current;
    el?.addEventListener("closeUploader", handler as EventListener);
    return () =>
      el?.removeEventListener("closeUploader", handler as EventListener);
  }, []);

  const getYearFromDate = (dateStr?: string): string => {
    if (!dateStr) return new Date().getFullYear().toString();
    const match = dateStr.match(/^\d{4}/);
    return match ? match[0] : new Date().getFullYear().toString();
  };

  const handleDownload = async (doc: Document) => {
    try {
      const year = getYearFromDate(doc.dateCreation);
      const userId = localStorage.getItem("user_id")!;
      const params = new URLSearchParams({
        fileName: doc.nom,
        year,
        userId,
        rubriqueName,
      });
      const res = await fetch(`/api/download?${params.toString()}`);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = doc.nom;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du téléchargement");
    }
  };

  const handleDelete = async (doc: Document) => {
    const confirmed = window.confirm(`Supprimer ${doc.nom} ?`);
    if (!confirmed) return;
    try {
      const year = getYearFromDate(doc.dateCreation);
      const userId = localStorage.getItem("user_id")!;
      const docId = doc.doc_id;
      const params = new URLSearchParams({
        fileName: doc.nom,
        year,
        userId,
        rubriqueName,
      });
      const s3Res = await fetch(`/api/delete?${params.toString()}`, {
        method: "DELETE",
      });
      if (!s3Res.ok) throw new Error("Erreur S3");
      const backendRes = await fetch(
        `http://localhost:8000/api/documents/${docId}`,
        { method: "DELETE" }
      );
      const text = await backendRes.text();
      console.log("Laravel delete response:", text);
      if (!backendRes.ok) throw new Error("Erreur API Laravel");
      toast.success("Document supprimé avec succès");
      setDocuments((prev) => prev.filter((d) => d.doc_id !== docId));
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Échec de la suppression");
    }
  };

  const fetchComments = async (docId: number) => {
    if (commentMap[docId]) return;
    try {
      const res = await fetch(
        `http://localhost:8000/api/documents/${docId}/commentaires`
      );
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setCommentMap((prev) => ({ ...prev, [docId]: data }));
      }
    } catch (err) {
      console.error("Erreur lors du chargement des commentaires", err);
    }
  };

  const handleUploadCompleted = () => {
    setShowUploader(false);
    onUploadCompleted?.();
  };

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
            rubriqueId={rubriqueId}
            rubriqueName={rubriqueName}
            userId={parseInt(localStorage.getItem("user_id") || "0")}
            year={getYearFromDate(documents[0]?.dateCreation)}
            existingDocuments={documents.map((doc) => ({
              ...doc,
              dateCreation: doc.dateCreation ?? new Date().toISOString(),
            }))}
            onFilesSelected={onFilesSelected}
            onFileRemoved={onFileRemoved}
            hideExistingList={true}
            onUploadCompleted={handleUploadCompleted}
          />
        )}

        {documents.length > 0 ? (
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
                <TableRow key={doc.doc_id}>
                  <TableCell className="w-[40px]">
                    {getFileTypeIcon(doc.nom)}
                  </TableCell>
                  <TableCell className="w-1/2 font-medium">{doc.nom}</TableCell>
                  <TableCell className="w-1/6">{doc.type}</TableCell>
                  <TableCell className="w-1/6">
                    {getStatusBadge(doc.statut)}
                  </TableCell>
                  <TableCell className="w-1/6 text-right space-x-2">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Télécharger"
                    >
                      <Download className="h-4 w-4 inline" />
                    </button>
                    {declarationStatus === "pending" &&
                      doc.statut === "pending" && (
                        <button
                          onClick={() => handleDelete(doc)}
                          className="text-red-500 hover:text-red-700"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4 inline" />
                        </button>
                      )}
                    {commentMap[doc.doc_id]?.length > 0 && (
                      <CommentsDialog
                        documentId={doc.doc_id}
                        documentNom={doc.nom}
                        commentaires={commentMap[doc.doc_id] ?? []}
                        onOpen={() => fetchComments(doc.doc_id)}
                        trigger={
                          <button
                            className="text-yellow-500 hover:text-yellow-600"
                            title="Voir les commentaires"
                          >
                            <MessageSquareMore className="h-4 w-4 inline" />
                          </button>
                        }
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Aucun document trouvé pour cette rubrique
          </div>
        )}
      </CardContent>
    </Card>
  );
}
