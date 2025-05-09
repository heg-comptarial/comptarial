"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"

interface AutrePersonneProps {
  data: AutrePersonneData | null
  onUpdate: (data: AutrePersonneData) => void
  onNext: () => void
  onPrev: () => void
}

export interface PersonneACharge {
  nom: string
  prenom: string
  dateNaissance: string
  degreParente: string
  nbPersonneParticipation: string
  vieAvecPersonneCharge: boolean
  revenusBrutPersonneACharge: string
  fortuneNetPersonneACharge: string
  montantVerseAPersonneACharge: string
  fo_preuveVersementEffectue: boolean
}

export interface AutrePersonneData {
  personnesACharge: PersonneACharge[]
}

export default function AutrePersonne({ data, onUpdate, onNext, onPrev }: AutrePersonneProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<AutrePersonneData>({
    personnesACharge: [],
  })

  // Initialiser les données du formulaire si elles existent
  useEffect(() => {
    if (data) {
      setFormData(data)
    } else {
      // Si pas de données, initialiser avec une personne à charge vide
      addPersonneACharge()
    }
  }, [data])

  // Ajouter une personne à charge
  const addPersonneACharge = () => {
    setFormData((prev) => ({
      ...prev,
      personnesACharge: [
        ...prev.personnesACharge,
        {
          nom: "",
          prenom: "",
          dateNaissance: "",
          degreParente: "parents",
          nbPersonneParticipation: "1",
          vieAvecPersonneCharge: false,
          revenusBrutPersonneACharge: "0",
          fortuneNetPersonneACharge: "0",
          montantVerseAPersonneACharge: "0",
          fo_preuveVersementEffectue: false,
        },
      ],
    }))
  }

  // Supprimer une personne à charge
  const removePersonneACharge = (index: number) => {
    const updatedPersonnes = [...formData.personnesACharge]
    updatedPersonnes.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      personnesACharge: updatedPersonnes,
    }))
  }

  // Mettre à jour une personne à charge
  const updatePersonneACharge = (index: number, field: keyof PersonneACharge, value: string | boolean) => {
    const updatedPersonnes = [...formData.personnesACharge]
    updatedPersonnes[index] = {
      ...updatedPersonnes[index],
      [field]: value,
    }
    setFormData((prev) => ({
      ...prev,
      personnesACharge: updatedPersonnes,
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
      <h3 className="text-lg font-medium">Autres personnes à charge</h3>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-6">
              {formData.personnesACharge.map((personne, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-md">Personne à charge {index + 1}</CardTitle>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removePersonneACharge(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`nom-${index}`}>Nom</Label>
                        <Input
                          id={`nom-${index}`}
                          value={personne.nom}
                          onChange={(e) => updatePersonneACharge(index, "nom", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`prenom-${index}`}>Prénom</Label>
                        <Input
                          id={`prenom-${index}`}
                          value={personne.prenom}
                          onChange={(e) => updatePersonneACharge(index, "prenom", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`dateNaissance-${index}`}>Date de naissance</Label>
                      <Input
                        id={`dateNaissance-${index}`}
                        type="date"
                        value={personne.dateNaissance}
                        onChange={(e) => updatePersonneACharge(index, "dateNaissance", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`degreParente-${index}`}>Degré de parenté</Label>
                      <Select
                        value={personne.degreParente}
                        onValueChange={(value) => updatePersonneACharge(index, "degreParente", value)}
                      >
                        <SelectTrigger id={`degreParente-${index}`}>
                          <SelectValue placeholder="Sélectionnez le degré de parenté" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="parents">Parents</SelectItem>
                          <SelectItem value="enfant">Enfant majeur</SelectItem>
                          <SelectItem value="grands-parents">Grands-parents</SelectItem>
                          <SelectItem value="frere-soeur">Frère/Sœur</SelectItem>
                          <SelectItem value="oncle-tante">Oncle/Tante</SelectItem>
                          <SelectItem value="neuveu-niece">Neveu/Nièce</SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`nbPersonneParticipation-${index}`}>
                        Nombre de personnes participant à l&apos;entretien
                      </Label>
                      <Input
                        id={`nbPersonneParticipation-${index}`}
                        type="number"
                        min="1"
                        value={personne.nbPersonneParticipation}
                        onChange={(e) => updatePersonneACharge(index, "nbPersonneParticipation", e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`vieAvecPersonneCharge-${index}`}
                        checked={personne.vieAvecPersonneCharge}
                        onCheckedChange={(checked) =>
                          updatePersonneACharge(index, "vieAvecPersonneCharge", checked as boolean)
                        }
                      />
                      <Label htmlFor={`vieAvecPersonneCharge-${index}`} className="font-medium">
                        Cette personne vit-elle avec vous?
                      </Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`revenusBrutPersonneACharge-${index}`}>
                        Revenus bruts de la personne à charge (CHF)
                      </Label>
                      <Input
                        id={`revenusBrutPersonneACharge-${index}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={personne.revenusBrutPersonneACharge}
                        onChange={(e) => updatePersonneACharge(index, "revenusBrutPersonneACharge", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`fortuneNetPersonneACharge-${index}`}>
                        Fortune nette de la personne à charge (CHF)
                      </Label>
                      <Input
                        id={`fortuneNetPersonneACharge-${index}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={personne.fortuneNetPersonneACharge}
                        onChange={(e) => updatePersonneACharge(index, "fortuneNetPersonneACharge", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`montantVerseAPersonneACharge-${index}`}>
                        Montant versé à la personne à charge (CHF)
                      </Label>
                      <Input
                        id={`montantVerseAPersonneACharge-${index}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={personne.montantVerseAPersonneACharge}
                        onChange={(e) => updatePersonneACharge(index, "montantVerseAPersonneACharge", e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`fo_preuveVersementEffectue-${index}`}
                        checked={personne.fo_preuveVersementEffectue}
                        onCheckedChange={(checked) =>
                          updatePersonneACharge(index, "fo_preuveVersementEffectue", checked as boolean)
                        }
                      />
                      <Label htmlFor={`fo_preuveVersementEffectue-${index}`} className="font-medium">
                        Avez-vous une preuve du versement effectué?
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button type="button" variant="outline" className="w-full" onClick={addPersonneACharge}>
                <Plus className="h-4 w-4 mr-2" /> Ajouter une personne à charge
              </Button>
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
