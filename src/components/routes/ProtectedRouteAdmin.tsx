"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";

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

export default function ProtectedRouteAdmin({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // État pour suivre l'authentification
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // État pour vérifier si l'utilisateur est "admin"
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Message d'erreur
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      const userId = localStorage.getItem("user_id");
      const authToken = localStorage.getItem("auth_token");

      if (!userId || !authToken) {
        setIsAuthenticated(false);
        setErrorMessage("Vous n'êtes pas connecté. Veuillez vous connecter.");
        router.push("/connexion"); // Redirection si non connecté
        return;
      }

      try {
        const userRole = await fetchUserRole(userId);
        if (userRole === "admin") {
          setIsAuthenticated(true);
          setIsAdmin(true);
        } else {
          setIsAuthenticated(false);
          setIsAdmin(false);
          setErrorMessage("Vous n'êtes pas autorisé à accéder à cette page.");
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'utilisateur :", error);
        setIsAuthenticated(false);
        setIsAdmin(false);
        setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
      }
    };

    checkAuthentication();
  }, [router]);

  if (isAuthenticated === null || isAdmin === null) {
    // Affiche un message d'erreur spécifique
    return; // Affiche un message de chargement
  }

  if (!isAuthenticated || !isAdmin) {
    // Affiche un message d'erreur spécifique
    return notFound();
  }

  return <>{children}</>; // Rendre les enfants (la page protégée)
}
