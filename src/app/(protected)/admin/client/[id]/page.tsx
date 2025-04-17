"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProtectedRouteAdmin from "@/components/ProtectedRouteAdmin";

// Définition des types pour les modèles
interface Entreprise {
  id: number;
  nom: string;
  adresse: string;
  codePostal: string;
  localite: string;
}

interface Prive {
  id: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
}

interface Declaration {
  id: number;
  titre: string;
  dateSoumission: string;
  statut: string;
}

// Interface principale pour les détails utilisateur
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
  entreprises?: Entreprise; // Relation hasOne
  prives?: Prive; // Relation hasOne
  declarations?: Declaration[]; // Relation hasMany
}

export default function ClientDetail() {
  const params = useParams();
  const userId = params?.id; // Récupère l'ID depuis l'URL
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Vérifiez si l'ID utilisateur est déjà dans sessionStorage
        const cachedUserId = sessionStorage.getItem("user_id");
        if (cachedUserId && parseInt(cachedUserId) === parseInt(userId)) {
          // Si l'ID est déjà stocké, récupérez les détails depuis l'API
          const response = await fetch(
            `http://localhost:8000/api/users/${cachedUserId}/details`
          );
          if (!response.ok) {
            throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
          }
          const data = await response.json();
          setUserDetails(data.data); // Stockez les détails dans l'état local
          setLoading(false);
          return;
        }

        // Si l'ID n'est pas dans sessionStorage, faites une requête API
        const response = await fetch(
          `http://localhost:8000/api/users/${userId}/details`
        );
        if (!response.ok) {
          throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
        }
        const data = await response.json();

        // Stockez uniquement l'ID dans sessionStorage
        sessionStorage.setItem("user_id", userId);

        // Mettez à jour l'état local avec les détails utilisateur
        setUserDetails(data.data);
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
    <ProtectedRouteAdmin>
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
          {userDetails.entreprises && (
            <div>
              <h2 className="text-xl font-semibold mt-4">Entreprise</h2>
              <p>
                <strong>Nom :</strong> {userDetails.entreprises.nom}
              </p>
              <p>
                <strong>Adresse :</strong> {userDetails.entreprises.adresse}
              </p>
              <p>
                <strong>Localité :</strong> {userDetails.entreprises.localite}
              </p>
            </div>
          )}
          {userDetails.prives && (
            <div>
              <h2 className="text-xl font-semibold mt-4">Informations privées</h2>
              <p>
                <strong>Nom :</strong> {userDetails.prives.nom}
              </p>
              <p>
                <strong>Prénom :</strong> {userDetails.prives.prenom}
              </p>
              <p>
                <strong>Date de naissance :</strong>{" "}
                {new Date(userDetails.prives.dateNaissance).toLocaleDateString()}
              </p>
            </div>
          )}
          {userDetails.declarations && userDetails.declarations.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mt-4">Déclarations</h2>
              <ul>
                {userDetails.declarations.map((declaration) => (
                  <li key={declaration.id}>
                    <strong>{declaration.titre}</strong> -{" "}
                    {new Date(declaration.dateSoumission).toLocaleDateString()} (
                    {declaration.statut})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </ProtectedRouteAdmin>
  );
}