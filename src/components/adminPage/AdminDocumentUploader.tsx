import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Props {
  rubriqueId: number;
  rubriqueName: string;
  userId: number;
  year: string;
  onUploadCompleted: () => void;
}

export default function AdminDocumentUploader({
  rubriqueId,
  rubriqueName,
  userId,
  year,
  onUploadCompleted,
}: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Aucun fichier sélectionné");
      return;
    }

    try {
      setUploading(true);

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("rubriqueId", rubriqueId.toString());
        formData.append("rubriqueName", rubriqueName);
        formData.append("userId", userId.toString());
        formData.append("year", year);

        // 1. Upload vers S3 via /api/upload
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error(`Erreur d'upload pour ${file.name}`);
        }

        const uploaded = await uploadRes.json();
        console.log("UPLOAD RESPONSE", uploaded);

        // 2. POST vers Laravel pour enregistrer en BDD
        // Extraire le type court depuis "image/png" → "png"
        const extension =
          uploaded.fileType?.split("/").pop()?.toLowerCase() || "other";

        const payload = {
          documents: [
            {
              rubrique_id: rubriqueId,
              nom: uploaded.fileName,
              type: extension, // ex: "png"
              cheminFichier: uploaded.key, // ex: "7/2025/Immobiliers/v1.png"
              statut: "pending",
              sous_rubrique: rubriqueName,
            },
          ],
        };

        const bddRes = await fetch(`http://localhost:8000/api/documents`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!bddRes.ok) {
          if (!bddRes.ok) {
            let errorText = "Erreur inconnue Laravel";
            let body;

            try {
              body = await bddRes.json();
              console.error("Laravel BDD ERROR (json):", body);
              errorText = JSON.stringify(body.errors || body.message || body);
            } catch (e) {
              console.error("Laravel BDD ERROR (texte brut):", e);
              errorText = "Impossible de lire la réponse Laravel";
            }

            throw new Error(`Erreur Laravel: ${errorText}`);
          }
        }
      }

      toast.success("Upload + BDD : OK");
      setFiles([]);
      onUploadCompleted();
    } catch (err) {
      console.error(err);
      toast.error("Erreur pendant l'envoi ou l'enregistrement");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium mb-2">Télécharger des documents</h4>
      <div className="border border-dashed rounded-lg p-6 text-center bg-muted cursor-pointer">
        <label htmlFor="file-upload" className="cursor-pointer block">
          {files.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Cliquez ou glissez-déposez des fichiers ici
            </p>
          ) : (
            <ul className="text-sm text-left list-disc list-inside">
              {files.map((file, i) => (
                <li key={i}>{file.name}</li>
              ))}
            </ul>
          )}
        </label>
        <input
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      <Button onClick={handleUpload} disabled={uploading || files.length === 0}>
        {uploading ? "Envoi en cours..." : "Valider l'envoi"}
      </Button>
    </div>
  );
}
