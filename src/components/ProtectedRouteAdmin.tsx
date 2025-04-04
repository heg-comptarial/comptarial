"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

async function fetchUserRole(userId: string | null): Promise<string | null> {
  if (!userId) return null; // Retourne null si userId est invalide

  const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch user role");
    return null;
  }

  const data = await response.json();
  return data.role; // Retourne le rôle de l'utilisateur
}

export default function ProtectedRoutePrive({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // État pour suivre l'authentification
  const [isPrive, setIsPrive] = useState<boolean | null>(null); // État pour vérifier si l'utilisateur est "prive"
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      const userId = localStorage.getItem("user_id");
      const authToken = localStorage.getItem("auth_token");

      if (!userId || !authToken) {
        setIsAuthenticated(false);
        router.push("/connexion"); // Redirection si non authentifié
        return;
      }

      try {
        const userRole = await fetchUserRole(userId);
        if (userRole === "admin") {
          setIsAuthenticated(true);
          setIsPrive(true);
        } else {
          setIsAuthenticated(false);
          setIsPrive(false);
          router.back(); // Redirection vers la page précédente
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'utilisateur :", error);
        setIsAuthenticated(false);
        router.back(); // Redirection vers la page précédente
      }
    };

    checkAuthentication();
  }, [router]);

  if (isAuthenticated === null || isPrive === null) {
    // Affiche un écran de chargement pendant la vérification
    return <div>Chargement...</div>;
  }

  if (!isAuthenticated || !isPrive) {
    return null; // Retourne rien si non authentifié (redirection déjà effectuée)
  }

  return <>{children}</>; // Rendre les enfants (la page protégée)
}
