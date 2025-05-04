import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";

interface CreateDeclarationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDeclarationAdded: (newDeclaration: any) => void; // Passer la nouvelle déclaration au parent
  userId: string;
}

export default function CreateDeclarationDialog({
  isOpen,
  onClose,
  onDeclarationAdded,
  userId,
}: CreateDeclarationDialogProps) {
  const TITLES = ["Déclaration", "Comptabilité", "TVA", "Salaires", "Administration", "Fiscalité", "Divers"];
  const [declarationData, setDeclarationData] = useState({
    titre: "",
    annee: new Date().getFullYear().toString(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!declarationData.titre.trim() || !declarationData.annee.trim()) {
      toast.error("Tous les champs sont requis");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await axios.post(`http://127.0.0.1:8000/api/declarations`, {
        user_id: userId,
        titre: declarationData.titre,
        annee: declarationData.annee,
        statut: "pending",
      });

      if (response.status === 201) {
        const newDeclaration = response.data; // Récupérer la déclaration créée
        toast.success(`Déclaration "${declarationData.titre}" créée avec succès !`);
        setDeclarationData({ titre: "", annee: new Date().getFullYear().toString() }); // Réinitialiser le formulaire
        onClose(); // Fermer la boîte de dialogue
        onDeclarationAdded(newDeclaration); // Passer la nouvelle déclaration au parent
      } else {
        toast.error("Erreur lors de la création de la déclaration.");
      }
    } catch (error) {
      console.error("Erreur lors de la création de la déclaration:", error);
      toast.error("Erreur lors de la création de la déclaration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une nouvelle déclaration</DialogTitle>
          <DialogDescription>
            Remplissez les informations nécessaires pour créer une nouvelle déclaration.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Sélection du titre */}
          <div>
            <label className="text-sm font-medium">Titre</label>
            <Select
              onValueChange={(value) => setDeclarationData((prev) => ({ ...prev, titre: value }))}
              value={declarationData.titre}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisissez un titre" />
              </SelectTrigger>
              <SelectContent>
                {TITLES.map((title) => (
                  <SelectItem key={title} value={title}>
                    {title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sélection de l'année */}
          <div>
            <label className="text-sm font-medium">Année</label>
            <Input
              type="number"
              value={declarationData.annee}
              onChange={(e) => setDeclarationData((prev) => ({ ...prev, annee: e.target.value }))}
              placeholder="Entrez l'année"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !declarationData.titre || !declarationData.annee}>
            {isSubmitting ? "Création..." : "Valider"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}