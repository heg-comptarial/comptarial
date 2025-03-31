"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import { formatFileSize } from "@/utils/format-file-size";
import { allowedFileTypes } from "@/utils/allowedFileTypes";


interface SelectedFile {
  file: File;
  id: string;
  progress: number;
  uploaded: boolean;
  error: boolean;
}

// Update the interface to include a callback for tracking uploaded files
interface DocumentUploadProps {
  userId: number;
  year: string;
  rubriqueId: number;
  rubriqueName: string;
  onFileUploaded: (fileInfo: UploadedFileInfo) => void;
  onFileRemoved: (fileKey: string) => void;
}

// Add a new interface for uploaded file information
interface UploadedFileInfo {
  key: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
}

// Update the component function signature
export function DocumentUpload({
  userId,
  year,
  rubriqueId,
  rubriqueName,
  onFileUploaded,
  onFileRemoved,
}: DocumentUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const newFiles: SelectedFile[] = [];

    Array.from(e.target.files).forEach((file) => {
      // Check if file type is allowed
      if (!allowedFileTypes.includes(file.type)) {
        toast.error(`Type de fichier non autorisé: ${file.name}`, {
          description:
            "Seuls les documents PDF, Word, Excel et les images sont autorisés.",
        });
        return;
      }

      // Check if file is already selected
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
        progress: 0,
        uploaded: false,
        error: false,
      });
    });

    setSelectedFiles([...selectedFiles, ...newFiles]);

    // Reset the input value to allow selecting the same file again
    e.target.value = "";
  };

  // Update the removeFile function to call onFileRemoved when removing an uploaded file
  const removeFile = (id: string) => {
    const fileToRemove = selectedFiles.find((file) => file.id === id);
    if (fileToRemove && fileToRemove.uploaded) {
      // If the file was already uploaded, notify parent component
      const fileKey = `${userId}/${year}/${rubriqueName}/${fileToRemove.file.name}`;
      onFileRemoved(fileKey);
    }

    setSelectedFiles(selectedFiles.filter((file) => file.id !== id));
  };

  // Update the uploadFiles function to call onFileUploaded after successful upload
  const uploadFiles = async () => {
    if (selectedFiles.length === 0) {
      toast.warning("Aucun fichier sélectionné");
      return;
    }

    setIsUploading(true);
    const updatedFiles = [...selectedFiles];

    for (let i = 0; i < selectedFiles.length; i++) {
      if (selectedFiles[i].uploaded) continue;

      const fileData = selectedFiles[i];
      const formData = new FormData();
      formData.append("file", fileData.file);
      formData.append("year", year);
      formData.append("userId", userId.toString());
      formData.append("rubriqueId", rubriqueId.toString());
      formData.append("rubriqueName", rubriqueName);

      try {
        // Update progress
        updatedFiles[i] = { ...updatedFiles[i], progress: 50 };
        setSelectedFiles([...updatedFiles]);

        // Log the form data for debugging
        console.log("Uploading file:", fileData.file.name);
        console.log("Form data:", {
          year,
          userId,
          rubriqueId,
          rubriqueName,
        });

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        
        let responseData;
        try {
          responseData = await response.json();
          console.log("Response data:", responseData);
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          throw new Error("Erreur lors de la lecture de la réponse du serveur");
        }

        if (!response.ok) {
          const errorMessage =
            responseData?.error ||
            responseData?.details ||
            "Erreur lors de l'upload";
          console.error("Upload error:", errorMessage);
          throw new Error(errorMessage);
        }

        // Update progress to complete
        updatedFiles[i] = { ...updatedFiles[i], progress: 100, uploaded: true };
        setSelectedFiles([...updatedFiles]);

        // Create a mock URL if the real one is not available
        const fileUrl =
          responseData?.url ||
          `https://example.com/${userId}/${year}/${rubriqueName}/${fileData.file.name}`;
        const fileKey =
          responseData?.key ||
          `${userId}/${year}/${rubriqueName}/${fileData.file.name}`;

        // Call the callback with the uploaded file info
        onFileUploaded({
          key: fileKey,
          fileName: fileData.file.name,
          fileType: fileData.file.type.split("/").pop() || "other",
          fileSize: fileData.file.size,
          url: fileUrl,
        });

        toast.success(`${fileData.file.name} téléchargé avec succès`);
      } catch (error) {
        console.error("Upload error:", error);
        updatedFiles[i] = { ...updatedFiles[i], error: true };
        setSelectedFiles([...updatedFiles]);

        toast.error(`Erreur lors de l'upload de ${fileData.file.name}`, {
          description:
            error instanceof Error
              ? error.message
              : "Une erreur s'est produite",
        });
      }
    }

    setIsUploading(false);
  };

  const getFileTypeIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "xls":
      case "xlsx":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FileText className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Documents pour {rubriqueName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`file-upload-${rubriqueId}`} className="block">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm font-medium">
                Glissez et déposez des fichiers, ou cliquez pour sélectionner
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PDF, Word, Excel, et images (max 10MB)
              </p>
            </div>
          </Label>
          <Input
            id={`file-upload-${rubriqueId}`}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            multiple
            accept={allowedFileTypes.join(",")}
          />
        </div>

        {selectedFiles.length > 0 && (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Taille</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedFiles.map((fileData) => (
                  <TableRow key={fileData.id}>
                    <TableCell>{getFileTypeIcon(fileData.file.name)}</TableCell>
                    <TableCell className="font-medium">
                      {fileData.file.name}
                    </TableCell>
                    <TableCell>{fileData.file.type.split("/").pop()}</TableCell>
                    <TableCell>{formatFileSize(fileData.file.size)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(fileData.id)}
                        disabled={
                          isUploading &&
                          fileData.progress > 0 &&
                          !fileData.uploaded &&
                          !fileData.error
                        }
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-end">
              <Button
                onClick={uploadFiles}
                disabled={isUploading || selectedFiles.every((f) => f.uploaded)}
              >
                {isUploading
                  ? "Téléchargement en cours..."
                  : "Télécharger les fichiers"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
