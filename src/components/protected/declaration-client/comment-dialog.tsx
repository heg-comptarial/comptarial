"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare } from "lucide-react"
import { Commentaire } from "@/types/interfaces"


interface Document {
  doc_id: number
  rubrique_id: number
  nom: string
  type: string
  cheminFichier: string
  statut: string
  sous_rubrique: string | null
  dateCreation: string
  commentaires: Commentaire[]
}

interface CommentsDialogProps {
  document: Document
  trigger?: React.ReactNode
}

export function CommentsDialog({ document, trigger }: CommentsDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>{document.commentaires.length} commentaires</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Commentaires pour le document : {document.nom}</DialogTitle>
          <DialogDescription>
            {document.commentaires.length} commentaire{document.commentaires.length > 1 ? "s" : ""}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] mt-4">
          {document.commentaires.length > 0 ? (
            <div className="space-y-4">
              {document.commentaires.map((comment) => (
                <div key={comment.commentaire_id} className="border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">
                    {format(new Date(comment.dateCreation), "d MMMM yyyy à HH:mm", { locale: fr })}
                  </div>
                  <p className="text-sm">{comment.contenu}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">Aucun commentaire pour ce document</p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
