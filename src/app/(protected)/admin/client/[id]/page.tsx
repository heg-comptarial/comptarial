"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface UserDetails {
  user_id: number;
  nom: string;
  email: string;
  numeroTelephone: string;
  localite: string;
  adresse: string;
  codePostal: string;
  role: string;
  statut: string;
  dateCreation: string;
  entreprises?: any[];
  prives?: any;
  declarations?: any[];
}

export default function ClientDetail() {
  const params = useParams();
  const userId = params?.id; // Récupère l'ID depuis l'URL
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/users/${userId}/details`
        );
        if (!response.ok) {
          throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
        }
        const data = await response.json();
        setUserDetails(data.data); // Stocke les détails de l'utilisateur
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des détails de l'utilisateur :",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  if (loading) {
    return <div>Chargement des détails...</div>;
  }

  if (!userDetails) {
    return <div>Aucun détail trouvé pour cet utilisateur.</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-4">
        Détails de l'utilisateur : {userDetails.nom}
      </h1>
      <div className="space-y-4">
        <p>
          <strong>Email :</strong> {userDetails.email}
        </p>
        <p>
          <strong>Téléphone :</strong> {userDetails.numeroTelephone}
        </p>
        <p>
          <strong>Localité :</strong> {userDetails.localite}
        </p>
        <p>
          <strong>Adresse :</strong> {userDetails.adresse}
        </p>
        <p>
          <strong>Code Postal :</strong> {userDetails.codePostal}
        </p>
        <p>
          <strong>Rôle :</strong> {userDetails.role}
        </p>
        <p>
          <strong>Statut :</strong> {userDetails.statut}
        </p>
        <p>
          <strong>Date de création :</strong>{" "}
          {new Date(userDetails.dateCreation).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}