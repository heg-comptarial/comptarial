import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const isAuthenticated = typeof window !== "undefined" && localStorage.getItem("auth_token");  // Vérification de l'authentification

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/connexion");  // Redirection si non authentifié
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;  // Retourner rien ou afficher un écran de chargement si nécessaire
  }

  return <>{children}</>;  // Rendre les enfants (la page protégée)
}
