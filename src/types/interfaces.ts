export interface Document {
  doc_id: number;
  rubrique_id: number;
  nom: string;
  type:
    | "pdf"
    | "doc"
    | "xls"
    | "xlsx"
    | "ppt"
    | "jpeg"
    | "jpg"
    | "png"
    | "other";
  cheminFichier: string;
  statut: "pending" | "rejected" | "approved";
  sous_rubrique?: string | null;
  dateCreation: string;
}

export interface Rubrique {
  rubrique_id: number;
  declaration_id: number;
  titre: string;
  description: string;
  documents?: Document[];
}

export interface Declaration {
  declaration_id: number;
  user_id: number;
  titre: string;
  statut: "pending" | "rejected" | "approved";
  annee: string;
  dateCreation: string;
  rubriques: Rubrique[];
}

export interface Prive {
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
