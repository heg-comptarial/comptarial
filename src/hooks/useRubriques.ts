import { useEffect, useRef, useState } from "react";
import { Declaration, Prive, Rubrique } from "@/types/interfaces";
import { toast } from "sonner";
import { foFields } from "@/utils/foFields";

export function useRubriques(
  userId: number,
  selectedYear: string | null,
  setDeclaration: (d: Declaration) => void,
  setUploadedRubriques: (ids: number[]) => void,
  setToastShown: (shown: boolean) => void
) {
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchRubriques = async () => {
      if (!selectedYear || !userId || hasFetched.current) return;
      hasFetched.current = true;
      setLoading(true);

      try {
        const res = await fetch(
          `http://localhost:8000/api/users/${userId}/declarations/year/${selectedYear}`
        );
        if (!res.ok) throw new Error("Déclaration non trouvée");
        const data = await res.json();

        const existingTitles = new Set(
          (data.rubriques || []).map((r: Rubrique) =>
            r.titre.trim().toLowerCase()
          )
        );

        const createdRubriques = [];
        const priveRes = await fetch("http://localhost:8000/api/prives");
        const prives: Prive[] = await priveRes.json();
        const userPrive = prives.find((p) => p.user_id === userId);

        for (const [field, value] of Object.entries(userPrive || {})) {
          if (
            field.startsWith("fo_") &&
            value === true &&
            foFields[field as keyof typeof foFields]
          ) {
            const rubriqueInfo = foFields[field as keyof typeof foFields];
            const titre = rubriqueInfo.titre.trim().toLowerCase();
            if (existingTitles.has(titre)) continue;

            const createRes = await fetch(
              "http://localhost:8000/api/rubriques",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  declaration_id: data.declaration_id,
                  titre: rubriqueInfo.titre,
                  description: rubriqueInfo.description,
                }),
              }
            );

            if (createRes.ok) createdRubriques.push(await createRes.json());
          }
        }

        const finalRes = await fetch(
          `http://localhost:8000/api/users/${userId}/declarations/${data.declaration_id}`
        );
        const finalData = await finalRes.json();
        setDeclaration(finalData);
        setUploadedRubriques(
          finalData.rubriques
            .filter((r: Rubrique) => r.documents && r.documents.length > 0)
            .map((r: Rubrique) => r.rubrique_id)
        );
        setToastShown(true);
      } catch (err) {
        toast.error("Erreur lors du chargement des rubriques");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRubriques();
  }, [selectedYear, userId, setDeclaration, setUploadedRubriques, setToastShown]);

  return { loading };
}
