"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from 'lucide-react'
import axios from "axios"

interface RentierProps {
  data: RentierData | null
  onUpdate: (data: RentierData) => void
  onNext: () => void
  onPrev: () => void
}

export interface RentierData {
  fo_attestationRenteAVSAI: boolean
  fo_attestationRentePrevoyance: boolean
  fo_autresRentes: boolean
}

export default function Rentier({ data, onUpdate, onNext, onPrev }: RentierProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<RentierData>({
    fo_attestationRenteAVSAI: false,
    fo_attestationRentePrevoyance: false,
    fo_autresRentes: false,
  })

  // Initialiser les données du formulaire si elles existent
  useEffect(() => {
    if (data) {
      setFormData(data)
    }
  }, [data])

  // Gérer les changements dans le formulaire
  const handleChange = (field: keyof RentierData, value: boolean) => {
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
      <h3 className="text-lg font-medium">Rentes et prestations</h3>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_attestationRenteAVSAI"
                  checked={formData.fo_attestationRenteAVSAI}
                  onCheckedChange={(checked) => handleChange("fo_attestationRenteAVSAI", checked as boolean)}
                />
                <Label htmlFor="fo_attestationRenteAVSAI" className="font-medium">
                  Avez-vous une attestation de rente AVS/AI?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_attestationRentePrevoyance"
                  checked={formData.fo_attestationRentePrevoyance}
                  onCheckedChange={(checked) => handleChange("fo_attestationRentePrevoyance", checked as boolean)}
                />
                <Label htmlFor="fo_attestationRentePrevoyance" className="font-medium">
                  Avez-vous une attestation de rente de prévoyance?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_autresRentes"
                  checked={formData.fo_autresRentes}
                  onCheckedChange={(checked) => handleChange("fo_autresRentes", checked as boolean)}
                />
                <Label htmlFor="fo_autresRentes" className="font-medium">
                  Percevez-vous d&apos;autres rentes?
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
