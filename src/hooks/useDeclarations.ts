// hooks/useDeclarations.ts
import { useState, useEffect } from "react";
import { Declaration, Prive, Rubrique } from "@/types/interfaces";
import { foFields } from "@/utils/foFields";
import { toast } from "sonner";

export function useDeclarations(userId: number) {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [declaration, setDeclaration] = useState<Declaration | null>(null);
  const [userDeclarations, setUserDeclarations] = useState<Declaration[]>([]);
  const [declarationYears, setDeclarationYears] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toastShown, setToastShown] = useState<boolean>(false);
  const [uploadedRubriques, setUploadedRubriques] = useState<number[]>([]);

  useEffect(() => {
    const fetchDeclarations = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/users/${userId}`);
        const data = await res.json();
        const declarations = data.declarations || [];

        setUserDeclarations(declarations);

        const years = declarations.map((d: Declaration) => d.annee);
        setDeclarationYears(years);

        if (years.length > 0) {
          setSelectedYear([...years].sort().reverse()[0]);
        }
      } catch (err) {
        console.error(err);
        setError("Erreur de chargement des déclarations");
      } finally {
        setLoading(false);
      }
    };

    fetchDeclarations();
  }, [userId]);

  useEffect(() => {
    if (!selectedYear || userDeclarations.length === 0) return;

    const selected = userDeclarations.find((d) => d.annee === selectedYear);
    if (!selected) return;

    setDeclaration(selected);
    setUploadedRubriques(
      selected.rubriques
        ?.filter((r) => r.documents?.length)
        .map((r) => r.rubrique_id) || []
    );

    fetchOrCreateRubriques();
  }, [selectedYear, userDeclarations]);

  const fetchOrCreateRubriques = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://127.0.0.1:8000/api/users/${userId}/declarations/year/${selectedYear}`
      );

      if (!res.ok) {
        setError("Déclaration non trouvée");
        return;
      }

      const data = await res.json();

      if (data.rubriques?.length) {
        setDeclaration(data);
        setUploadedRubriques(
          data.rubriques
            .filter((r: Rubrique) => r.documents?.length)
            .map((r: Rubrique) => r.rubrique_id)
        );
      } else {
        await createRubriquesFromPrive(data);
      }

      setToastShown(true);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la récupération/creation des rubriques");
    } finally {
      setLoading(false);
    }
  };

  const createRubriquesFromPrive = async (declarationData: Declaration) => {
    const res = await fetch("http://localhost:8000/api/prives");
    const prives: Prive[] = await res.json();
    const userPrive = prives.find((p) => p.user_id === userId);
    if (!userPrive) {
      setError("Données privées introuvables");
      return;
    }

    const createdRubriques: Rubrique[] = [];

    for (const [field, value] of Object.entries(userPrive)) {
      if (
        field.startsWith("fo_") &&
        value === true &&
        foFields[field as keyof typeof foFields]
      ) {
        const { titre, description } = foFields[field as keyof typeof foFields];

        const createRes = await fetch(`http://127.0.0.1:8000/api/rubriques`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            declaration_id: declarationData.declaration_id,
            titre,
            description,
          }),
        });

        if (createRes.ok) {
          const created = await createRes.json();
          createdRubriques.push(created);
        }
      }
    }

    setDeclaration({ ...declarationData, rubriques: createdRubriques });
  };

  useEffect(() => {
    if (!loading && toastShown) {
      const count = declaration?.rubriques?.length || 0;
      if (count > 0) toast.success(`${count} rubriques chargées avec succès`);
      else toast.error("Aucune rubrique trouvée");
      setToastShown(false);
    }
  }, [loading, toastShown, declaration]);

  return {
    selectedYear,
    setSelectedYear,
    declaration,
    setDeclaration,
    declarationYears,
    uploadedRubriques,
    setUploadedRubriques,
    loading,
    error,
  };
}
