"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X as XIcon } from "lucide-react";
import { useEffect } from "react";

interface ConfirmationDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  documentsNonValides: string[];
  validateDeclarationOnly: () => void;
  validateDeclarationAndDocuments: () => void;
  setPendingDeclarationAction: (action: any) => void;
}

function ConfirmationDialog({
  open: confirmationDialogOpen,
  setOpen: setConfirmationDialogOpen,
  documentsNonValides,
  validateDeclarationOnly,
  setPendingDeclarationAction,
}: ConfirmationDialogProps) {
  // Ajouter et supprimer la classe de flou à l'élément principal lors de l'ouverture et fermeture du dialogue
  useEffect(() => {
    if (confirmationDialogOpen) {
      document.body.classList.add("backdrop-blur-md"); // Ajoute le flou sur l'arrière-plan
    } else {
      document.body.classList.remove("backdrop-blur-md"); // Retire le flou lorsque le dialogue est fermé
    }
  }, [confirmationDialogOpen]);

  return (
    <Dialog open={confirmationDialogOpen} onOpenChange={setConfirmationDialogOpen} modal={true}>
      <DialogContent
        className="max-w-4xl min-h-[450px] z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#f9fafb] shadow-xl rounded-xl p-6"
      >
        {/* Bouton de fermeture */}
        <button
          onClick={() => setConfirmationDialogOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
          aria-label="Fermer"
        >
          <XIcon className="w-6 h-6" />
        </button>

        <DialogHeader>
          <DialogTitle>⚠️ Attention - Documents non validés</DialogTitle>
          <DialogDescription className="mt-2">
            Certains documents de cette déclaration ne sont pas encore validés. Que souhaitez-vous faire ?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800 mb-2">Documents non validés :</p>
                <ul className="text-sm text-yellow-700 list-disc pl-5">
                  {documentsNonValides && documentsNonValides.length > 0 ? (
                    documentsNonValides.map((doc, index) => <li key={index}>{doc}</li>)
                  ) : (
                    <li>Aucun document spécifié</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer avec les boutons centrés */}
        <DialogFooter>
            <div className="flex flex-col sm:flex-row sm:justify-center gap-4 mt-4 px-4 py-4 mx-auto w-full">
                <Button
                variant="outline"
                onClick={() => {
                    setConfirmationDialogOpen(false);
                    setPendingDeclarationAction(null);
                }}
                className="transition duration-200 hover:bg-gray-100 hover:shadow-md w-full sm:w-auto"
                >
                Annuler
                </Button>
                <Button
                onClick={validateDeclarationOnly}
                variant="outline" // Même variant que le bouton "Annuler"
                className="transition duration-200 hover:bg-gray-100 hover:shadow-md w-full sm:w-auto"
                >
                Valider la déclaration qunad même 
                </Button>
            </div>
        </DialogFooter>

        {/* Message sous les boutons avec espacement réduit */}
        <div className="mt-4 text-center text-yellow-800 text-sm px-4">
          {documentsNonValides.length > 0 && (
            <p>Veuillez valider ces documents avant de pouvoir valider la déclaration complète.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmationDialog;