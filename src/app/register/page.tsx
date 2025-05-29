"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PhoneInput } from "@/components/ui/phone-input"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // État pour le type d'utilisateur (madame, monsieur ou entreprise)
  const [userType, setUserType] = useState<"madame" | "monsieur" | "entreprise">("madame")

  // Initialisation des données du formulaire
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    motDePasse: "",
    localite: "",
    adresse: "",
    codePostal: "",
    numeroTelephone: "",
    role: "prive", // Valeur par défaut, sera mise à jour selon le type d'utilisateur
    statut: "pending", // Toujours "pending" pour les nouvelles inscriptions
    dateCreation: new Date().toISOString(),
  })

  // État pour la confirmation du mot de passe
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Mise à jour du rôle lorsque le type d'utilisateur change
  const handleUserTypeChange = (value: "madame" | "monsieur" | "entreprise") => {
    setUserType(value)
    // Définir le rôle comme "prive" pour madame/monsieur, "entreprise" pour entreprise
    setFormData((prev) => ({
      ...prev,
      role: value === "entreprise" ? "entreprise" : "prive",
    }))
  }

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Gestion du changement de numéro de téléphone
  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({ ...prev, numeroTelephone: value }))
  }

  // Fonction pour connecter l'utilisateur après inscription
  const loginUser = async (email: string, password: string) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      })

      if (response.data && response.data.token) {
        // Stocker le token d'authentification
        localStorage.setItem("auth_token", response.data.token)
        localStorage.setItem("user_id", response.data.user.user_id)
        return true
      }
      return false
    } catch (error) {
      console.error("Erreur lors de la connexion automatique:", error)
      return false
    }
  }

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Vérification que les mots de passe correspondent
    if (formData.motDePasse !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }

    // Mettre à jour la date de création au moment de la soumission
    const dataToSubmit = {
      ...formData,
      dateCreation: new Date().toISOString(),
    }

    setIsLoading(true)

    try {
      // 1. Envoyer les données d'inscription à l'API
      const response = await axios.post("http://127.0.0.1:8000/api/users-ins", dataToSubmit)

      console.log("Inscription réussie:", response.data)

      const userId = response.data.user_id // Récupérer l'ID de l'utilisateur créé

      // 2. Connecter automatiquement l'utilisateur
      const loginSuccess = await loginUser(formData.email, formData.motDePasse)

      if (loginSuccess) {
        // 3. Rediriger vers le dashboard
        router.push(`/dashboard/${userId}`)
      } else {
        // Si la connexion automatique échoue, rediriger vers la page de connexion
        console.error("Échec de la connexion automatique après l'inscription.")
        alert("Login échoué! Veuillez vous connecter.")
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error)

      if (axios.isAxiosError(error) && error.response) {
        // Afficher le message d'erreur du serveur si disponible
        setError(error.response.data.message || "Une erreur est survenue lors de l'inscription.")
      } else {
        setError("Une erreur est survenue lors de l'inscription. Veuillez réessayer.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-background p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">INSCRIPTION</h1>

      <Card className="w-full max-w-md mb-8">
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
                onValueChange={(value) => handleUserTypeChange(value as "madame" | "monsieur" | "entreprise")}
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
                <Label htmlFor="nom">{userType === "entreprise" ? "Raison sociale" : "Nom et prénom"}</Label>
                <Input id="nom" name="nom" value={formData.nom} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
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

              <PhoneInput
                id="numeroTelephone"
                label="Numéro de téléphone"
                value={formData.numeroTelephone}
                onChange={handlePhoneChange}
                required
              />

              <div className="space-y-2">
                <Label htmlFor="motDePasse">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="motDePasse"
                    name="motDePasse"
                    type={showPassword ? "text" : "password"}
                    value={formData.motDePasse}
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Inscription en cours...
                </>
              ) : (
                "S'inscrire"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Vous avez déjà un compte?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Se connecter
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

