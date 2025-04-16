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
  commentaires?: Commentaire[];
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

export interface Utilisateur {
  user_id: number;
  nom: string;
  email: string;
  localite: string;
  adresse: string;
  codePostal: string;
  numeroTelephone: string;
  role: string;
  statut: string;
  dateCreation: string;
}

export interface Administrateur {
  admin_id: number;
  user_id: number;
  niveauAcces: string;
  user?: Utilisateur;
}

export interface Commentaire {
  commentaire_id: number;
  document_id: number;
  admin_id: number;
  contenu: string;
  dateCreation: string;
  administrateur?: Administrateur;
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

export interface Enfant {
  nom: string;
  prenom: string;
  dateNaissance: string;
  adresse: string;
  codePostal: string;
  localite: string;
  noAVS: string;
  noContribuable: string;
  revenuBrut: string;
  fortuneNet: string;
}

interface PriveData {
  dateNaissance: string;
  nationalite: string;
  etatCivil: string;
  genre: string;
  [key: string]: boolean | string; // pour les rubriques dynamiques comme `fo_salarie`
}

interface Conjoint {
  id?: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  nationalite: string;
  adresse: string;
  localite: string;
  codePostal: string;
  situationProfessionnelle: string;
}

export interface FormDataType {
  user_id: number;
  titre: string;
  statut: string;
  annee: string;
  dateCreation: string;
  priveData: PriveData;
  conjoint: Conjoint | null;
  enfants: Enfant[];
}
