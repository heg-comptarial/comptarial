"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Interfaces pour chaque relation
interface Administrateur {
  admin_id: number;
  user_id: number;
  niveauAcces: "admin" | "super_admin";
}

interface Declaration {
  declaration_id: number;
  user_id: number;
  titre: string;
  statut: "pending" | "rejected" | "approved";
  annee: string;
  dateCreation: string;
}

interface Entreprise {
  entreprise_id: number;
  user_id: number;
  raisonSociale: string;
  prestations: string;
  grandLivre: string;
  numeroFiscal: string;
  nouvelleEntreprise: boolean;
}

interface Notification {
  notification_id: number;
  user_id: number;
  contenu: string;
  dateCreation: string;
}

interface Prive {
  prive_id: number;
  dateNaissance: string | null;
  nationalite: string | null;
  etatCivil: string | null;
  fo_banques: boolean;
  fo_dettes: boolean;
  fo_immobiliers: boolean;
  fo_salarie: boolean;
  fo_autrePersonneCharge: boolean;
  fo_independant: boolean;
  fo_rentier: boolean;
  fo_autreRevenu: boolean;
  fo_assurance: boolean;
  fo_autreDeduction: boolean;
  fo_autreInformations: boolean;
}

// Interface principale de l'utilisateur
interface User {
  user_id: number;
  nom: string;
  email: string;
  localite: string;
  adresse: string;
  codePostal: string;
  numeroTelephone: string;
  role: "admin" | "prive" | "entreprise";
  statut: "pending" | "rejected" | "approved";
  dateCreation: string;
  administrateurs: Administrateur[];
  declarations: Declaration[];
  entreprises: Entreprise[];
  notifications: Notification[];
  prives: Prive[];
}

// Interface du contexte
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  fetchUserData: (userId: number) => Promise<void>;
}

// Création du contexte
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider du contexte
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Fonction pour récupérer les données complètes d'un utilisateur
  const fetchUserData = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${userId}`);
      console.log("Response:", response);
      if (!response.ok) {
        console.log(response.body)
        throw new Error("Erreur lors de la récupération des données utilisateur");
      }
      const userData: User = await response.json();
      console.log("Données utilisateur récupérées:", userData);
      setUser(userData);
    } catch (error) {
      console.error("Erreur UserContext:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
