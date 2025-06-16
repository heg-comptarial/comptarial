import { useState } from "react";
import { toast } from "sonner";
import { allowedFileTypes } from "@/utils/allowedFileTypes";

interface FileUploadHookProps {
  onFilesSelected: (files: File[]) => void;
  onFileRemoved: (fileId: string) => void;
}

interface SelectedFile {
  file: File;
  id: string;
}

export function useFileUpload({
  onFilesSelected,
  onFileRemoved,
}: FileUploadHookProps) {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const newFiles: SelectedFile[] = [];

    Array.from(e.target.files).forEach((file) => {
      if (!allowedFileTypes.includes(file.type)) {
        toast.error(`Type de fichier non autorisé: ${file.name}`, {
          description:
            "Seuls les documents PDF et les images sont autorisés.",
        });
        return;
      }

      if (
        selectedFiles.some(
          (f) => f.file.name === file.name && f.file.size === file.size
        )
      ) {
        toast.warning(`Fichier déjà sélectionné: ${file.name}`);
        return;
      }

      newFiles.push({
        file,
        id: crypto.randomUUID(),
      });
    });

    setSelectedFiles((prev) => [...prev, ...newFiles]);
    onFilesSelected(newFiles.map((f) => f.file));
    e.target.value = "";
  };

  const removeFile = (id: string) => {
    setSelectedFiles((prev) => prev.filter((file) => file.id !== id));
    onFileRemoved(id);
  };

  return {
    selectedFiles,
    handleFileSelect,
    removeFile,
  };
}
