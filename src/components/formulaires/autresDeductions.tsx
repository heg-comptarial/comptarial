"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import axios from "axios"

interface AutresDeductionsProps {
  data: AutresDeductionsData | null
  onUpdate: (data: AutresDeductionsData) => void
  onNext: () => void
  onPrev: () => void
}

export interface AutresDeductionsData {
  fo_rachatLPP: boolean
  fo_attestation3emePilierA: boolean
  fo_attestation3emePilierB: boolean
  fo_attestationAssuranceMaladie: boolean
  fo_attestationAssuranceAccident: boolean
  fo_cotisationAVS: boolean
  fo_fraisFormationProfessionnel: boolean
  fo_fraisMedicaux: boolean
  fo_fraisHandicap: boolean
  fo_dons: boolean
  fo_versementPartisPolitiques: boolean
}

export default function AutresDeductions({ data, onUpdate, onNext, onPrev }: AutresDeductionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<AutresDeductionsData>({
    fo_rachatLPP: false,
    fo_attestation3emePilierA: false,
    fo_attestation3emePilierB: false,
    fo_attestationAssuranceMaladie: false,
    fo_attestationAssuranceAccident: false,
    fo_cotisationAVS: false,
    fo_fraisFormationProfessionnel: false,
    fo_fraisMedicaux: false,
    fo_fraisHandicap: false,
    fo_dons: false,
    fo_versementPartisPolitiques: false,
  })

  // Initialiser les données du formulaire si elles existent
  useEffect(() => {
    if (data) {
      setFormData(data)
    }
  }, [data])

  // Gérer les changements dans le formulaire
  const handleChange = (field: keyof AutresDeductionsData, value: boolean) => {
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
      <h3 className="text-lg font-medium">Autres déductions</h3>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_rachatLPP"
                  checked={formData.fo_rachatLPP}
                  onCheckedChange={(checked) => handleChange("fo_rachatLPP", checked as boolean)}
                />
                <Label htmlFor="fo_rachatLPP" className="font-medium">
                  Avez-vous effectué un rachat LPP?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_attestation3emePilierA"
                  checked={formData.fo_attestation3emePilierA}
                  onCheckedChange={(checked) => handleChange("fo_attestation3emePilierA", checked as boolean)}
                />
                <Label htmlFor="fo_attestation3emePilierA" className="font-medium">
                  Avez-vous une attestation 3ème pilier A?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_attestation3emePilierB"
                  checked={formData.fo_attestation3emePilierB}
                  onCheckedChange={(checked) => handleChange("fo_attestation3emePilierB", checked as boolean)}
                />
                <Label htmlFor="fo_attestation3emePilierB" className="font-medium">
                  Avez-vous une attestation 3ème pilier B (Assurance Vie et Vieillesse)?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_attestationAssuranceMaladie"
                  checked={formData.fo_attestationAssuranceMaladie}
                  onCheckedChange={(checked) => handleChange("fo_attestationAssuranceMaladie", checked as boolean)}
                />
                <Label htmlFor="fo_attestationAssuranceMaladie" className="font-medium">
                  Avez-vous une attestation d&apos;assurance maladie (Prime + Frais médicaux)?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_attestationAssuranceAccident"
                  checked={formData.fo_attestationAssuranceAccident}
                  onCheckedChange={(checked) => handleChange("fo_attestationAssuranceAccident", checked as boolean)}
                />
                <Label htmlFor="fo_attestationAssuranceAccident" className="font-medium">
                  Avez-vous une attestation d&apos;assurance accident?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_cotisationAVS"
                  checked={formData.fo_cotisationAVS}
                  onCheckedChange={(checked) => handleChange("fo_cotisationAVS", checked as boolean)}
                />
                <Label htmlFor="fo_cotisationAVS" className="font-medium">
                  Avez-vous des cotisations AVS?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_fraisFormationProfessionnel"
                  checked={formData.fo_fraisFormationProfessionnel}
                  onCheckedChange={(checked) => handleChange("fo_fraisFormationProfessionnel", checked as boolean)}
                />
                <Label htmlFor="fo_fraisFormationProfessionnel" className="font-medium">
                  Avez-vous des frais de formation professionnelle?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_fraisMedicaux"
                  checked={formData.fo_fraisMedicaux}
                  onCheckedChange={(checked) => handleChange("fo_fraisMedicaux", checked as boolean)}
                />
                <Label htmlFor="fo_fraisMedicaux" className="font-medium">
                  Avez-vous des frais médicaux non pris en charge par l&apos;assurance maladie?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_fraisHandicap"
                  checked={formData.fo_fraisHandicap}
                  onCheckedChange={(checked) => handleChange("fo_fraisHandicap", checked as boolean)}
                />
                <Label htmlFor="fo_fraisHandicap" className="font-medium">
                  Avez-vous des frais liés à un handicap?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_dons"
                  checked={formData.fo_dons}
                  onCheckedChange={(checked) => handleChange("fo_dons", checked as boolean)}
                />
                <Label htmlFor="fo_dons" className="font-medium">
                  Avez-vous effectué des dons?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_versementPartisPolitiques"
                  checked={formData.fo_versementPartisPolitiques}
                  onCheckedChange={(checked) => handleChange("fo_versementPartisPolitiques", checked as boolean)}
                />
                <Label htmlFor="fo_versementPartisPolitiques" className="font-medium">
                  Avez-vous effectué des versements à des partis politiques?
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
