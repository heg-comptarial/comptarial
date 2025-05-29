/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogOverlay,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, XIcon, CheckCircle, AlertCircle } from "lucide-react"
import { useEffect } from "react"
import { cn } from "@/lib/utils"

interface ConfirmationDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  documentsNonValides: string[]
  validateDeclarationOnly: () => void
  validateDeclarationAndDocuments: () => void
  setPendingDeclarationAction: (action: any) => void
}

function ConfirmationDialog({
  open: confirmationDialogOpen,
  setOpen: setConfirmationDialogOpen,
  documentsNonValides,
  validateDeclarationOnly,
  validateDeclarationAndDocuments,
  setPendingDeclarationAction,
}: ConfirmationDialogProps) {
  // Ajouter et supprimer la classe de flou à l'élément principal lors de l'ouverture et fermeture du dialogue
  useEffect(() => {
    if (confirmationDialogOpen) {
      document.body.classList.add("backdrop-blur-md") // Ajoute le flou sur l'arrière-plan
      document.body.style.overflow = "hidden" // Empêche le défilement
    } else {
      document.body.classList.remove("backdrop-blur-md") // Retire le flou lorsque le dialogue est fermé
      document.body.style.overflow = "" // Réactive le défilement
    }

    // Nettoyage lors du démontage du composant
    return () => {
      document.body.classList.remove("backdrop-blur-md")
      document.body.style.overflow = ""
    }
  }, [confirmationDialogOpen])

  return (
    <Dialog open={confirmationDialogOpen} onOpenChange={setConfirmationDialogOpen} modal={true}>
      <DialogOverlay className="bg-black/30 backdrop-blur-sm animate-in fade-in duration-300" />
      <DialogContent className="max-w-md sm:max-w-lg z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 shadow-2xl rounded-xl p-0 border-0 animate-in fade-in-90 slide-in-from-bottom-10 duration-300">
        {/* En-tête avec fond coloré */}
        <div className="bg-amber-50 dark:bg-amber-900/30 rounded-t-xl p-5 border-b border-amber-100 dark:border-amber-800/50">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 bg-amber-100 dark:bg-amber-800/50 p-2 rounded-full">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-amber-800 dark:text-amber-300">
                Documents non validés
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-amber-700 dark:text-amber-400">
                Certains documents de cette déclaration ne sont pas encore validés.
              </DialogDescription>
            </div>
          </div>

          {/* Bouton de fermeture */}
          <button
            onClick={() => {
              setConfirmationDialogOpen(false)
              setPendingDeclarationAction(null)
            }}
            className="absolute top-3 right-3 text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 transition-colors rounded-full p-1 hover:bg-amber-100 dark:hover:bg-amber-800/50"
            aria-label="Fermer"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Contenu principal */}
        <div className="p-5">
          <div className="mb-5 bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-800/50 rounded-lg overflow-hidden">
            <div className="bg-amber-50 dark:bg-amber-900/20 px-3 py-2 border-b border-amber-100 dark:border-amber-800/30">
              <p className="font-medium text-amber-800 dark:text-amber-300 text-xs">
                Liste des documents en attente de validation
              </p>
            </div>
            <div className="p-3">
              <ul className="space-y-1.5 max-h-[150px] overflow-y-auto">
                {documentsNonValides && documentsNonValides.length > 0 ? (
                  documentsNonValides.map((doc, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs">{doc}</span>
                    </li>
                  ))
                ) : (
                  <li className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <AlertCircle className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-xs">Aucun document spécifié</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
            Veuillez choisir l&apos;action à effectuer concernant cette déclaration et ses documents.
          </p>

          {/* Boutons d'action */}
          <div className="grid grid-cols-1 gap-3 mb-3">
            <Button
              onClick={validateDeclarationOnly}
              variant="outline"
              size="sm"
              className={cn(
                "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800",
                "dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/30",
                "transition-all duration-200 py-2 px-3 h-auto",
              )}
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <div className="text-left">
                  <span className="font-medium text-sm">Valider déclaration uniquement</span>
                </div>
              </div>
            </Button>

            <Button
              onClick={validateDeclarationAndDocuments}
              size="sm"
              className={cn(
                "bg-green-600 hover:bg-green-700 text-white",
                "dark:bg-green-700 dark:hover:bg-green-800",
                "transition-all duration-200 py-2 px-3 h-auto",
              )}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-white" />
                <div className="text-left">
                  <span className="font-medium text-sm">Valider déclaration et documents</span>
                </div>
              </div>
            </Button>
          </div>
        </div>

        {/* Pied de page */}
        <DialogFooter className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-b-xl border-t border-gray-100 dark:border-gray-800 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setConfirmationDialogOpen(false)
              setPendingDeclarationAction(null)
            }}
            className={cn(
              "text-gray-600 hover:text-gray-800 hover:bg-gray-100",
              "dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800",
              "transition-all duration-200 h-8",
            )}
          >
            Annuler
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmationDialog
