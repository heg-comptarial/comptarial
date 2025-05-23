"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"

interface ConjointProps {
  data: ConjointData | null
  onUpdate: (data: ConjointData) => void
  onNext: () => void
  onPrev: () => void
}

export interface ConjointData {
  nom: string
  prenom: string
  email: string
  localite: string
  adresse: string
  codePostal: string
  numeroTelephone: string
  etatCivil: string
  dateNaissance: string
  nationalite: string
  professionExercee: string
  contributionReligieuse:
    | "Église Catholique Chrétienne"
    | "Église Catholique Romaine"
    | "Église Protestante"
    | "Aucune organisation religieuse"
  }

export default function Conjoint({ data, onUpdate, onNext, onPrev }: ConjointProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<ConjointData>({
    nom: data?.nom || "",
    prenom: data?.prenom || "",
    email: data?.email || "",
    localite: data?.localite || "",
    adresse: data?.adresse || "",
    codePostal: data?.codePostal || "",
    numeroTelephone: data?.numeroTelephone || "",
    etatCivil: data?.etatCivil || "Marié-e",
    dateNaissance: data?.dateNaissance || "",
    nationalite: data?.nationalite || "",
    professionExercee: data?.professionExercee || "",
    contributionReligieuse: data?.contributionReligieuse || "Aucune organisation religieuse",
  });

  // Initialiser les données du formulaire si elles existent
useEffect(() => {
  if (data) {
    // Vérifie et merge uniquement si data est complet
      setFormData(prev => ({
        ...prev,
        ...data,
        // Force le type pour contributionReligieuse
        contributionReligieuse: data.contributionReligieuse as ContributionReligieuse
      }));
    }
  }, [data])

  // Gérer les changements dans le formulaire
  const handleChange = (field: keyof ConjointData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (onUpdate) onUpdate({ ...formData, [field]: value });
  };

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

  const contributions = [
  "Église Catholique Chrétienne",
  "Église Catholique Romaine",
  "Église Protestante",
  "Aucune organisation religieuse",
] as const
type ContributionReligieuse = typeof contributions[number]

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Informations du conjoint</h3>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => handleChange("nom", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input
                  id="prenom"
                  value={formData.prenom}
                  onChange={(e) => handleChange("prenom", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numeroTelephone">Numéro de téléphone</Label>
              <Input
                id="numeroTelephone"
                value={formData.numeroTelephone}
                onChange={(e) => handleChange("numeroTelephone", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateNaissance">Date de naissance</Label>
              <Input
                id="dateNaissance"
                type="date"
                value={formData.dateNaissance}
                onChange={(e) => handleChange("dateNaissance", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationalite">Nationalité</Label>
              <Input
                id="nationalite"
                value={formData.nationalite}
                onChange={(e) => handleChange("nationalite", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="etatCivil">État civil</Label>
              <Select
                value={formData.etatCivil}
                onValueChange={(value) => handleChange("etatCivil", value)}
              >
                <SelectTrigger id="etatCivil">
                  <SelectValue placeholder="Sélectionnez l'état civil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Marié-e">Marié(e)</SelectItem>
                  <SelectItem value="Partenariat">Partenariat</SelectItem>
                  <SelectItem value="Séparé-e">Séparé(e)</SelectItem>
                  <SelectItem value="Divorcé-e">Divorcé(e)</SelectItem>
                  <SelectItem value="Veuf-Veuve">Veuf/Veuve</SelectItem>
                  <SelectItem value="Partenariat séparé">Partenariat séparé</SelectItem>
                  <SelectItem value="Partenariat dissous">Partenariat dissous</SelectItem>
                  <SelectItem value="Partenariat veuf">Partenariat veuf</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="professionExercee">Profession exercée</Label>
              <Input
                id="professionExercee"
                value={formData.professionExercee}
                onChange={(e) => handleChange("professionExercee", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contributionReligieuse">Contribution religieuse</Label>
<Select
  value={formData.contributionReligieuse}
  onValueChange={(value) => handleChange("contributionReligieuse", value)}
>
  <SelectTrigger>
    <SelectValue placeholder="Sélectionnez..." />
  </SelectTrigger>
  <SelectContent>
    {contributions.map(item => (
      <SelectItem key={item} value={item}>
        {item}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Input
                id="adresse"
                value={formData.adresse}
                onChange={(e) => handleChange("adresse", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codePostal">Code postal</Label>
                <Input
                  id="codePostal"
                  value={formData.codePostal}
                  onChange={(e) => handleChange("codePostal", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="localite">Localité</Label>
                <Input
                  id="localite"
                  value={formData.localite}
                  onChange={(e) => handleChange("localite", e.target.value)}
                  required
                />
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
