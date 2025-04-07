"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

async function fetchUserDetails(userId: string | null): Promise<{ role: string | null; status: string | null }> {
  if (!userId) return { role: null, status: null }; // Retourne null si userId est invalide

  const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch user details");
    return { role: null, status: null };
  }

  const data = await response.json();
  console.log("Données de l'utilisateur :", data);
  return { role: data.role, status: data.statut }; // Retourne le rôle et le statut de l'utilisateur
}

export default function ProtectedRoutePrive({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // État pour suivre l'authentification
  const [isAccepted, setIsAccepted] = useState<boolean | null>(null); // Booléen pour vérifier si le statut est "approved"
  const [isPrive, setIsPrive] = useState<boolean | null>(null); // Booléen pour vérifier si le rôle est "prive"
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Message d'erreur
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      const userId = localStorage.getItem("user_id");
      const authToken = localStorage.getItem("auth_token");

      if (!authToken || !userId) {
        setIsAuthenticated(false);
        setErrorMessage("Vous n'êtes pas connecté. Veuillez vous connecter.");
        router.push("/connexion"); // Redirection si non connecté
        return;
      }

      try {
        const { role, status } = await fetchUserDetails(userId);

        if (role === "prive" && status === "approved") {
          setIsAuthenticated(true);
          setIsAccepted(true);
          setIsPrive(true);
        } else if (status !== "approved") {
          setIsAuthenticated(false);
          setIsAccepted(false);
          setIsPrive(role === "prive");
          setErrorMessage("Votre compte n'a pas encore été accepté.");
        } else if (role !== "prive") {
          setIsAuthenticated(false);
          setIsAccepted(true);
          setIsPrive(false);
          setErrorMessage("Vous n'êtes pas autorisé à accéder à cette page.");
          router.back(); // Redirection vers la page précédente
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'utilisateur :", error);
        setIsAuthenticated(false);
        setIsAccepted(false);
        setIsPrive(false);
        setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
      }
    };

    checkAuthentication();
  }, [router]);

  if (isAuthenticated === null || isAccepted === null || isPrive === null) {
    // Affiche un écran de chargement pendant la vérification
    return <div>Chargement...</div>;
  }

  if (!isAuthenticated || !isAccepted || !isPrive) {
    // Affiche un message d'erreur spécifique
    return <div>{errorMessage}</div>;
  }

  return <>{children}</>; // Rendre les enfants (la page protégée)
}
