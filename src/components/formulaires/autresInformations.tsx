"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import axios from "axios"

interface AutresInformationsProps {
  data: AutresInformationsData | null
  onUpdate: (data: AutresInformationsData) => void
  onNext: () => void
  onPrev: () => void
}

export interface AutresInformationsData {
  fo_versementBoursesEtudes: boolean
  fo_pensionsPercuesEnfantMajeurACharge: boolean
  fo_prestationsAVSSPC: boolean
  fo_prestationsFamilialesSPC: boolean
  fo_prestationsVilleCommune: boolean
  fo_allocationsImpotents: boolean
  fo_reparationTortMoral: boolean
  fo_hospiceGeneral: boolean
  fo_institutionBienfaisance: boolean
}

export default function AutresInformations({ data, onUpdate, onNext, onPrev }: AutresInformationsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<AutresInformationsData>({
    fo_versementBoursesEtudes: false,
    fo_pensionsPercuesEnfantMajeurACharge: false,
    fo_prestationsAVSSPC: false,
    fo_prestationsFamilialesSPC: false,
    fo_prestationsVilleCommune: false,
    fo_allocationsImpotents: false,
    fo_reparationTortMoral: false,
    fo_hospiceGeneral: false,
    fo_institutionBienfaisance: false,
  })

  // Initialiser les données du formulaire si elles existent
  useEffect(() => {
    if (data) {
      setFormData(data)
    }
  }, [data])

  // Gérer les changements dans le formulaire
  const handleChange = (field: keyof AutresInformationsData, value: boolean) => {
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
      <h3 className="text-lg font-medium">Autres informations</h3>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_versementBoursesEtudes"
                  checked={formData.fo_versementBoursesEtudes}
                  onCheckedChange={(checked) => handleChange("fo_versementBoursesEtudes", checked as boolean)}
                />
                <Label htmlFor="fo_versementBoursesEtudes" className="font-medium">
                  Avez-vous reçu des versements de bourses d&apos;études?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_pensionsPercuesEnfantMajeurACharge"
                  checked={formData.fo_pensionsPercuesEnfantMajeurACharge}
                  onCheckedChange={(checked) =>
                    handleChange("fo_pensionsPercuesEnfantMajeurACharge", checked as boolean)
                  }
                />
                <Label htmlFor="fo_pensionsPercuesEnfantMajeurACharge" className="font-medium">
                  Avez-vous perçu des pensions pour enfant majeur à charge?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_prestationsAVSSPC"
                  checked={formData.fo_prestationsAVSSPC}
                  onCheckedChange={(checked) => handleChange("fo_prestationsAVSSPC", checked as boolean)}
                />
                <Label htmlFor="fo_prestationsAVSSPC" className="font-medium">
                  Avez-vous reçu des prestations AVS/SPC?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_prestationsFamilialesSPC"
                  checked={formData.fo_prestationsFamilialesSPC}
                  onCheckedChange={(checked) => handleChange("fo_prestationsFamilialesSPC", checked as boolean)}
                />
                <Label htmlFor="fo_prestationsFamilialesSPC" className="font-medium">
                  Avez-vous reçu des prestations familiales SPC?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_prestationsVilleCommune"
                  checked={formData.fo_prestationsVilleCommune}
                  onCheckedChange={(checked) => handleChange("fo_prestationsVilleCommune", checked as boolean)}
                />
                <Label htmlFor="fo_prestationsVilleCommune" className="font-medium">
                  Avez-vous reçu des prestations de la ville ou de la commune?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_allocationsImpotents"
                  checked={formData.fo_allocationsImpotents}
                  onCheckedChange={(checked) => handleChange("fo_allocationsImpotents", checked as boolean)}
                />
                <Label htmlFor="fo_allocationsImpotents" className="font-medium">
                  Avez-vous reçu des allocations pour impotents?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_reparationTortMoral"
                  checked={formData.fo_reparationTortMoral}
                  onCheckedChange={(checked) => handleChange("fo_reparationTortMoral", checked as boolean)}
                />
                <Label htmlFor="fo_reparationTortMoral" className="font-medium">
                  Avez-vous reçu des réparations pour tort moral?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_hospiceGeneral"
                  checked={formData.fo_hospiceGeneral}
                  onCheckedChange={(checked) => handleChange("fo_hospiceGeneral", checked as boolean)}
                />
                <Label htmlFor="fo_hospiceGeneral" className="font-medium">
                  Avez-vous reçu des prestations de l&apos;Hospice Général?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_institutionBienfaisance"
                  checked={formData.fo_institutionBienfaisance}
                  onCheckedChange={(checked) => handleChange("fo_institutionBienfaisance", checked as boolean)}
                />
                <Label htmlFor="fo_institutionBienfaisance" className="font-medium">
                  Avez-vous reçu des prestations d&apos;une institution de bienfaisance?
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
