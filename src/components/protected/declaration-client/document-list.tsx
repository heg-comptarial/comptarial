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
import {
  FileText,
  FileImage,
  FileSpreadsheet,
  Download,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/utils/format-file-size";
import { useState } from "react";

interface Document {
  doc_id: number;
  nom: string;
  type: string;
  cheminFichier: string;
  statut: string;
  dateCreation: string;
  fileSize?: number;
}

interface DocumentListProps {
  rubriqueId: number;
  rubriqueName: string;
  documents: Document[];
  onAddMore?: () => void;
}

export function DocumentList({
  rubriqueName,
  documents = [],
  onAddMore,
}: DocumentListProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
        return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
      case "jpg":
      case "jpeg":
      case "png":
        return <FileImage className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <span className="text-green-500">Approuvé</span>;
      case "pending":
        return <span className="text-yellow-500">En attente</span>;
      case "rejected":
        return <span className="text-red-500">Rejeté</span>;
      default:
        return <span>Inconnu</span>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            Documents pour {rubriqueName}
          </CardTitle>
          {onAddMore && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAddMore}
              disabled={isLoading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Ajouter des documents
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {documents.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Taille</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.doc_id ?? `${doc.nom}-${doc.cheminFichier}`}>
                  <TableCell>{getFileTypeIcon(doc.nom)}</TableCell>
                  <TableCell className="font-medium">{doc.nom}</TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>
                    {doc.fileSize ? formatFileSize(doc.fileSize) : "N/A"}
                  </TableCell>
                  <TableCell>{getStatusBadge(doc.statut)}</TableCell>
                  <TableCell className="text-right">
                    <a
                      href={doc.cheminFichier}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700"
                      title="Télécharger"
                    >
                      <Download className="h-4 w-4 inline" />
                    </a>
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
