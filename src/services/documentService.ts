import axios from "axios";
import { Document } from "@/types/interfaces";

export async function downloadDocument(doc: Document, rubriqueName: string) {
  const year = new Date(doc.dateCreation ?? new Date())
    .getFullYear()
    .toString();
  const userId = localStorage.getItem("user_id")!;

  const params = new URLSearchParams({
    fileName: doc.nom,
    year,
    userId,
    rubriqueName,
  });

  try {
    const response = await axios.get(`/api/download?${params.toString()}`, {
      responseType: "blob",
    });

    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = doc.nom;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Download failed", error);
    throw new Error("Download failed");
  }
}

export async function deleteDocument(doc: Document, rubriqueName: string) {
  const year = new Date(doc.dateCreation ?? new Date())
    .getFullYear()
    .toString();
  const userId = localStorage.getItem("user_id")!;
  const docId = doc.doc_id;

  const params = new URLSearchParams({
    fileName: doc.nom,
    year,
    userId,
    rubriqueName,
  });

  try {
    // 🔁 Supprimer de S3
    await axios.delete(`/api/delete?${params.toString()}`);

    // 🔁 Supprimer de Laravel backend
    await axios.delete(`http://localhost:8000/api/documents/${docId}`);
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    throw new Error("Erreur lors de la suppression du document");
  }
}

export async function fetchCommentsByDocument(docId: number) {
  try {
    const { data } = await axios.get(
      `http://localhost:8000/api/documents/${docId}/commentaires`
    );
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires", error);
    throw new Error("Erreur lors de la récupération des commentaires");
  }
}
