"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { User, FileText, Edit, FormInput, PlusCircle, Settings } from "lucide-react";
import Link from "next/link";
import ProtectedRoutePending from "@/components/routes/ProtectedRoutePending";

interface UserDetails {
  nom: string;
  adresse: string;
  localite: string;
  codePostal: string;
  email: string;
  numeroTelephone: string;
  role: string;
  statut: string;
}

async function fetchUser(userId: string | null): Promise<UserDetails | null> {
  if (!userId) return null;

  const res = await fetch(`http://localhost:8000/api/users/${userId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) return null;

  return await res.json();
}

export default function Dashboard() {
  const [user, setUser] = useState<UserDetails | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    fetchUser(storedUserId).then(setUser);
  }, []);

  if (!user) {
    return <div className="text-center py-20">Chargement des informations utilisateur...</div>;
  }

  const { nom, adresse, localite, codePostal, role, statut } = user;

  const isPending = statut === "pending";
  const isApproved = statut === "approved";
  const isPrive = role === "prive";
  const isEntreprise = role === "entreprise";

  return (
    <ProtectedRoutePending>
      <div className="container mx-auto py-10 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Bienvenue, {nom} 👋</h1>
        <p className="text-muted-foreground mb-6">
          Adresse : {adresse}, {codePostal} {localite}
        </p>

        {isPending && (
          <div className="mb-8 rounded-xl border border-yellow-300 bg-yellow-100 text-yellow-800 p-4 text-sm shadow-sm">
            Votre demande est en cours de traitement. Vous n'avez pas encore accès à toutes les fonctionnalités du site.
            <br />
            Nous étudierons votre profil dans les plus brefs délais.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Accessible à tous : Compte */}
          <DashboardLink icon={Settings} label="Mon compte" href="/account" />

          {/* Statut approved uniquement */}
          {isApproved && (
            <>
              {/* Liens pour "prive" */}
              {isPrive && (
                <>
                  <DashboardLink icon={FileText} label="Mes déclarations" href="/declarations-client" />
                  <DashboardLink icon={FormInput} label="Modifier formulaire" href="/formulaire" />
                  <DashboardLink icon={PlusCircle} label="Nouvelle déclaration" href="/new-declaration" />
                </>
              )}

              {/* Liens pour "entreprise" */}
              {isEntreprise && (
                <>
                  <DashboardLink icon={FileText} label="Mes déclarations" href="/declarations-client" />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoutePending>
  );
}

type DashboardLinkProps = {
  icon: React.ElementType;
  label: string;
  href: string;
};

function DashboardLink({ icon: Icon, label, href }: DashboardLinkProps) {
  return (
    <Link href={href}>
      <div className="p-4 border rounded-2xl shadow hover:shadow-lg transition flex items-center space-x-4 bg-white hover:bg-muted cursor-pointer">
        <Icon className="w-6 h-6 text-primary" />
        <span className="text-base font-medium">{label}</span>
      </div>
    </Link>
  );
}
