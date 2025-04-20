"use client"

import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface AddRubriqueDialogProps {
  isOpen: boolean
  onClose: () => void
  declarationId: number | undefined
  declarationTitle: string | undefined
  onRubriqueAdded: () => void
  userId: string
}

export default function AddRubriqueDialog({
  isOpen,
  onClose,
  declarationId,
  declarationTitle,
  onRubriqueAdded,
  userId,
}: AddRubriqueDialogProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

  const [newRubrique, setNewRubrique] = useState({
    titre: "",
    description: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddRubrique = async () => {
    if (!newRubrique.titre.trim()) {
      toast.error("Le titre de la rubrique est requis")
      return
    }

    if (!declarationId) {
      toast.error("Aucune déclaration active sélectionnée")
      return
    }

    try {
      setIsSubmitting(true)

      // Préparer les données pour l'API
      const rubriqueData = {
        declaration_id: declarationId,
        titre: newRubrique.titre,
        description: newRubrique.description || "",
      }

      // Envoyer la requête à l'API
      const response = await axios.post(`${API_URL}/rubriques`, rubriqueData)

      if (response.data) {
        toast.success("Rubrique ajoutée avec succès")

        // Réinitialiser le formulaire
        setNewRubrique({
          titre: "",
          description: "",
        })

        // Fermer la boîte de dialogue
        onClose()

        // Notifier le parent que la rubrique a été ajoutée
        onRubriqueAdded()
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la rubrique:", error)

      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message || "Erreur lors de l'ajout de la rubrique"
        toast.error(errorMessage)
        console.error("Détails de l'erreur:", error.response.data)
      } else {
        toast.error("Erreur lors de l'ajout de la rubrique")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] w-[90vw]">
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle rubrique</DialogTitle>
          <DialogDescription>
            Créez une nouvelle rubrique pour la déclaration {declarationTitle || "actuelle"}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="titre">Titre de la rubrique *</Label>
            <Input
              id="titre"
              placeholder="Entrez le titre de la rubrique"
              value={newRubrique.titre}
              onChange={(e) => setNewRubrique({ ...newRubrique, titre: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Entrez une description (optionnel)"
              value={newRubrique.description}
              onChange={(e) => setNewRubrique({ ...newRubrique, description: e.target.value })}
              className="min-h-[100px] w-full"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button onClick={handleAddRubrique} disabled={isSubmitting}>
            {isSubmitting ? "Ajout en cours..." : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
