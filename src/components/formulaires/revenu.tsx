"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import axios from "axios"

interface RevenuProps {
  data: RevenuData | null
  onUpdate: (data: RevenuData) => void
  onNext: () => void
  onPrev: () => void
}

export interface RevenuData {
  indemnites: boolean
  interruptionsTravailNonPayees: boolean
  interuptionsTravailNonPayeesDebut: string
  interuptionsTravailNonPayeesFin: string
  activiteIndependante: boolean
  prestationsSociales: boolean
  subsidesAssuranceMaladie: boolean
  fo_certificatSalaire: boolean
  fo_renteViagere: boolean
  fo_allocationLogement: boolean
  fo_preuveEncaissementSousLoc: boolean
  fo_gainsAccessoires: boolean
  fo_attestationAutresRevenus: boolean
  fo_etatFinancier: boolean
}

export default function Revenu({ data, onUpdate, onNext, onPrev }: RevenuProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<RevenuData>({
    indemnites: false,
    interruptionsTravailNonPayees: false,
    interuptionsTravailNonPayeesDebut: "",
    interuptionsTravailNonPayeesFin: "",
    activiteIndependante: false,
    prestationsSociales: false,
    subsidesAssuranceMaladie: false,
    fo_certificatSalaire: false,
    fo_renteViagere: false,
    fo_allocationLogement: false,
    fo_preuveEncaissementSousLoc: false,
    fo_gainsAccessoires: false,
    fo_attestationAutresRevenus: false,
    fo_etatFinancier: false,
  })

  // Initialiser les données du formulaire si elles existent
  useEffect(() => {
    if (data) {
      setFormData(data)
    }
  }, [data])

  // Gérer les changements dans le formulaire
  const handleChange = (field: keyof RevenuData, value: boolean | string) => {
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
      <h3 className="text-lg font-medium">Revenus</h3>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium">Sources de revenus</h4>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="indemnites"
                  checked={formData.indemnites}
                  onCheckedChange={(checked) => handleChange("indemnites", checked as boolean)}
                />
                <Label htmlFor="indemnites" className="font-medium">
                  Avez-vous perçu des indemnités (chômage, maladie, accident, maternité)?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="interruptionsTravailNonPayees"
                  checked={formData.interruptionsTravailNonPayees}
                  onCheckedChange={(checked) => handleChange("interruptionsTravailNonPayees", checked as boolean)}
                />
                <Label htmlFor="interruptionsTravailNonPayees" className="font-medium">
                  Avez-vous eu des interruptions de travail non payées?
                </Label>
              </div>

              {formData.interruptionsTravailNonPayees && (
                <div className="grid grid-cols-2 gap-4 ml-6">
                  <div className="space-y-2">
                    <Label htmlFor="interuptionsTravailNonPayeesDebut">Date de début</Label>
                    <Input
                      id="interuptionsTravailNonPayeesDebut"
                      type="date"
                      value={formData.interuptionsTravailNonPayeesDebut}
                      onChange={(e) => handleChange("interuptionsTravailNonPayeesDebut", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interuptionsTravailNonPayeesFin">Date de fin</Label>
                    <Input
                      id="interuptionsTravailNonPayeesFin"
                      type="date"
                      value={formData.interuptionsTravailNonPayeesFin}
                      onChange={(e) => handleChange("interuptionsTravailNonPayeesFin", e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="activiteIndependante"
                  checked={formData.activiteIndependante}
                  onCheckedChange={(checked) => handleChange("activiteIndependante", checked as boolean)}
                />
                <Label htmlFor="activiteIndependante" className="font-medium">
                  Exercez-vous une activité indépendante?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="prestationsSociales"
                  checked={formData.prestationsSociales}
                  onCheckedChange={(checked) => handleChange("prestationsSociales", checked as boolean)}
                />
                <Label htmlFor="prestationsSociales" className="font-medium">
                  Percevez-vous des prestations sociales (AVS/AI, LPP, Assurance militaire, Étrangères, Autres)?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="subsidesAssuranceMaladie"
                  checked={formData.subsidesAssuranceMaladie}
                  onCheckedChange={(checked) => handleChange("subsidesAssuranceMaladie", checked as boolean)}
                />
                <Label htmlFor="subsidesAssuranceMaladie" className="font-medium">
                  Recevez-vous des subsides d&apos;assurance maladie?
                </Label>
              </div>

              <h4 className="font-medium pt-4">Documents disponibles</h4>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_certificatSalaire"
                  checked={formData.fo_certificatSalaire}
                  onCheckedChange={(checked) => handleChange("fo_certificatSalaire", checked as boolean)}
                />
                <Label htmlFor="fo_certificatSalaire" className="font-medium">
                  Avez-vous un certificat de salaire?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_renteViagere"
                  checked={formData.fo_renteViagere}
                  onCheckedChange={(checked) => handleChange("fo_renteViagere", checked as boolean)}
                />
                <Label htmlFor="fo_renteViagere" className="font-medium">
                  Percevez-vous une rente viagère?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_allocationLogement"
                  checked={formData.fo_allocationLogement}
                  onCheckedChange={(checked) => handleChange("fo_allocationLogement", checked as boolean)}
                />
                <Label htmlFor="fo_allocationLogement" className="font-medium">
                  Recevez-vous une allocation de logement?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_preuveEncaissementSousLoc"
                  checked={formData.fo_preuveEncaissementSousLoc}
                  onCheckedChange={(checked) => handleChange("fo_preuveEncaissementSousLoc", checked as boolean)}
                />
                <Label htmlFor="fo_preuveEncaissementSousLoc" className="font-medium">
                  Avez-vous des preuves d&apos;encaissement de sous-location?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_gainsAccessoires"
                  checked={formData.fo_gainsAccessoires}
                  onCheckedChange={(checked) => handleChange("fo_gainsAccessoires", checked as boolean)}
                />
                <Label htmlFor="fo_gainsAccessoires" className="font-medium">
                  Avez-vous des gains accessoires (jusqu&apos;à 2300 CHF non soumis à AVS)?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_attestationAutresRevenus"
                  checked={formData.fo_attestationAutresRevenus}
                  onCheckedChange={(checked) => handleChange("fo_attestationAutresRevenus", checked as boolean)}
                />
                <Label htmlFor="fo_attestationAutresRevenus" className="font-medium">
                  Avez-vous des attestations d&apos;autres revenus?
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fo_etatFinancier"
                  checked={formData.fo_etatFinancier}
                  onCheckedChange={(checked) => handleChange("fo_etatFinancier", checked as boolean)}
                />
                <Label htmlFor="fo_etatFinancier" className="font-medium">
                  Disposez-vous d&apos;un état financier (pour indépendants)?
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
