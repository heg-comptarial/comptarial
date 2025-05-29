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
  documents?: Document[];
}

export interface Declaration {
  declaration_id: number;
  user_id: number;
  titre: string;
  impots: string;
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

 interface Enfant {
  id?: number
  prive_id?: number
  nom: string
  prenom: string
  dateNaissance: string
  adresse: string
  codePostal: string
  localite: string
  noAVS: string
  noContribuable: string
  revenuBrut: string
  fortuneNet: string
  avantAgeScolaire: boolean
  handicap: boolean
  domicileAvecParents: boolean
  parentsViventEnsemble: boolean
  gardeAlternee: boolean
  priseEnChargeFraisEgale: boolean
  revenuNetSuperieurAAutreParent: boolean
  fraisGarde: string
  primeAssuranceMaladie: string
  subsideAssuranceMaladie: string
  fraisMedicaux: string
  primeAssuranceAccident: string
  allocationsFamilialesSuisse: string
  montantInclusDansSalaireBrut: boolean
  allocationsFamilialesEtranger: string
  fo_scolaire: boolean
  fo_scolaireStope: boolean
  fo_certificatSalaire: boolean
  fo_attestationFortune: boolean
  fo_preuveVersementPensionAlim: boolean
  fo_preuveEncaissementPensionAlim: boolean
  fo_avanceScarpa: boolean
  fo_fraisGardeEffectifs: boolean
  fo_attestationAMPrimesAnnuel: boolean
  fo_attestationAMFraisMedicaux: boolean
  fo_attestationPaiementAssuranceAccident: boolean
  _hasPensionAlimentaire?: boolean
}

//  interface PensionAlimentaireData {
//   enfant_id?: number
//   statut: "verse" | "recu"
//   montantContribution: string
//   nom: string
//   prenom: string
//   noContribuable: string
//   preuveVersement: boolean
// }

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

export interface DocumentListProps {
  rubriqueId: number;
  rubriqueName: string;
  declarationStatus: string;
  documents: Document[];
  onFilesSelected: (files: File[]) => void;
  onFileRemoved: (fileId: string) => void;
  onUploadCompleted?: () => void;
}

export interface DocumentUploadProps {
  userId: number;
  year: string;
  rubriqueId: number;
  rubriqueName: string;
  hideExistingList?: boolean;
  existingDocuments?: Document[];
  onFilesSelected: (files: File[]) => void;
  onFileRemoved: (fileId: string) => void;
  onUploadCompleted?: () => void;
  hideTitle?: boolean;
}
