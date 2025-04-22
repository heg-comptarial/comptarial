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
  const s3Res = await fetch(`/api/delete?${params.toString()}`, {
    method: "DELETE",
  });
  if (!s3Res.ok) throw new Error("Erreur S3");
  const backendRes = await fetch(
    `http://localhost:8000/api/documents/${docId}`,
    { method: "DELETE" }
  );
  if (!backendRes.ok) throw new Error("Erreur API Laravel");
}

export async function fetchCommentsByDocument(docId: number) {
  const res = await fetch(
    `http://localhost:8000/api/documents/${docId}/commentaires`
  );
  if (!res.ok)
    throw new Error("Erreur lors de la récupération des commentaires");
  return res.json();
}
