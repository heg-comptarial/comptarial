"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

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

  // Initialiser les données du formulaire
  useEffect(() => {
    if (data) {
      setFormData(data)
    }
  }, [data])

  const handleChange = (field: keyof RevenuData, value: boolean | string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Validation des dates si interruption de travail est cochée
      if (formData.interruptionsTravailNonPayees) {
        if (!formData.interuptionsTravailNonPayeesDebut || !formData.interuptionsTravailNonPayeesFin) {
          throw new Error("Veuillez renseigner les dates de début et fin d'interruption")
        }
        
        const debut = new Date(formData.interuptionsTravailNonPayeesDebut)
        const fin = new Date(formData.interuptionsTravailNonPayeesFin)
        
        if (debut > fin) {
          throw new Error("La date de fin doit être postérieure à la date de début")
        }
      }

      // Mettre à jour les données dans le composant parent
      onUpdate(formData)
      
      // Passer à l'étape suivante
      onNext()
    } catch (error) {
      console.error("Erreur lors de la soumission:", error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Une erreur inattendue est survenue")
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
          <CardContent className="pt-6 space-y-6">
            {/* Section Revenus principaux */}
            <div className="space-y-4">
              <h4 className="font-medium text-base">Sources de revenus</h4>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="indemnites"
                    checked={formData.indemnites}
                    onCheckedChange={(checked) => handleChange("indemnites", checked as boolean)}
                  />
                  <Label htmlFor="indemnites" className="font-normal">
                    Indemnités (chômage, maladie, accident, maternité)
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="interruptionsTravailNonPayees"
                    checked={formData.interruptionsTravailNonPayees}
                    onCheckedChange={(checked) => handleChange("interruptionsTravailNonPayees", checked as boolean)}
                  />
                  <Label htmlFor="interruptionsTravailNonPayees" className="font-normal">
                    Interruptions de travail non payées
                  </Label>
                </div>

                {formData.interruptionsTravailNonPayees && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-8">
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

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="activiteIndependante"
                    checked={formData.activiteIndependante}
                    onCheckedChange={(checked) => handleChange("activiteIndependante", checked as boolean)}
                  />
                  <Label htmlFor="activiteIndependante" className="font-normal">
                    Activité indépendante
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="prestationsSociales"
                    checked={formData.prestationsSociales}
                    onCheckedChange={(checked) => handleChange("prestationsSociales", checked as boolean)}
                  />
                  <Label htmlFor="prestationsSociales" className="font-normal">
                    Prestations sociales (AVS/AI, LPP, Assurance militaire, etc.)
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="subsidesAssuranceMaladie"
                    checked={formData.subsidesAssuranceMaladie}
                    onCheckedChange={(checked) => handleChange("subsidesAssuranceMaladie", checked as boolean)}
                  />
                  <Label htmlFor="subsidesAssuranceMaladie" className="font-normal">
                    Subsides d&apos;assurance maladie
                  </Label>
                </div>
              </div>
            </div>

            {/* Section Documents */}
            <div className="space-y-4">
              <h4 className="font-medium text-base">Documents disponibles</h4>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="fo_certificatSalaire"
                    checked={formData.fo_certificatSalaire}
                    onCheckedChange={(checked) => handleChange("fo_certificatSalaire", checked as boolean)}
                  />
                  <Label htmlFor="fo_certificatSalaire" className="font-normal">
                    Certificat de salaire
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="fo_renteViagere"
                    checked={formData.fo_renteViagere}
                    onCheckedChange={(checked) => handleChange("fo_renteViagere", checked as boolean)}
                  />
                  <Label htmlFor="fo_renteViagere" className="font-normal">
                    Rente viagère
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="fo_allocationLogement"
                    checked={formData.fo_allocationLogement}
                    onCheckedChange={(checked) => handleChange("fo_allocationLogement", checked as boolean)}
                  />
                  <Label htmlFor="fo_allocationLogement" className="font-normal">
                    Allocation de logement
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="fo_preuveEncaissementSousLoc"
                    checked={formData.fo_preuveEncaissementSousLoc}
                    onCheckedChange={(checked) => handleChange("fo_preuveEncaissementSousLoc", checked as boolean)}
                  />
                  <Label htmlFor="fo_preuveEncaissementSousLoc" className="font-normal">
                    Preuves d&apos;encaissement de sous-location
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="fo_gainsAccessoires"
                    checked={formData.fo_gainsAccessoires}
                    onCheckedChange={(checked) => handleChange("fo_gainsAccessoires", checked as boolean)}
                  />
                  <Label htmlFor="fo_gainsAccessoires" className="font-normal">
                    Gains accessoires (jusqu&apos;à 2300 CHF non soumis à AVS)
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="fo_attestationAutresRevenus"
                    checked={formData.fo_attestationAutresRevenus}
                    onCheckedChange={(checked) => handleChange("fo_attestationAutresRevenus", checked as boolean)}
                  />
                  <Label htmlFor="fo_attestationAutresRevenus" className="font-normal">
                    Attestations d&apos;autres revenus
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="fo_etatFinancier"
                    checked={formData.fo_etatFinancier}
                    onCheckedChange={(checked) => handleChange("fo_etatFinancier", checked as boolean)}
                  />
                  <Label htmlFor="fo_etatFinancier" className="font-normal">
                    État financier (pour indépendants)
                  </Label>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
                {error}
              </div>
            )}
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
                Enregistrement...
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