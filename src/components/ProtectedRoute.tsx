"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

async function fetchUserStatus(userId: string | null): Promise<string | null> {
  if (!userId) return null; // Retourne null si userId est invalide

  const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch user status");
    return null;
  }

  const data = await response.json();
  console.log("Données de l'utilisateur :", data);
  console.log("Statut de l'utilisateur :", data.statut);
  return data.statut; // Retourne le statut de l'utilisateur
}

export default function ProtectedRoutePrive({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // État pour suivre l'authentification
  const [isAccepted, setIsAccepted] = useState<boolean | null>(null); // Booléen pour vérifier si le statut est "accepted"
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      const userId = localStorage.getItem("user_id");
      const authToken = localStorage.getItem("auth_token");

      if (!authToken || !userId) {
        setIsAuthenticated(false);
        router.push("/connexion"); // Redirection si non authentifié
        return;
      }

      try {
        const status = await fetchUserStatus(userId);

        if (status === "approved") {
          setIsAuthenticated(true);
          setIsAccepted(true); // Statut accepté
        } else {
          setIsAuthenticated(false);
          setIsAccepted(false); // Statut refusé
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'utilisateur :", error);
        setIsAuthenticated(false);
        setIsAccepted(false);
      }
    };

    checkAuthentication();
  }, [router]);

  if (isAuthenticated === null || isAccepted === null) {
    // Affiche un écran de chargement pendant la vérification
    return <div>Chargement...</div>;
  }

  if (!isAuthenticated || !isAccepted) {
    // Affiche un message si l'accès est refusé
    return <div>Accès refusé. Votre compte n&apos;est pas encore accepté.</div>;
  }

  return <>{children}</>; // Rendre les enfants (la page protégée)
}
