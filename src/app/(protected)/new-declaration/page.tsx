"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import axios from "axios"
import dynamic from "next/dynamic"

// Importer dynamiquement le composant FormulaireDeclaration pour éviter les problèmes de SSR
const FormulaireDeclaration = dynamic(() => import("../formulaire/page"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  ),
})

export default function NouvelleDeclaration() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [priveId, setPriveId] = useState<number | null>(null)
  const [hasDeclaration, setHasDeclaration] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [hasChanges, setHasChanges] = useState<string | null>(null)
  const [lastDeclarationId, setLastDeclarationId] = useState<number | null>(null)

  // Récupérer l'ID de l'utilisateur et vérifier s'il a déjà fait une déclaration
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (!token) {
          router.push("/connexion")
          return
        }

        // Récupérer l'ID utilisateur depuis localStorage
        const userIdResponse = Number(localStorage.getItem("user_id"))

        if (userIdResponse) {
          setUserId(userIdResponse)

          // Récupérer les informations privées de l'utilisateur
          const priveResponse = await axios.get(`http://127.0.0.1:8000/api/prives/users/${userIdResponse}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          })

          if (priveResponse.data && priveResponse.data.prive_id) {
            setPriveId(priveResponse.data.prive_id)

            // Vérifier si l'utilisateur a déjà fait une déclaration
            try {
              const declarationsResponse = await axios.get(
                `http://127.0.0.1:8000/api/users/${userIdResponse}/declarations`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              )

              if (declarationsResponse.data && declarationsResponse.data.length > 0) {
                setHasDeclaration(true)
                // Récupérer l'ID de la dernière déclaration
                const lastDeclaration = declarationsResponse.data[declarationsResponse.data.length - 1]
                setLastDeclarationId(lastDeclaration.declaration_id)
              }
            } catch (error) {
              console.log("Pas de déclaration trouvée pour cet utilisateur")
              setHasDeclaration(false)
            }
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur:", error)
        setError("Impossible de récupérer vos informations. Veuillez vous reconnecter.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  // Gérer le choix de l'utilisateur concernant les changements
  const handleChangesChoice = (value: string) => {
    setHasChanges(value)
    setShowForm(true)
  }

  // Créer une nouvelle déclaration
  const createDeclaration = async (formData: Record<string, any>) => {
    try {
      const token = localStorage.getItem("auth_token")
      const userId = Number(localStorage.getItem("user_id"))

      if (!token || !userId) {
        throw new Error("Authentification requise")
      }

      // Créer la déclaration avec la structure correcte
      const declarationData = {
        user_id: userId,
        titre: `Déclaration ${new Date().getFullYear()}`,
        statut: "pending",
        annee: new Date().getFullYear().toString(),
        dateCreation: new Date().toISOString(),
        ...formData,
      }

      await axios.post("http://127.0.0.1:8000/api/declarations", declarationData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      // Rediriger vers le dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Erreur lors de la création de la déclaration:", error)
      setError("Une erreur est survenue lors de la création de votre déclaration.")
      return false
    }
    return true
  }

  // Afficher un écran de chargement
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Afficher un message d'erreur
  if (error) {
    return (
      <div className="container max-w-3xl py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-500">Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button className="mt-4" onClick={() => router.push("/dashboard")}>
              Retour au tableau de bord
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Si l'utilisateur n'a jamais fait de déclaration, afficher directement le formulaire
  if (!hasDeclaration && !showForm) {
    return (
      <div className="container max-w-3xl py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Nouvelle déclaration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6">
              Bienvenue ! Comme c'est votre première déclaration, nous allons vous guider à travers le processus.
            </p>
            <Button onClick={() => setShowForm(true)} className="w-full">
              Commencer ma déclaration
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Si l'utilisateur a déjà fait une déclaration et n'a pas encore choisi s'il y a des changements
  if (hasDeclaration && hasChanges === null && !showForm) {
    return (
      <div className="container max-w-3xl py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Nouvelle déclaration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6">Avez-vous eu des changements dans votre situation par rapport à l'année précédente ?</p>
            <RadioGroup className="space-y-4 mb-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="oui" id="oui" onClick={() => handleChangesChoice("oui")} />
                <Label htmlFor="oui">Oui, ma situation a changé</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="non" id="non" onClick={() => handleChangesChoice("non")} />
                <Label htmlFor="non">Non, ma situation est identique</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Si l'utilisateur a choisi "Non" (pas de changements), créer directement une nouvelle déclaration
  if (hasChanges === "non" && priveId) {
    // Récupérer les données du privé et les utiliser pour créer une nouvelle déclaration
    const createNewDeclarationFromPrive = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (!token) {
          router.push("/connexion")
          return
        }

        // Récupérer les détails du privé
        const response = await axios.get(`http://127.0.0.1:8000/api/prives/${priveId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data) {
          // Créer une nouvelle déclaration avec les données du privé
          await createDeclaration(response.data)
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données du privé:", error)
        setError("Une erreur est survenue. Veuillez réessayer.")
      }
    }

    // Appeler la fonction immédiatement
    createNewDeclarationFromPrive()

    // Afficher un écran de chargement pendant la création
    return (
      <div className="container max-w-3xl py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Création de votre déclaration</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Création de votre nouvelle déclaration en cours...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Si l'utilisateur a choisi "Oui" (il y a des changements) ou s'il s'agit de sa première déclaration
  if (showForm) {
    return (
      <>
        {hasDeclaration && (
          <div className="container max-w-3xl mb-4">
            <Card className="bg-blue-50">
              <CardContent className="pt-4">
                <p className="text-blue-700">
                  <strong>Note:</strong> Le formulaire sera pré-rempli avec vos informations existantes. Vous pourrez
                  modifier les champs nécessaires.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
        <FormulaireDeclaration onSubmitSuccess={createDeclaration} priveId={priveId} />
      </>
    )
  }

  // Fallback
  return (
    <div className="container max-w-3xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Erreur inattendue</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Une erreur inattendue s'est produite. Veuillez réessayer.</p>
          <Button className="mt-4" onClick={() => router.push("/dashboard")}>
            Retour au tableau de bord
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

