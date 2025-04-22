import { useCallback, useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Document, Commentaire } from "@/types/interfaces";
import {
  downloadDocument,
  deleteDocument,
  fetchCommentsByDocument,
} from "@/services/documentService";

export function useDocumentActions(
  initialDocuments: Document[],
  rubriqueName: string
) {
  const fetchedDocsRef = useRef<Set<number>>(new Set());
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [commentMap, setCommentMap] = useState<Record<number, Commentaire[]>>(
    {}
  );

  useEffect(() => {
    setDocuments(initialDocuments);
  }, [initialDocuments]);

  const handleDownload = async (doc: Document) => {
    try {
      await downloadDocument(doc, rubriqueName);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du téléchargement");
    }
  };

  const handleDelete = async (
    doc: Document,
    setDocumentsCallback: (callback: (prev: Document[]) => Document[]) => void
  ) => {
    const confirmed = window.confirm(`Supprimer ${doc.nom} ?`);
    if (!confirmed) return;

    try {
      await deleteDocument(doc, rubriqueName);
      toast.success("Document supprimé avec succès");
      setDocumentsCallback((prev) =>
        prev.filter((d) => d.doc_id !== doc.doc_id)
      );
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Échec de la suppression");
    }
  };

  const fetchComments = useCallback(async (docId: number) => {
    if (fetchedDocsRef.current.has(docId)) return;
    try {
      const comments = await fetchCommentsByDocument(docId);
      setCommentMap((prev) => ({ ...prev, [docId]: comments }));
      fetchedDocsRef.current.add(docId);
    } catch (err) {
      console.error("Erreur lors du chargement des commentaires", err);
    }
  }, []);

  return {
    documents,
    setDocuments,
    commentMap,
    fetchComments,
    handleDelete,
    handleDownload,
  };
}
