import { TableCell, TableRow } from "@/components/ui/table";
import { Download, Trash2, MessageSquareMore } from "lucide-react";
import { getFileTypeIcon } from "@/utils/getFileTypeIcon";
import { getStatusBadge } from "@/utils/getStatusBadge";
import { CommentsDialog } from "../commentaires/CommentDialog";
import type { Document, Commentaire } from "@/types/interfaces";

interface Props {
  doc: Document;
  declarationStatus: string;
  onDownload: () => void;
  onDelete: () => void;
  comments: Commentaire[];
  onCommentsOpen: () => void;
}

const DocumentListItem = ({
  doc,
  declarationStatus,
  onDownload,
  onDelete,
  comments,
  onCommentsOpen,
}: Props) => {
  return (
    <TableRow>
      <TableCell className="w-[40px]">{getFileTypeIcon(doc.nom)}</TableCell>
      <TableCell className="w-1/2 font-medium">{doc.nom}</TableCell>
      <TableCell className="w-1/6">{doc.type}</TableCell>
      <TableCell className="w-1/6">{getStatusBadge(doc.statut)}</TableCell>
      <TableCell className="w-1/6 text-right space-x-2">
        <button
          onClick={onDownload}
          className="text-blue-500 hover:text-blue-700"
          title="Télécharger"
        >
          <Download className="h-4 w-4 inline" />
        </button>
        {declarationStatus === "pending" && doc.statut !== "approved" && (
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700"
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4 inline" />
          </button>
        )}
        {comments.length > 0 && (
          <CommentsDialog
            documentId={doc.doc_id}
            documentNom={doc.nom}
            commentaires={comments}
            onOpen={onCommentsOpen}
            trigger={
              <button
                className="text-yellow-500 hover:text-yellow-600"
                title="Voir les commentaires"
              >
                <MessageSquareMore className="h-4 w-4 inline" />
              </button>
            }
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default DocumentListItem;
