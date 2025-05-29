/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { FileText, FormInput, PlusCircle, Settings } from "lucide-react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";

interface EntrepriseDetails {
  entreprise_id: number;
  user_id: number;
}

interface UserDetails {
  user_id: number;
  nom: string;
  adresse: string;
  localite: string;
  codePostal: string;
  email: string;
  numeroTelephone: string;
  role: string;
  statut: string;
  dateCreation: string;
  administrateurs: any | null;
  declarations: any[];
  entreprises?: EntrepriseDetails | null;
  notifications: any[];
  prives: any | null;
}

async function fetchUser(userId: number): Promise<UserDetails | null> {
  if (!userId) return null;

  const token = localStorage.getItem("auth_token");
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/users/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchDeclarationTitles(userId: number): Promise<string[]> {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/users/${userId}/titres-declarations`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!res.ok) return [];
    const data: { success: boolean; titles: string[] } = await res.json();
    return data.success ? Array.from(new Set(data.titles)) : [];
  } catch {
    return [];
  }
}

export default function Dashboard() {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [declarationTitles, setDeclarationTitles] = useState<string[]>([]);
  const [authentifie, setAuthentifie] = useState<boolean | null>(null);
  const params = useParams();
  const userId = Number(params?.userId);

  useEffect(() => {
    setAuthentifie(null); // reset loading state
    fetchUser(userId).then((userData) => {
      if (!userData) {
        setAuthentifie(false);
        return;
      }
      setUser(userData);
      setAuthentifie(true);
    });
    fetchDeclarationTitles(userId).then((titles) => {
      const orderedTitles = [
        "Comptabilité",
        "TVA",
        "Salaires",
        "Administration",
        "Fiscalité",
        "Divers",
      ].filter((title) => titles.includes(title));
      setDeclarationTitles(orderedTitles);
    });
  }, [userId]);

  if (authentifie === null) {
    // Affiche un loader ou rien du tout pendant le chargement
    return null;
  }

  if (!authentifie) {
    notFound();
  }

  if (!user) {
    return <div className="text-center py-20">Chargement des informations utilisateur...</div>;
  }

  const { nom, adresse, localite, codePostal, role, statut } = user;

  const isPending = statut === "pending";
  const isApproved = statut === "approved";
  const isEntreprise = role === "entreprise";

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-4">Bienvenue, {nom} 👋</h1>
      <p className="text-muted-foreground mb-6">
        Adresse : {adresse}, {codePostal} {localite}
      </p>

      {isPending && (
        <div className="mb-8 rounded-xl border border-yellow-300 bg-yellow-100 text-yellow-800 p-4 text-sm shadow-sm">
          Votre demande est en cours de traitement. Vous n&apos;avez pas encore accès à toutes les fonctionnalités du site.
          <br />
          Nous étudierons votre profil dans les plus brefs délais.
        </div>
      )}

      {isEntreprise && isApproved && declarationTitles.length === 0 && (
        <div className="mb-8 rounded-xl border border-blue-300 bg-blue-100 text-blue-800 p-4 text-sm shadow-sm">
          Vous n&apos;avez pas encore de déclarations. Les espaces de dépôt de documents seront créés sous peu.
          <br />
          Merci de votre patience.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Accessible à tous : Compte */}
        <DashboardLink icon={Settings} label="Mon compte" href={`/account/${userId}`} />

        {/* Statut approved uniquement */}
        {isApproved && (
          <>
            {/* Liens pour "prive" */}
            {role === "prive" && (
              <>
                <DashboardLink icon={FileText} label="Mes déclarations" href={`/declarations-client/${userId}`} />
                <DashboardLink icon={FormInput} label="Modifier formulaire" href={`/formulaire/${userId}`} />
                <DashboardLink icon={PlusCircle} label="Nouvelle déclaration" href={`/new-declaration/${userId}`} />
              </>
            )}

            {/* Liens pour "entreprise" */}
            {isEntreprise &&
              declarationTitles.map((titre) => (
                <DashboardLink
                  key={titre}
                  icon={FileText}
                  label={titre}
                  href={`/declarations-client/${userId}?type=${encodeURIComponent(titre)}`}
                />
              ))}
          </>
        )}
      </div>
    </div>
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
