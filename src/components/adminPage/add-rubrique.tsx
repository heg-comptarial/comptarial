"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface AddRubriqueDialogProps {
  isOpen: boolean;
  onClose: () => void;
  declarationId: number | undefined;
  declarationTitle: string | undefined;
  onRubriqueAdded: () => void;
  userId: string;
  // Nouvelles props pour le mode édition
  isEditing?: boolean;
  rubriqueId?: number | string | null;
}

export default function AddRubriqueDialog({
  isOpen,
  onClose,
  declarationId,
  declarationTitle,
  onRubriqueAdded,
  userId,
  isEditing = false,
  rubriqueId,
}: AddRubriqueDialogProps) {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  const [rubriqueData, setRubriqueData] = useState({
    titre: "",
    type: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Charger les données de la rubrique si on est en mode édition
  useEffect(() => {
    const fetchRubriqueData = async () => {
      if (isEditing && rubriqueId) {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `${API_URL}/rubriques/${rubriqueId}`
          );
          if (response.data) {
            setRubriqueData({
              titre: response.data.titre || "",
              type: response.data.type || "",
            });
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des données de la rubrique:",
            error
          );
          toast.error(
            "Erreur lors de la récupération des données de la rubrique"
          );
        } finally {
          setIsLoading(false);
        }
      } else {
        // Réinitialiser le formulaire si on n'est pas en mode édition
        setRubriqueData({
          titre: "",
          type: "",
        });
      }
    };

    if (isOpen) {
      fetchRubriqueData();
    }
  }, [isOpen, isEditing, rubriqueId, API_URL]);

  const handleSubmit = async () => {
    if (!rubriqueData.titre.trim()) {
      toast.error("Le titre de la rubrique est requis");
      return;
    }

    if (!declarationId) {
      toast.error("Aucune déclaration active sélectionnée");
      return;
    }

    try {
      setIsSubmitting(true);

      // Préparer les données pour l'API
      const data = {
        declaration_id: declarationId,
        titre: rubriqueData.titre,
      };

      let response;

      if (isEditing && rubriqueId) {
        // Mode édition: mettre à jour une rubrique existante
        console.log("Mise à jour de la rubrique:", data);
        response = await axios.put(`${API_URL}/rubriques/${rubriqueId}`, data);
        toast.success("Rubrique modifiée avec succès");
      } else {
        // Mode création: ajouter une nouvelle rubrique
        console.log("Création d'une nouvelle rubrique:", data);
        response = await axios.post(`${API_URL}/rubriques`, data);
        toast.success("Rubrique ajoutée avec succès");
      }

      // Réinitialiser le formulaire
      setRubriqueData({
        titre: "",
        type: "",
      });

      // Fermer la boîte de dialogue
      onClose();

      // Notifier le parent que la rubrique a été ajoutée/modifiée
      onRubriqueAdded();
    } catch (error) {
      console.error("Erreur lors de l'opération sur la rubrique:", error);

      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message ||
          "Erreur lors de l'opération sur la rubrique";
        toast.error(errorMessage);
        console.error("Détails de l'erreur:", error.response.data);
      } else {
        toast.error("Erreur lors de l'opération sur la rubrique");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Modifier la rubrique"
              : "Ajouter une nouvelle rubrique"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifiez les informations de la rubrique."
              : `Créez une nouvelle rubrique pour la déclaration ${
                  declarationTitle || "actuelle"
                }.`}
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Chargement des données...</span>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="titre">Titre de la rubrique *</Label>
              <Input
                id="titre"
                placeholder="Entrez le titre de la rubrique"
                value={rubriqueData.titre}
                onChange={(e) =>
                  setRubriqueData({ ...rubriqueData, titre: e.target.value })
                }
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting || isLoading}
          >
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || isLoading}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {isEditing ? "Modification en cours..." : "Ajout en cours..."}
              </>
            ) : isEditing ? (
              "Enregistrer les modifications"
            ) : (
              "Ajouter"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
