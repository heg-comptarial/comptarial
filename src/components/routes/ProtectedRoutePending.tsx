"use client";

import { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
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

  if (!response.ok) {
    console.error("Failed to fetch user details");
    return { role: null, status: null };
  }

  const data = await response.json();
  return { role: data.role, status: data.statut };
}

export default function ProtectedRoutePending({ children }: ProtectedRouteProps) {
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
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

        // Vérification du rôle et du statut
        if (role === "prive" || role == "entreprise" && (status === "pending" || status === "approved")) {
          setIsAllowed(true);
        } else {
          setIsAllowed(false);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification :", error);
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

  if (!isAllowed) {
    return notFound(); // 404 si l'utilisateur n'est pas autorisé
  }

  return <>{children}</>;
}
