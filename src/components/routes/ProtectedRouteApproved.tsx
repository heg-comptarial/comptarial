"use client";

import { useEffect, useState } from "react";
import { useRouter, notFound } from "next/navigation";
import { useParams } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

async function fetchUserDetails(userId: number): Promise<{ role: string | null; status: string | null }> {
  if (!userId) return { role: null, status: null };

  const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) return { role: null, status: null };

  const data = await response.json();
  return { role: data.role, status: data.statut };
}

export default function ProtectedRoutePrive({ children }: ProtectedRouteProps) {
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams()
  const userId = Number(params?.userId)

  useEffect(() => {
    const checkAccess = async () => {
      const authToken = localStorage.getItem("auth_token");

      if (!authToken || !userId) {
        router.push("/login");
        return;
      }

      try {
        const { role, status } = await fetchUserDetails(userId);
        setStatus(status);
        setIsAllowed(
          (role === "prive" || role === "entreprise") && status === "approved"
        );
      } catch (error) {
        console.error("Erreur lors de la vérification de l'utilisateur :", error);
        setIsAllowed(false);
      }
    };

    checkAccess();
  }, [router]);

  if (isAllowed === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Votre compte est en attente d&apos;approbation. Veuillez réessayer plus tard.</p>
      </div>
    );
  }

  if (!isAllowed) {
    return notFound();
  }

  return <>{children}</>;
}
