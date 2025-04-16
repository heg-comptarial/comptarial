"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Commentaire } from "@/types/interfaces";

interface CommentsDialogProps {
  documentId: number;
  documentNom: string;
  commentaires: Commentaire[];
  trigger?: React.ReactNode;
  onOpen?: () => void;
}

export function CommentsDialog({
  documentNom,
  commentaires,
  trigger,
  onOpen,
}: CommentsDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && onOpen) onOpen();
  }, [open, onOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Commentaires pour le document : {documentNom}
          </DialogTitle>
          <DialogDescription>
            {commentaires.length} commentaire
            {commentaires.length > 1 ? "s" : ""}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] mt-4">
          {commentaires.length > 0 ? (
            <div className="space-y-4">
              {commentaires.map((comment) => (
                <div
                  key={comment.commentaire_id}
                  className="border rounded-lg p-4"
                >
                  <div className="text-sm text-muted-foreground mb-1">
                    {format(
                      new Date(comment.dateCreation),
                      "d MMMM yyyy à HH:mm",
                      { locale: fr }
                    )}
                  </div>
                  <p className="text-sm">{comment.contenu}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Aucun commentaire pour ce document
            </p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
