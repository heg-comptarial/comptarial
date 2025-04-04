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
import { Download } from "lucide-react";
import { getFileTypeIcon } from "@/utils/getFileTypeIcon";

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
}: DocumentListProps) {
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
        </div>
      </CardHeader>
      <CardContent>
        {documents.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead className="w-1/2">Nom</TableHead>
                <TableHead className="w-1/6">Type</TableHead>
                <TableHead className="w-1/6">Statut</TableHead>
                <TableHead className="w-1/6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.doc_id ?? `${doc.nom}-${doc.cheminFichier}`}>
                  <TableCell className="w-[40px]">
                    {getFileTypeIcon(doc.nom)}
                  </TableCell>
                  <TableCell className="w-1/2 font-medium">{doc.nom}</TableCell>
                  <TableCell className="w-1/6">{doc.type}</TableCell>
                  <TableCell className="w-1/6">
                    {getStatusBadge(doc.statut)}
                  </TableCell>
                  <TableCell className="w-1/6 text-right">
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
