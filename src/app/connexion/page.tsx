"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUser } from "@/components/context/UserContext";

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { setUser } = useUser(); // Accéder à la fonction pour mettre à jour le contexte

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // On envoie la requête POST à l'API backend Laravel pour l'authentification
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Si la connexion réussit, on stocke le token d'authentification
        localStorage.setItem("auth_token", data.token)
        setUser(data.user);

        // Redirection vers la page des utilisateurs (ou dashboard)
        if (data.user.role === "admin") {
          router.push("/admin")
        } else {router.push("/dashboard")}
        
      } else {
        // Si la connexion échoue, on affiche une erreur
        setError(data.message || "Une erreur s'est produite.")
      }
    } catch (err) {
      console.error(err)
      setError("Une erreur s'est produite lors de la connexion.")
    }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-background p-4">
      <h1 className="text-3xl font-bold mb-6">LOGIN</h1>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-left">Comptarial</CardTitle>
          <p className="text-muted-foreground">Bienvenue</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Mot de passe</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <div className="text-right">
                <Link href="#" className="text-sm text-primary hover:underline">
                  Mot oublié?
                </Link>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">
              Se connecter
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/inscription" className="text-sm text-primary hover:underline">
            S&apos;inscrire
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
