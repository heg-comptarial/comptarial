"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export interface PensionAlimentaireData {
  enfant_id?: number
  statut: "verse" | "recu"
  montantContribution: string
  nom: string
  prenom: string
  noContribuable: string
}

interface PensionAlimentaireProps {
  enfantId: number
  data: PensionAlimentaireData | null
  hasPension: boolean
  onHasPensionChange: (hasPension: boolean) => void
  onUpdate: (data: PensionAlimentaireData) => void
}

export default function PensionAlimentaire({
  enfantId,
  data,
  hasPension,
  onHasPensionChange,
  onUpdate,
}: PensionAlimentaireProps) {
  const [formData, setFormData] = useState<PensionAlimentaireData>({
    enfant_id: enfantId,
    statut: "verse",
    montantContribution: "0",
    nom: "",
    prenom: "",
    noContribuable: "",
  })

  // Initialiser les données du formulaire si elles existent
  useEffect(() => {
    if (data) {
      setFormData(data)
    } else {
      // Réinitialiser avec l'ID de l'enfant
      setFormData({
        enfant_id: enfantId,
        statut: "verse",
        montantContribution: "0",
        nom: "",
        prenom: "",
        noContribuable: "",
      })
    }
  }, [data, enfantId])

  // Mettre à jour les données
  const handleChange = <K extends keyof PensionAlimentaireData>(field: K, value: PensionAlimentaireData[K]) => {
    const updatedData = {
      ...formData,
      [field]: value,
    }
    setFormData(updatedData)
    onUpdate(updatedData)
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Pension alimentaire</h4>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`pensionAlimentaire-${enfantId}`}
            checked={hasPension}
            onCheckedChange={(checked) => onHasPensionChange(checked as boolean)}
          />
          <Label htmlFor={`pensionAlimentaire-${enfantId}`}>Pension alimentaire concernant cet enfant</Label>
        </div>
      </div>

      {hasPension && (
        <Card>
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`pensionAlimentaireStatut-${enfantId}`}>Statut de la pension</Label>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`pensionAlimentaireStatut-verse-${enfantId}`}
                    name={`pensionAlimentaireStatut-${enfantId}`}
                    value="verse"
                    checked={formData.statut === "verse"}
                    onChange={() => handleChange("statut", "verse")}
                    aria-label="Pension versée"
                    title="Pension versée"
                  />
                  <Label htmlFor={`pensionAlimentaireStatut-verse-${enfantId}`}>Versée</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`pensionAlimentaireStatut-recu-${enfantId}`}
                    name={`pensionAlimentaireStatut-${enfantId}`}
                    value="recu"
                    checked={formData.statut === "recu"}
                    onChange={() => handleChange("statut", "recu")}
                    aria-label="Pension reçue"
                    title="Pension reçue"
                  />
                  <Label htmlFor={`pensionAlimentaireStatut-recu-${enfantId}`}>Reçue</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`montantContribution-${enfantId}`}>Montant annuel (CHF)</Label>
              <Input
                id={`montantContribution-${enfantId}`}
                type="number"
                min="0"
                step="0.01"
                value={formData.montantContribution}
                onChange={(e) => handleChange("montantContribution", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`nom-${enfantId}`}>
                {formData.statut === "verse" ? "Nom du bénéficiaire" : "Nom du débiteur"}
              </Label>
              <Input
                id={`nom-${enfantId}`}
                value={formData.nom}
                onChange={(e) => handleChange("nom", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`prenom-${enfantId}`}>
                {formData.statut === "verse" ? "Prénom du bénéficiaire" : "Prénom du débiteur"}
              </Label>
              <Input
                id={`prenom-${enfantId}`}
                value={formData.prenom}
                onChange={(e) => handleChange("prenom", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`noContribuable-${enfantId}`}>
                {formData.statut === "verse" ? "N° contribuable du bénéficiaire" : "N° contribuable du débiteur"}
              </Label>
              <Input
                id={`noContribuable-${enfantId}`}
                value={formData.noContribuable}
                onChange={(e) => handleChange("noContribuable", e.target.value)}
                required
              />
            </div>

 
          </CardContent>
        </Card>
      )}
    </div>
  )
}
