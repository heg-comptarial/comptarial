"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast, Toaster } from "sonner";

interface Document {
  doc_id: number;
  rubrique_id: number;
  nom: string;
  type: string;
  cheminFichier: string;
  statut: string;
  sous_rubrique: string;
  dateCreation: string;
}

interface Rubrique {
  rubrique_id: number;
  declaration_id: number;
  titre: string;
  description: string;
  documents?: Document[];
}

interface Declaration {
  declaration_id: number;
  user_id: number;
  titre: string;
  statut: string;
  annee: string;
  dateCreation: string;
  rubriques: Rubrique[];
}

interface Prive {
  prive_id: number;
  user_id: number;
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

export default function DeclarationTestPage() {
  const userId = 7; // on récupère l'id de l'utilisateur connecté
  const declarationId = 6; // on récupère l'id de la déclaration à afficher

  const [declaration, setDeclaration] = useState<Declaration | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toastShown, setToastShown] = useState<boolean>(false);

  useEffect(() => {
    fetchOrCreateRubrique();
  }, []);

  async function fetchOrCreateRubrique() {
    try {
      setLoading(true);

      // Try to fetch the declaration
      const declarationResponse = await fetch(
        `http://127.0.0.1:8000/api/users/${userId}/declarations/${declarationId}`
      );

      if (!declarationResponse.ok) {
        setError("Déclaration non trouvée");
        setLoading(false);
        return;
      }

      const declarationData = await declarationResponse.json();

      // Check if the declaration has rubriques
      if (declarationData.rubriques && declarationData.rubriques.length > 0) {
        // Declaration exists and has rubriques, use them
        setDeclaration(declarationData);
        setLoading(false);
      } else {
        // Declaration exists but has no rubriques, create them based on prive data
        const priveResponse = await fetch(`http://localhost:8000/api/prives`);
        const privesData: Prive[] = await priveResponse.json();

        // Find the prive data for the user
        const userPrive: Prive | undefined = privesData.find(
          (prive) => prive.user_id === userId
        );

        if (!userPrive) {
          setError("Données privées non trouvées pour cet utilisateur");
          setLoading(false);
          return;
        }

        // Map of fo_ fields to rubrique titles and descriptions
        const foFieldsMap = {
          fo_banques: {
            titre: "Banques",
            description: "Informations bancaires",
          },
          fo_dettes: {
            titre: "Dettes",
            description: "Informations sur les dettes",
          },
          fo_immobiliers: {
            titre: "Immobiliers",
            description: "Informations sur les biens immobiliers",
          },
          fo_salarie: {
            titre: "Salariés",
            description: "Informations sur les revenus salariés",
          },
          fo_autrePersonneCharge: {
            titre: "Autres personnes à charge",
            description: "Informations sur les autres personnes à charge",
          },
          fo_independant: {
            titre: "Indépendant",
            description: "Informations sur les revenus d'indépendant",
          },
          fo_rentier: {
            titre: "Rentier",
            description: "Informations sur les revenus de rente",
          },
          fo_autreRevenu: {
            titre: "Autres revenus",
            description: "Informations sur les autres revenus",
          },
          fo_assurance: {
            titre: "Assurances",
            description: "Informations sur les assurances",
          },
          fo_autreDeduction: {
            titre: "Autres déductions",
            description: "Informations sur les autres déductions",
          },
          fo_autreInformations: {
            titre: "Autres informations",
            description: "Autres informations importantes",
          },
        };

        // Create rubriques in the database for true fo_ fields
        const createdRubriques = [];

        for (const [field, value] of Object.entries(userPrive)) {
          if (
            field.startsWith("fo_") &&
            value === true && 
            foFieldsMap[field as keyof typeof foFieldsMap]
            ) {
            const rubriqueName = foFieldsMap[field as keyof typeof foFieldsMap].titre;
            const rubriqueDescription = foFieldsMap[field as keyof typeof foFieldsMap].description;

            try {
              // Create the rubrique via POST request to the correct endpoint
              const createResponse = await fetch(
                `http://127.0.0.1:8000/api/rubriques`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    declaration_id: declarationId,
                    titre: rubriqueName,
                    description: rubriqueDescription,
                  }),
                }
              );

              if (createResponse.ok) {
                const createdRubrique = await createResponse.json();
                createdRubriques.push(createdRubrique);
              } else {
                console.error(
                  `Failed to create rubrique for ${field}: ${await createResponse.text()}`
                );
              }
            } catch (err) {
              console.error(`Error creating rubrique for ${field}:`, err);
            }
          }
        }

        // Fetch the updated declaration with the newly created rubriques
        const updatedDeclarationResponse = await fetch(
          `http://127.0.0.1:8000/api/users/${userId}/declarations/${declarationId}`
        );
        if (updatedDeclarationResponse.ok) {
          const updatedDeclarationData =
            await updatedDeclarationResponse.json();
          setDeclaration(updatedDeclarationData);
        } else {
          // If fetching updated declaration fails, use the original with created rubriques
          setDeclaration({
            ...declarationData,
            rubriques: createdRubriques,
          });
        }

        // Show toast notifications after state updates
        setToastShown(true);
      }
    } catch (err) {
      setError("Erreur lors de la récupération ou création des données");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Show toasts after component has rendered and data is loaded
  useEffect(() => {
    if (!loading && toastShown) {
      const createdRubriques = declaration?.rubriques || [];

      if (createdRubriques.length > 0) {
        toast.success(
          `${createdRubriques.length} rubriques chargées avec succès.`,
          {
            duration: 5000,
          }
        );
      } else {
        toast.error("Aucune rubrique trouvée.", {
          duration: 5000,
        });
      }

      setToastShown(false);
    }
  }, [loading, toastShown, declaration]);

  // Group documents by sous_rubrique
  const groupDocumentsBySousRubrique = (documents: Document[]) => {
    const grouped: Record<string, Document[]> = {};

    documents?.forEach((doc) => {
      if (!grouped[doc.sous_rubrique]) {
        grouped[doc.sous_rubrique] = [];
      }
      grouped[doc.sous_rubrique].push(doc);
    });

    return grouped;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approuvé</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">En attente</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejeté</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des rubriques...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold mb-4">Erreur</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* Toast notifications for success and error messages */}
      <Toaster position="bottom-right" richColors closeButton />

      <div className="p-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{declaration?.titre}</h1>
          {declaration?.statut && getStatusBadge(declaration.statut)}
        </div>

        {declaration?.rubriques && declaration.rubriques.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {declaration.rubriques.map((rubrique) => {
              // Group documents by sous_rubrique if they exist
              const groupedDocuments = rubrique.documents
                ? groupDocumentsBySousRubrique(rubrique.documents)
                : {};

              return (
                <AccordionItem
                  key={rubrique.rubrique_id}
                  value={`rubrique-${rubrique.rubrique_id}`}
                >
                  <AccordionTrigger className="text-xl font-medium">
                    {rubrique.titre}
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {rubrique.description}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {Object.keys(groupedDocuments).length > 0 ? (
                          <div className="space-y-4">
                            {Object.entries(groupedDocuments).map(
                              ([sousRubriqueTitle, docs]) => (
                                <Card
                                  key={sousRubriqueTitle}
                                  className="border border-gray-200"
                                >
                                  <CardHeader className="py-3">
                                    <CardTitle className="text-md">
                                      {sousRubriqueTitle}
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="py-2">
                                    <div className="mt-2">
                                      <h4 className="font-medium mb-1">
                                        Documents:
                                      </h4>
                                      <ul className="list-disc pl-5">
                                        {docs.map((doc: Document) => (
                                          <li
                                            key={doc.doc_id}
                                            className="text-sm"
                                          >
                                            {doc.nom} ({doc.type}){" "}
                                            {getStatusBadge(doc.statut)}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </CardContent>
                                </Card>
                              )
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">
                            Aucun document disponible
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <p className="text-center text-gray-500 py-8">
            Aucune rubrique trouvée pour cette déclaration
          </p>
        )}
      </div>
    </>
  );
}
