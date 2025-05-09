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

interface ImmobiliersProps {
  data: ImmobiliersData | null
  onUpdate: (data: ImmobiliersData) => void
  onNext: () => void
  onPrev: () => void
}

export interface Immobilier {
  statut: string
  canton: string
  commune: string
  pays: string
  noParcelleGeneve: string
  adresseComplete: string
  anneeConstruction: string
  occupeDesLe: string
  dateAchat: string
  pourcentageProprietaire: string
  autreProprietaire: string
  prixAchat: string
  valeurLocativeBrut: string
  loyersEncaisses: string
  fraisEntretienDeductibles: string
  fo_bienImmobilier: boolean
  fo_attestationValeurLocative: boolean
  fo_taxeFonciereBiensEtranger: boolean
  fo_factureEntretienImmeuble: boolean
}

export interface ImmobiliersData {
  immobiliers: Immobilier[]
}

export default function Immobiliers({ data, onUpdate, onNext, onPrev }: ImmobiliersProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<ImmobiliersData>({
    immobiliers: [],
  })

  // Initialiser les données du formulaire si elles existent
  useEffect(() => {
    if (data) {
      setFormData(data)
    } else {
      // Si pas de données, initialiser avec un bien immobilier vide
      setFormData({
        immobiliers: [
          {
            statut: "occupe",
            canton: "",
            commune: "",
            pays: "Suisse",
            noParcelleGeneve: "",
            adresseComplete: "",
            anneeConstruction: "",
            occupeDesLe: "",
            dateAchat: "",
            pourcentageProprietaire: "100",
            autreProprietaire: "",
            prixAchat: "",
            valeurLocativeBrut: "",
            loyersEncaisses: "",
            fraisEntretienDeductibles: "",
            fo_bienImmobilier: true,
            fo_attestationValeurLocative: false,
            fo_taxeFonciereBiensEtranger: false,
            fo_factureEntretienImmeuble: false,
          },
        ],
      })
    }
  }, [data])

  // Ajouter un bien immobilier
  const addImmobilier = () => {
    setFormData((prev) => ({
      ...prev,
      immobiliers: [
        ...prev.immobiliers,
        {
          statut: "occupe",
          canton: "",
          commune: "",
          pays: "Suisse",
          noParcelleGeneve: "",
          adresseComplete: "",
          anneeConstruction: "",
          occupeDesLe: "",
          dateAchat: "",
          pourcentageProprietaire: "100",
          autreProprietaire: "",
          prixAchat: "",
          valeurLocativeBrut: "",
          loyersEncaisses: "",
          fraisEntretienDeductibles: "",
          fo_bienImmobilier: true,
          fo_attestationValeurLocative: false,
          fo_taxeFonciereBiensEtranger: false,
          fo_factureEntretienImmeuble: false,
        },
      ],
    }))
  }

  // Supprimer un bien immobilier
  const removeImmobilier = (index: number) => {
    const updatedImmobiliers = [...formData.immobiliers]
    updatedImmobiliers.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      immobiliers: updatedImmobiliers,
    }))
  }

  // Mettre à jour un bien immobilier
  const updateImmobilier = (index: number, field: keyof Immobilier, value: string | boolean) => {
    const updatedImmobiliers = [...formData.immobiliers]
    updatedImmobiliers[index] = {
      ...updatedImmobiliers[index],
      [field]: value,
    }
    setFormData((prev) => ({
      ...prev,
      immobiliers: updatedImmobiliers,
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
      <h3 className="text-lg font-medium">Biens immobiliers</h3>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-6">
              {formData.immobiliers.map((immobilier, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-md">Bien immobilier {index + 1}</CardTitle>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeImmobilier(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`statut-${index}`}>Statut du bien</Label>
                      <Select
                        value={immobilier.statut}
                        onValueChange={(value) => updateImmobilier(index, "statut", value)}
                      >
                        <SelectTrigger id={`statut-${index}`}>
                          <SelectValue placeholder="Sélectionnez le statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="occupe">Occupé par le propriétaire</SelectItem>
                          <SelectItem value="loue">Loué</SelectItem>
                          <SelectItem value="commercial-industriel">Commercial/Industriel</SelectItem>
                          <SelectItem value="ppe">PPE</SelectItem>
                          <SelectItem value="hlm">HLM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`canton-${index}`}>Canton</Label>
                        <Input
                          id={`canton-${index}`}
                          value={immobilier.canton}
                          onChange={(e) => updateImmobilier(index, "canton", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`commune-${index}`}>Commune</Label>
                        <Input
                          id={`commune-${index}`}
                          value={immobilier.commune}
                          onChange={(e) => updateImmobilier(index, "commune", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`pays-${index}`}>Pays</Label>
                      <Input
                        id={`pays-${index}`}
                        value={immobilier.pays}
                        onChange={(e) => updateImmobilier(index, "pays", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`noParcelleGeneve-${index}`}>N° de parcelle (Genève)</Label>
                      <Input
                        id={`noParcelleGeneve-${index}`}
                        value={immobilier.noParcelleGeneve}
                        onChange={(e) => updateImmobilier(index, "noParcelleGeneve", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`adresseComplete-${index}`}>Adresse complète</Label>
                      <Input
                        id={`adresseComplete-${index}`}
                        value={immobilier.adresseComplete}
                        onChange={(e) => updateImmobilier(index, "adresseComplete", e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`anneeConstruction-${index}`}>Année de construction</Label>
                        <Input
                          id={`anneeConstruction-${index}`}
                          value={immobilier.anneeConstruction}
                          onChange={(e) => updateImmobilier(index, "anneeConstruction", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`dateAchat-${index}`}>Date d&apos;achat</Label>
                        <Input
                          id={`dateAchat-${index}`}
                          type="date"
                          value={immobilier.dateAchat}
                          onChange={(e) => updateImmobilier(index, "dateAchat", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {immobilier.statut === "occupe" && (
                      <div className="space-y-2">
                        <Label htmlFor={`occupeDesLe-${index}`}>Occupé depuis le</Label>
                        <Input
                          id={`occupeDesLe-${index}`}
                          type="date"
                          value={immobilier.occupeDesLe}
                          onChange={(e) => updateImmobilier(index, "occupeDesLe", e.target.value)}
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`pourcentageProprietaire-${index}`}>Pourcentage de propriété (%)</Label>
                        <Input
                          id={`pourcentageProprietaire-${index}`}
                          type="number"
                          min="0"
                          max="100"
                          value={immobilier.pourcentageProprietaire}
                          onChange={(e) => updateImmobilier(index, "pourcentageProprietaire", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`autreProprietaire-${index}`}>Autre propriétaire</Label>
                        <Input
                          id={`autreProprietaire-${index}`}
                          value={immobilier.autreProprietaire}
                          onChange={(e) => updateImmobilier(index, "autreProprietaire", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`prixAchat-${index}`}>Prix d&apos;achat (CHF)</Label>
                      <Input
                        id={`prixAchat-${index}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={immobilier.prixAchat}
                        onChange={(e) => updateImmobilier(index, "prixAchat", e.target.value)}
                        required
                      />
                    </div>

                    {(immobilier.statut === "occupe" || immobilier.statut === "ppe" || immobilier.statut === "hlm") && (
                      <div className="space-y-2">
                        <Label htmlFor={`valeurLocativeBrut-${index}`}>Valeur locative brute (CHF)</Label>
                        <Input
                          id={`valeurLocativeBrut-${index}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={immobilier.valeurLocativeBrut}
                          onChange={(e) => updateImmobilier(index, "valeurLocativeBrut", e.target.value)}
                        />
                      </div>
                    )}

                    {immobilier.statut === "loue" && (
                      <div className="space-y-2">
                        <Label htmlFor={`loyersEncaisses-${index}`}>Loyers encaissés (CHF)</Label>
                        <Input
                          id={`loyersEncaisses-${index}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={immobilier.loyersEncaisses}
                          onChange={(e) => updateImmobilier(index, "loyersEncaisses", e.target.value)}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor={`fraisEntretienDeductibles-${index}`}>
                        Frais d&apos;entretien déductibles (CHF)
                      </Label>
                      <Input
                        id={`fraisEntretienDeductibles-${index}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={immobilier.fraisEntretienDeductibles}
                        onChange={(e) => updateImmobilier(index, "fraisEntretienDeductibles", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-4 pt-4">
                      <h4 className="font-medium">Documents disponibles</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`fo_attestationValeurLocative-${index}`}
                            checked={immobilier.fo_attestationValeurLocative}
                            onCheckedChange={(checked) =>
                              updateImmobilier(index, "fo_attestationValeurLocative", checked as boolean)
                            }
                          />
                          <Label htmlFor={`fo_attestationValeurLocative-${index}`}>
                            Attestation de valeur locative
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`fo_taxeFonciereBiensEtranger-${index}`}
                            checked={immobilier.fo_taxeFonciereBiensEtranger}
                            onCheckedChange={(checked) =>
                              updateImmobilier(index, "fo_taxeFonciereBiensEtranger", checked as boolean)
                            }
                          />
                          <Label htmlFor={`fo_taxeFonciereBiensEtranger-${index}`}>
                            Taxe foncière (biens à l&apos;étranger)
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`fo_factureEntretienImmeuble-${index}`}
                            checked={immobilier.fo_factureEntretienImmeuble}
                            onCheckedChange={(checked) =>
                              updateImmobilier(index, "fo_factureEntretienImmeuble", checked as boolean)
                            }
                          />
                          <Label htmlFor={`fo_factureEntretienImmeuble-${index}`}>
                            Factures d&apos;entretien de l&apos;immeuble
                          </Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button type="button" variant="outline" className="w-full" onClick={addImmobilier}>
                <Plus className="h-4 w-4 mr-2" /> Ajouter un bien immobilier
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
