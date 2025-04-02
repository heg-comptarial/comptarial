"use client";

import type React from "react";
import { useState } from "react";
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
import { Upload, Trash2, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { formatFileSize } from "@/utils/format-file-size";
import { allowedFileTypes } from "@/utils/allowedFileTypes";

interface SelectedFile {
  file: File;
  id: string;
}

interface ExistingDocument {
  doc_id: number;
  nom: string;
  type: string;
  cheminFichier: string;
  statut: string;
  dateCreation: string;
  fileSize?: number;
}

interface DocumentUploadProps {
  userId: number;
  year: string;
  rubriqueId: number;
  rubriqueName: string;
  existingDocuments?: ExistingDocument[];
  onFilesSelected: (files: File[]) => void;
  onFileRemoved: (fileId: string) => void;
}

export function DocumentUpload({
  rubriqueId,
  rubriqueName,
  existingDocuments = [],
  onFilesSelected,
  onFileRemoved,
}: DocumentUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const newFiles: SelectedFile[] = [];

    Array.from(e.target.files).forEach((file) => {
      if (!allowedFileTypes.includes(file.type)) {
        toast.error(`Type de fichier non autorisé: ${file.name}`, {
          description:
            "Seuls les documents PDF, Word, Excel et les images sont autorisés.",
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

    setSelectedFiles([...selectedFiles, ...newFiles]);
    onFilesSelected(newFiles.map((f) => f.file));
    e.target.value = "";
  };

  const removeFile = (id: string) => {
    setSelectedFiles(selectedFiles.filter((file) => file.id !== id));
    onFileRemoved(id);
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

  const getFileExtension = (fileName: string) => {
    return fileName.split(".").pop()?.toLowerCase() || "";
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

        {/* Liste des fichiers sélectionnés */}
        {selectedFiles.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Fichiers à téléverser</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Taille</TableHead>
                  <TableHead className="text-right">Action</TableHead>
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
                    <TableCell className="text-right">
                      <button
                        onClick={() => removeFile(fileData.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Liste des documents existants */}
        {existingDocuments.length > 0 && (
          <div className="space-y-4 mt-6">
            <h3 className="text-sm font-medium">Documents existants</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {existingDocuments.map((doc) => (
                  <TableRow key={doc.doc_id}>
                    <TableCell>{getFileTypeIcon(doc.nom)}</TableCell>
                    <TableCell className="font-medium">{doc.nom}</TableCell>
                    <TableCell>{getFileExtension(doc.nom)}</TableCell>
                    <TableCell>
                      {doc.statut === "approved" && (
                        <span className="text-green-500">Approuvé</span>
                      )}
                      {doc.statut === "pending" && (
                        <span className="text-yellow-500">En attente</span>
                      )}
                      {doc.statut === "rejected" && (
                        <span className="text-red-500">Rejeté</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <a
                        href={doc.cheminFichier}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        <Download className="h-4 w-4 inline" />
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
