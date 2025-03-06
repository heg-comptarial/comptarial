"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { PhoneInput } from "@/components/ui/phone-input"
import { Eye, EyeOff, Upload } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SignupPage() {
  // État pour le type d'utilisateur (madame, monsieur ou entreprise)
  const [userType, setUserType] = useState<"madame" | "monsieur" | "entreprise">("madame")

  // État pour le type d'entreprise (nouvelle ou ancienne)
  const [entrepriseType, setEntrepriseType] = useState<"nouvelle" | "ancienne">("nouvelle")

  // État pour l'état civil
  const [etatCivil, setEtatCivil] = useState<"celibataire" | "marie" | "divorce">("celibataire")

  // États pour les prestations d'entreprise
  const [prestations, setPrestations] = useState({
    fiscales: false,
    comptable: false,
    admin: false,
    salariales: false,
  })

  // États pour les champs du formulaire
  const [formData, setFormData] = useState({
    // Informations personnelles
    nomPrenom: "",
    adresse: "",
    localite: "",
    codePostal: "",
    email: "",
    telephone: "",
    dateNaissance: "",
    nationalite: "",

    // Informations du conjoint
    conjointNomPrenom: "",
    conjointAdresse: "",
    conjointLocalite: "",
    conjointCodePostal: "",
    conjointDateNaissance: "",
    conjointNationalite: "",

    // Informations d'entreprise
    grandLivrePdf: null as File | null,

    // Mot de passe
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Gestion du changement de numéro de téléphone
  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({ ...prev, telephone: value }))
  }

  // Gestion des changements de prestations
  const handlePrestationChange = (prestation: keyof typeof prestations, checked: boolean) => {
    setPrestations((prev) => ({ ...prev, [prestation]: checked }))
  }

  // Gestion du téléchargement de fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, grandLivrePdf: e.target.files![0] }))
    }
  }

  // Vérifier si l'utilisateur est un particulier (madame ou monsieur)
  const isParticulier = userType === "madame" || userType === "monsieur"

  // Vérifier si l'utilisateur est marié
  const isMarie = etatCivil === "marie"

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Type d'utilisateur:", userType)
    console.log("Données du formulaire:", formData)
    if (userType === "entreprise") {
      console.log("Type d'entreprise:", entrepriseType)
      console.log("Prestations:", prestations)
    }
    if (isParticulier) {
      console.log("État civil:", etatCivil)
    }
    // Logique d'inscription à implémenter ici
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-background p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">INSCRIPTION</h1>

      <Card className="w-full max-w-2xl mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Créer un compte</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Choix du type d'utilisateur */}
            <div className="space-y-2">
              <Label>Type de compte</Label>
              <RadioGroup
                defaultValue={userType}
                onValueChange={(value) => setUserType(value as "madame" | "monsieur" | "entreprise")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="madame" id="madame" />
                  <Label htmlFor="madame">Madame</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monsieur" id="monsieur" />
                  <Label htmlFor="monsieur">Monsieur</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="entreprise" id="entreprise" />
                  <Label htmlFor="entreprise">Entreprise</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Champs communs */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nomPrenom">{isParticulier ? "Nom et prénom" : "Raison sociale"}</Label>
                <Input id="nomPrenom" name="nomPrenom" value={formData.nomPrenom} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adresse">Adresse</Label>
                <Input id="adresse" name="adresse" value={formData.adresse} onChange={handleChange} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="localite">Localité</Label>
                  <Input id="localite" name="localite" value={formData.localite} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codePostal">Code postal</Label>
                  <Input
                    id="codePostal"
                    name="codePostal"
                    value={formData.codePostal}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>

              <PhoneInput
                id="telephone"
                label="Numéro de téléphone"
                value={formData.telephone}
                onChange={handlePhoneChange}
                required
              />
            </div>

            {/* Champs spécifiques pour particuliers */}
            {isParticulier && (
              <div className="space-y-4 border p-4 rounded-lg">
                <h3 className="font-medium text-lg">Informations personnelles</h3>

                <div className="space-y-2">
                  <Label htmlFor="dateNaissance">Date de naissance</Label>
                  <Input
                    id="dateNaissance"
                    name="dateNaissance"
                    type="date"
                    value={formData.dateNaissance}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationalite">Nationalité</Label>
                  <Input
                    id="nationalite"
                    name="nationalite"
                    value={formData.nationalite}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="etatCivil">État civil</Label>
                  <Select
                    defaultValue={etatCivil}
                    onValueChange={(value) => setEtatCivil(value as "celibataire" | "marie" | "divorce")}
                  >
                    <SelectTrigger id="etatCivil">
                      <SelectValue placeholder="Sélectionnez votre état civil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="celibataire">Célibataire</SelectItem>
                      <SelectItem value="marie">Marié(e)/Partenariat</SelectItem>
                      <SelectItem value="divorce">Divorcé(e)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Informations du conjoint si marié */}
                {isMarie && (
                  <div className="space-y-4 border p-4 rounded-lg mt-4">
                    <h3 className="font-medium">Informations du conjoint</h3>

                    <div className="space-y-2">
                      <Label htmlFor="conjointNomPrenom">Nom et prénom</Label>
                      <Input
                        id="conjointNomPrenom"
                        name="conjointNomPrenom"
                        value={formData.conjointNomPrenom}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="conjointAdresse">Adresse</Label>
                      <Input
                        id="conjointAdresse"
                        name="conjointAdresse"
                        value={formData.conjointAdresse}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="conjointLocalite">Localité</Label>
                        <Input
                          id="conjointLocalite"
                          name="conjointLocalite"
                          value={formData.conjointLocalite}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="conjointCodePostal">Code postal</Label>
                        <Input
                          id="conjointCodePostal"
                          name="conjointCodePostal"
                          value={formData.conjointCodePostal}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="conjointDateNaissance">Date de naissance</Label>
                      <Input
                        id="conjointDateNaissance"
                        name="conjointDateNaissance"
                        type="date"
                        value={formData.conjointDateNaissance}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="conjointNationalite">Nationalité</Label>
                      <Input
                        id="conjointNationalite"
                        name="conjointNationalite"
                        value={formData.conjointNationalite}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Champs spécifiques pour entreprises */}
            {userType === "entreprise" && (
              <div className="space-y-4 border p-4 rounded-lg">
                <h3 className="font-medium text-lg">Informations de l'entreprise</h3>

                <div className="space-y-2">
                  <Label>Type d'entreprise</Label>
                  <RadioGroup
                    defaultValue={entrepriseType}
                    onValueChange={(value) => setEntrepriseType(value as "nouvelle" | "ancienne")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nouvelle" id="nouvelle" />
                      <Label htmlFor="nouvelle">Nouvelle (créée cette année)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ancienne" id="ancienne" />
                      <Label htmlFor="ancienne">Ancienne</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Grand Livre pour nouvelle entreprise */}
                {entrepriseType === "nouvelle" && (
                  <div className="space-y-2">
                    <Label htmlFor="grandLivre">Grand Livre</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="grandLivre"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="flex-1"
                        required
                      />
                      <Button type="button" size="icon" variant="outline">
                        <Upload className="h-4 w-4" />
                        <span className="sr-only">Télécharger</span>
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Veuillez télécharger votre Grand Livre au format PDF
                    </p>
                  </div>
                )}

                {/* Prestations pour toutes les entreprises */}
                <div className="space-y-2">
                  <Label>Quelles prestations ?</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="fiscales"
                        checked={prestations.fiscales}
                        onCheckedChange={(checked) => handlePrestationChange("fiscales", checked as boolean)}
                      />
                      <Label htmlFor="fiscales">Fiscales</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="comptable"
                        checked={prestations.comptable}
                        onCheckedChange={(checked) => handlePrestationChange("comptable", checked as boolean)}
                      />
                      <Label htmlFor="comptable">Comptable</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="admin"
                        checked={prestations.admin}
                        onCheckedChange={(checked) => handlePrestationChange("admin", checked as boolean)}
                      />
                      <Label htmlFor="admin">Admin</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="salariales"
                        checked={prestations.salariales}
                        onCheckedChange={(checked) => handlePrestationChange("salariales", checked as boolean)}
                      />
                      <Label htmlFor="salariales">Salariales</Label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mot de passe */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">
                      {showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                    </span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">
                      {showConfirmPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                    </span>
                  </Button>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full">
              S'inscrire
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Vous avez déjà un compte?{" "}
            <Link href="/connexion" className="text-primary hover:underline">
              Se connecter
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

