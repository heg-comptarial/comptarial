"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import axios from "axios"

interface TitresProps {
  data: TitresData | null
  onUpdate: (data: TitresData) => void
  onNext: () => void
  onPrev: () => void
}

export interface TitresData {
  compteBancairePostale: boolean
  actionOuPartSociale: boolean
  autreElementFortune: boolean
  aucunElementFortune: boolean
  objetsValeur: boolean
  fo_gainJeux: boolean
  fo_releveFiscal: boolean
}

export default function Titres({ data, onUpdate, onNext, onPrev }: TitresProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<TitresData>({
    compteBancairePostale: false,
    actionOuPartSociale: false,
    autreElementFortune: false,
    aucunElementFortune: false,
    objetsValeur: false,
    fo_gainJeux: false,
    fo_releveFiscal: false,
  })

  // Initialiser les données du formulaire si elles existent
  useEffect(() => {
    if (data) {
      setFormData(data)
    }
  }, [data])

  // Gérer les changements dans le formulaire
  const handleChange = (field: keyof TitresData, value: boolean) => {
    // Si "aucunElementFortune" est coché, décocher tous les autres éléments de fortune
    if (field === "aucunElementFortune" && value === true) {
      setFormData((prev) => ({
        ...prev,
        compteBancairePostale: false,
        actionOuPartSociale: false,
        autreElementFortune: false,
        objetsValeur: false,
        [field]: value,
      }))
    }
    // Si un élément de fortune est coché, décocher "aucunElementFortune"
    else if (
      (field === "compteBancairePostale" ||
        field === "actionOuPartSociale" ||
        field === "autreElementFortune" ||
        field === "objetsValeur") &&
      value === true
    ) {
      setFormData((prev) => ({
        ...prev,
        aucunElementFortune: false,
        [field]: value,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        throw new Error("Vous devez être connecté pour effectuer cette action.")
      }

      // Mettre à jour les données dans le composant parent
      onUpdate(formData)

      // Passer à l'étape suivante
      onNext()
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error)
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || "Une erreur est survenue lors de la soumission du formulaire.")
      } else {
        setError("Une erreur est survenue lors de la soumission du formulaire. Veuillez réessayer.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Titres et autres éléments de fortune</h3>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium">Possédez-vous les éléments de fortune suivants?</h4>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="compteBancairePostale"
                  checked={formData.compteBancairePostale}
                  onCheckedChange={(checked) => handleChange("compteBancairePostale", checked as boolean)}
                />
                <Label htmlFor="compteBancairePostale" className="font-medium">
                  Avez-vous des comptes bancaires ou postaux?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="actionOuPartSociale"
                  checked={formData.actionOuPartSociale}
                  onCheckedChange={(checked) => handleChange("actionOuPartSociale", checked as boolean)}
                />
                <Label htmlFor="actionOuPartSociale" className="font-medium">
                  Possédez-vous des actions ou parts sociales?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="objetsValeur"
                  checked={formData.objetsValeur}
                  onCheckedChange={(checked) => handleChange("objetsValeur", checked as boolean)}
                />
                <Label htmlFor="objetsValeur" className="font-medium">
                  Possédez-vous des objets de valeur (monnaies, métaux précieux, bijoux, collections, véhicules de plus
                  de 2000 CHF)?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autreElementFortune"
                  checked={formData.autreElementFortune}
                  onCheckedChange={(checked) => handleChange("autreElementFortune", checked as boolean)}
                />
                <Label htmlFor="autreElementFortune" className="font-medium">
                  Possédez-vous d&apos;autres éléments de fortune?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="aucunElementFortune"
                  checked={formData.aucunElementFortune}
                  onCheckedChange={(checked) => handleChange("aucunElementFortune", checked as boolean)}
                />
                <Label htmlFor="aucunElementFortune" className="font-medium">
                  Je ne possède aucun élément de fortune
                </Label>
              </div>

              <h4 className="font-medium pt-4">Disposez-vous des documents suivants?</h4>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_gainJeux"
                  checked={formData.fo_gainJeux}
                  onCheckedChange={(checked) => handleChange("fo_gainJeux", checked as boolean)}
                />
                <Label htmlFor="fo_gainJeux" className="font-medium">
                  Avez-vous une attestation de gains de jeux?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_releveFiscal"
                  checked={formData.fo_releveFiscal}
                  onCheckedChange={(checked) => handleChange("fo_releveFiscal", checked as boolean)}
                />
                <Label htmlFor="fo_releveFiscal" className="font-medium">
                  Avez-vous un relevé fiscal?
                </Label>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button type="button" variant="outline" onClick={onPrev}>
            Retour
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Chargement...
              </>
            ) : (
              "Continuer"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
