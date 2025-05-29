"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import axios from "axios"

interface AssurancesProps {
  data: AssurancesData | null
  onUpdate: (data: AssurancesData) => void
  onNext: () => void
  onPrev: () => void
}

export interface AssurancesData {
  fo_chomage: boolean
  fo_maladie: boolean
  fo_accident: boolean
  fo_materniteMilitairePC: boolean
}

export default function Assurances({ data, onUpdate, onNext, onPrev }: AssurancesProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<AssurancesData>({
    fo_chomage: false,
    fo_maladie: false,
    fo_accident: false,
    fo_materniteMilitairePC: false,
  })

  // Initialiser les données du formulaire si elles existent
  useEffect(() => {
    if (data) {
      setFormData(data)
    }
  }, [data])

  // Gérer les changements dans le formulaire
  const handleChange = (field: keyof AssurancesData, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
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
      <h3 className="text-lg font-medium">Indemnités d&apos;assurance</h3>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_chomage"
                  checked={formData.fo_chomage}
                  onCheckedChange={(checked) => handleChange("fo_chomage", checked as boolean)}
                />
                <Label htmlFor="fo_chomage" className="font-medium">
                  Avez-vous perçu des indemnités de chômage?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_maladie"
                  checked={formData.fo_maladie}
                  onCheckedChange={(checked) => handleChange("fo_maladie", checked as boolean)}
                />
                <Label htmlFor="fo_maladie" className="font-medium">
                  Avez-vous perçu des indemnités maladie?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_accident"
                  checked={formData.fo_accident}
                  onCheckedChange={(checked) => handleChange("fo_accident", checked as boolean)}
                />
                <Label htmlFor="fo_accident" className="font-medium">
                  Avez-vous perçu des indemnités accident?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_materniteMilitairePC"
                  checked={formData.fo_materniteMilitairePC}
                  onCheckedChange={(checked) => handleChange("fo_materniteMilitairePC", checked as boolean)}
                />
                <Label htmlFor="fo_materniteMilitairePC" className="font-medium">
                  Avez-vous perçu des indemnités maternité, militaire ou PC?
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
