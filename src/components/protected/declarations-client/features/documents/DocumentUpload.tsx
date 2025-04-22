"use client";

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
import { Upload, Trash2, Download } from "lucide-react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { formatFileSize } from "@/utils/formatFileSize";
import { getFileTypeIcon } from "@/utils/getFileTypeIcon";
import type { DocumentUploadProps } from "@/types/interfaces";

export default function DocumentUpload({
  rubriqueId,
  rubriqueName,
  existingDocuments = [],
  onFilesSelected,
  onFileRemoved,
  hideExistingList = false,
  hideTitle = false,
}: DocumentUploadProps) {
  const { selectedFiles, handleFileSelect, removeFile } = useFileUpload({
    onFilesSelected,
    onFileRemoved,
  });

  const getFileExtension = (fileName: string) =>
    fileName.split(".").pop()?.toLowerCase() || "";

  return (
    <Card className="w-full">
      {!hideTitle && (
        <CardHeader>
          <CardTitle className="text-lg">
            Documents pour {rubriqueName}
          </CardTitle>
        </CardHeader>
      )}

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`file-upload-${rubriqueId}`} className="block">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm font-medium">
                Glissez et déposez des fichiers, ou cliquez pour sélectionner
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PDF, PNG, JPEG ou JPG (max 10MB)
              </p>
            </div>
          </Label>
          <Input
            id={`file-upload-${rubriqueId}`}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
          />
        </div>

        {selectedFiles.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Fichiers à téléverser</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]" />
                  <TableHead className="w-1/2">Nom</TableHead>
                  <TableHead className="w-1/6">Type</TableHead>
                  <TableHead className="w-1/6">Taille</TableHead>
                  <TableHead className="w-1/6 text-right">Actions</TableHead>
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

        {!hideExistingList && existingDocuments.length > 0 && (
          <div className="space-y-4 mt-6">
            <h3 className="text-sm font-medium">Documents existants</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]" />
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
                    <TableCell>{doc.statut}</TableCell>
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
