"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoutePrive({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // État pour suivre l'authentification
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Message d'erreur
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      const authToken = localStorage.getItem("auth_token");

      if (!authToken) {
        setIsAuthenticated(false);
        setErrorMessage("Vous n'êtes pas connecté. Veuillez vous connecter.");
        router.push("/connexion"); // Redirection si non connecté
        return;
      }

      setIsAuthenticated(true); // L'utilisateur est authentifié
    };

    checkAuthentication();
  }, [router]);

  if (isAuthenticated === null) {
    // Affiche un écran de chargement pendant la vérification
    return <div>Chargement...</div>;
  }

  if (!isAuthenticated) {
    // Affiche un message d'erreur spécifique
    return <div>{errorMessage}</div>;
  }

  return <>{children}</>; // Rendre les enfants (la page protégée)
}
