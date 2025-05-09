"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import axios from "axios"

interface DettesProps {
  data: DettesData | null
  onUpdate: (data: DettesData) => void
  onNext: () => void
  onPrev: () => void
}

export interface DettesData {
  fo_attestationEmprunt: boolean
  fo_attestationCarteCredit: boolean
  fo_attestationHypotheque: boolean
}

export default function Dettes({ data, onUpdate, onNext, onPrev }: DettesProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<DettesData>({
    fo_attestationEmprunt: false,
    fo_attestationCarteCredit: false,
    fo_attestationHypotheque: false,
  })

  // Initialiser les données du formulaire si elles existent
  useEffect(() => {
    if (data) {
      setFormData(data)
    }
  }, [data])

  // Gérer les changements dans le formulaire
  const handleChange = (field: keyof DettesData, value: boolean) => {
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
      <h3 className="text-lg font-medium">Intérêts de dettes</h3>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_attestationEmprunt"
                  checked={formData.fo_attestationEmprunt}
                  onCheckedChange={(checked) => handleChange("fo_attestationEmprunt", checked as boolean)}
                />
                <Label htmlFor="fo_attestationEmprunt" className="font-medium">
                  Avez-vous une attestation d&apos;emprunt (solde et intérêts)?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_attestationCarteCredit"
                  checked={formData.fo_attestationCarteCredit}
                  onCheckedChange={(checked) => handleChange("fo_attestationCarteCredit", checked as boolean)}
                />
                <Label htmlFor="fo_attestationCarteCredit" className="font-medium">
                  Avez-vous une attestation de carte de crédit (solde et intérêts)?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_attestationHypotheque"
                  checked={formData.fo_attestationHypotheque}
                  onCheckedChange={(checked) => handleChange("fo_attestationHypotheque", checked as boolean)}
                />
                <Label htmlFor="fo_attestationHypotheque" className="font-medium">
                  Avez-vous une attestation d&apos;hypothèque (solde et intérêts)?
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
