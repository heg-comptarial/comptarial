CREATE TABLE `User`(
    `user_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `nom` VARCHAR(255) NOT NULL,
    `email` VARCHAR(254) NOT NULL UNIQUE COMMENT 'The email address of the user, used for login and communication.',
    `motDePasse` VARCHAR(255) NOT NULL COMMENT 'Stores hashed password',
    `localite` VARCHAR(255) NOT NULL,
    `adresse` VARCHAR(255) NOT NULL,
    `codePostal` VARCHAR(10) NOT NULL,
    `numeroTelephone` VARCHAR(25) NOT NULL,
    `role` ENUM('admin', 'prive', 'entreprise') NOT NULL,
    `statut` ENUM('approved', 'rejected', 'pending') NOT NULL,
    `dateCreation` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
 
CREATE TABLE `Administrateur`(
    `admin_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE
);
 
CREATE TABLE `Declaration`(
    `declaration_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `titre` ENUM('Declaration', 'Comptabilité', 'TVA', 'Salaires', 'Administration', 'Fiscalité', 'Divers') NOT NULL,
    `statut` ENUM('pending', 'approved', 'rejected') NOT NULL,
    `annee` YEAR NOT NULL,
    `dateCreation` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE
);
 
CREATE TABLE `Rubrique`(
    `rubrique_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `declaration_id` BIGINT UNSIGNED NOT NULL,
    `titre` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    FOREIGN KEY (`declaration_id`) REFERENCES `Declaration`(`declaration_id`) ON DELETE CASCADE
);

CREATE TABLE `Document`(
    `doc_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `rubrique_id` BIGINT UNSIGNED NOT NULL,
    `nom` VARCHAR(255) NOT NULL,
    `type` ENUM('pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'jpeg', 'jpg', 'png', 'other') NOT NULL,
    `cheminFichier` VARCHAR(255) NOT NULL,
    `statut` ENUM('pending', 'approved', 'rejected') NOT NULL,
    `sous_rubrique` VARCHAR(255) NOT NULL DEFAULT '',
    `dateCreation` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`rubrique_id`) REFERENCES `Rubrique`(`rubrique_id`) ON DELETE CASCADE
);

CREATE TABLE `Commentaire`(
    `commentaire_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `document_id` BIGINT UNSIGNED NOT NULL,
    `admin_id` BIGINT UNSIGNED NOT NULL,
    `contenu` VARCHAR(255) NOT NULL,
    `dateCreation` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`document_id`) REFERENCES `Document`(`doc_id`) ON DELETE CASCADE,
    FOREIGN KEY (`admin_id`) REFERENCES `Administrateur`(`admin_id`) ON DELETE CASCADE
);
 
CREATE TABLE `Prive`(
    `prive_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `dateNaissance` DATE NOT NULL,
    `nationalite` VARCHAR(255) NOT NULL,
    `etatCivil` VARCHAR(255) NOT NULL,
    `fo_enfants` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_autrePersonneCharge` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_revenu` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_independant` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_indemnitesAssurance` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_rentier` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_autresRevenus` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_banques` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_titres` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_immobiliers` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_dettes` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_assurances` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_autresDeductions` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_autresInformations` BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE
);
 
CREATE TABLE `Entreprise`(
    `entreprise_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE
);
 
CREATE TABLE `Conjoint`(
    `conjoint_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `prive_id` BIGINT UNSIGNED NOT NULL,
    `nom` VARCHAR(255) NOT NULL,
    `prenom` VARCHAR(255) NOT NULL,
    `email` VARCHAR(254) NOT NULL UNIQUE,
    `localite` VARCHAR(255) NOT NULL,
    `adresse` VARCHAR(255) NOT NULL,
    `codePostal` VARCHAR(10) NOT NULL,
    `numeroTelephone` VARCHAR(25) NOT NULL,
    `etatCivil` ENUM(
        'Célibataire',
        'Marié-e',
        'Séparé-e',
        'Divorcé-e',
        'Veuf-Veuve',
        'Partenariat',
        'Partenariat séparé',
        'Partenariat dissous',
        'Partenariat veuf'
    ) NOT NULL,
    `dateNaissance` DATE NOT NULL,
    `nationalite` VARCHAR(255) NOT NULL,
    `professionExercee` VARCHAR(255) NOT NULL,
    `contributionReligieuse` ENUM(
        'Église Catholique Chrétienne',
        'Église Catholique Romaine',
        'Église Protestante',
        'Aucune organisation religieuse'
    ) NOT NULL,
    FOREIGN KEY (`prive_id`) REFERENCES `Prive`(`prive_id`) ON DELETE CASCADE
);
 
CREATE TABLE `Enfants`(
    `enfant_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `prive_id` BIGINT UNSIGNED NOT NULL,
    `nom` VARCHAR(255) NOT NULL,
    `prenom` VARCHAR(255) NOT NULL,
    `dateNaissance` DATE NOT NULL,
    `adresse` VARCHAR(255) NOT NULL,
    `codePostal` VARCHAR(10) NOT NULL,
    `localite` VARCHAR(255) NOT NULL,
    `noAVS` VARCHAR(255) NOT NULL,
    `noContribuable` VARCHAR(255) NOT NULL,
    `revenuBrut` DECIMAL(10, 2) NOT NULL,
    `fortuneNet` DECIMAL(10, 2) NOT NULL,
    `avantAgeScolaire` BOOLEAN NOT NULL DEFAULT FALSE,
    `handicap` BOOLEAN NOT NULL DEFAULT FALSE,
    `domicileAvecParents` BOOLEAN NOT NULL DEFAULT FALSE,
    `parentsViventEnsemble` BOOLEAN NOT NULL DEFAULT FALSE,
    `gardeAlternee` BOOLEAN NOT NULL DEFAULT FALSE,
    `priseEnChargeFraisEgale` BOOLEAN NOT NULL DEFAULT FALSE,
    `revenuNetSuperieurAAutreParent` BOOLEAN NOT NULL DEFAULT FALSE,
    `fraisGarde`DECIMAL(10, 2) DEFAULT NULL,
    `primeAssuranceMaladie` DECIMAL(10, 2) NOT NULL,
    `subsideAssuranceMaladie` DECIMAL(10, 2) DEFAULT NULL,
    `fraisMedicaux` DECIMAL(10, 2) DEFAULT NULL,
    `primeAssuranceAccident` DECIMAL(10, 2) DEFAULT NULL,
    `allocationsFamilialesSuisse` DECIMAL(10, 2) DEFAULT NULL,
    `montantInclusDansSalaireBrut` BOOLEAN NOT NULL DEFAULT FALSE,
    `allocationsFamilialesEtranger` DECIMAL(10, 2) DEFAULT NULL,
    `fo_scolaire` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_scolaireStope` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_certificatSalaire` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_attestationFortune` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_preuveVersementPensionAlim` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_preuveEncaissementPensionAlim` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_avanceScarpa` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_fraisGardeEffectifs` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_attestationAMPrimesAnnuel` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_attestationAMFraisMedicaux` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_attestationPaiementAssuranceAccident` BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (`prive_id`) REFERENCES `Prive`(`prive_id`) ON DELETE CASCADE
);
 
CREATE TABLE `PensionAlimentaire`(
    `pension_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `enfant_id` BIGINT UNSIGNED NOT NULL,
    `statut` ENUM('verse', 'recu') NOT NULL,
    `montantContribution` DECIMAL(10, 2) NOT NULL,
    `nom` VARCHAR(255) NOT NULL,
    `prenom` VARCHAR(255) NOT NULL,
    `noContribuable` VARCHAR(255) NOT NULL,
    FOREIGN KEY (`enfant_id`) REFERENCES `Enfants`(`enfant_id`) ON DELETE CASCADE
);
 
CREATE TABLE `Notification`(
    `notification_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `contenu` VARCHAR(255) NOT NULL,
    `dateCreation` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE
);
 
CREATE TABLE `AutrePersonneACharge` (
    `autre_personne_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `prive_id` BIGINT UNSIGNED NOT NULL,
    `nom` VARCHAR(255) NOT NULL,
    `prenom` VARCHAR(255) NOT NULL,
    `dateNaissance` DATE NOT NULL,
    `degreParente` ENUM('parents', 'enfant', 'grands-parents', 'frere-soeur', 'oncle-tante', 'neuveu-niece', 'autre') NOT NULL,
    `nbPersonneParticipation` INT NOT NULL COMMENT 'Nombre de personnes participant à entretenir la personne à charge',
    `vieAvecPersonneCharge` BOOLEAN NOT NULL DEFAULT FALSE,
    `revenusBrutPersonneACharge` DECIMAL(10, 2) NOT NULL,
    `fortuneNetPersonneACharge` DECIMAL(10, 2) NOT NULL,
    `montantVerseAPersonneACharge` DECIMAL(10, 2) NOT NULL,
    `fo_preuveVersementEffectue` BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (`prive_id`) REFERENCES `Prive`(`prive_id`) ON DELETE CASCADE
);
 
CREATE TABLE `Revenu` (
    `revenu_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `prive_id` BIGINT UNSIGNED NOT NULL,
    `indemnites` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Indemnités de chômage, maladie, accident, maternité',
    `interruptionsTravailNonPayees` BOOLEAN NOT NULL DEFAULT FALSE,
    `interuptionsTravailNonPayeesDebut` DATE DEFAULT NULL,
    `interuptionsTravailNonPayeesFin` DATE DEFAULT NULL,
    `activiteIndependante` BOOLEAN NOT NULL DEFAULT FALSE,
    `prestationsSociales` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'AVS/AI, LPP, Assurance militaire, Etrangères, Autres',
    `subsidesAssuranceMaladie`BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_certificatSalaire` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_renteViagere` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Autres revenus',
    `fo_allocationLogement` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Autres revenus',
    `fo_preuveEncaissementSousLoc` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Autres revenus',
    `fo_gainsAccessoires` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Autres revenus' COMMENT '2300 CHF non soumis à AVS',
    `fo_attestationAutresRevenus` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Autres revenus',
    `fo_etatFinancier` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Indépendant',
    FOREIGN KEY (`prive_id`) REFERENCES `Prive`(`prive_id`) ON DELETE CASCADE
);
 
CREATE TABLE `IndemniteAssurance` (
    `indemnite_assurance_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `prive_id` BIGINT UNSIGNED NOT NULL,
    `fo_chomage` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_maladie` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_accident` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_materniteMilitairePC` BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (`prive_id`) REFERENCES `Prive`(`prive_id`) ON DELETE CASCADE
);
 
CREATE TABLE `Rentier` (
    `rentier_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `prive_id` BIGINT UNSIGNED NOT NULL,
    `fo_attestationRenteAVSAI` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_attestationRentePrevoyance` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_autresRentes` BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (`prive_id`) REFERENCES `Prive`(`prive_id`) ON DELETE CASCADE
);
 
CREATE TABLE `Banque` (
    `banque_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `prive_id` BIGINT UNSIGNED NOT NULL,
    `fo_attestationFinAnnee` BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (`prive_id`) REFERENCES `Prive`(`prive_id`) ON DELETE CASCADE
);
 
CREATE TABLE `Titre`(
    `titre_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `prive_id` BIGINT UNSIGNED NOT NULL,
    `compteBancairePostale` BOOLEAN NOT NULL DEFAULT FALSE,
    `actionOuPartSociale` BOOLEAN NOT NULL DEFAULT FALSE,
    `autreElementFortune` BOOLEAN NOT NULL DEFAULT FALSE,
    `aucunElementFortune` BOOLEAN NOT NULL DEFAULT FALSE,
    `objetsValeur` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Monnaies en espèces; métaux précieux; or, bijoux, argenterie de + de 2000CHF; collections artistiques; véhicules',
    `fo_gainJeux` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_releveFiscal` BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (`prive_id`) REFERENCES `Prive`(`prive_id`) ON DELETE CASCADE
);
 
CREATE TABLE `Immobilier` (
    `immobilier_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `prive_id` BIGINT UNSIGNED NOT NULL,
    `statut` ENUM('occupe', 'loue', 'commercial-industriel', 'ppe', 'hlm'),
    `canton` VARCHAR(255) NOT NULL,
    `commune` VARCHAR(255) NOT NULL,
    `pays` VARCHAR(255) NOT NULL,
    `noParcelleGeneve` VARCHAR(255) NOT NULL,
    `adresseComplete` VARCHAR(255) NOT NULL,
    `anneeConstruction` VARCHAR(255) NOT NULL,
    `occupeDesLe` DATE DEFAULT NULL,
    `dateAchat` DATE NOT NULL,
    `pourcentageProprietaire` DECIMAL(10, 2) NOT NULL COMMENT 'A quel pourcentage êtes vous propriétaire de ce bien',
    `autreProprietaire` VARCHAR(255) NOT NULL COMMENT 'Nom de autre propriétaire',
    `prixAchat` DECIMAL(10, 2) NOT NULL,
    `valeurLocativeBrut` DECIMAL(10, 2) DEFAULT NULL,
    `loyersEncaisses` DECIMAL(10, 2) DEFAULT NULL,
    `fraisEntretienDeductibles` DECIMAL(10, 2) NOT NULL,
    `fo_bienImmobilier` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_attestationValeurLocative` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_taxeFonciereBiensEtranger` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_factureEntretienImmeuble` BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (`prive_id`) REFERENCES `Prive`(`prive_id`) ON DELETE CASCADE
);
 
CREATE TABLE `InteretDettes` (
    `dettes_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `prive_id` BIGINT UNSIGNED NOT NULL,
    `fo_attestationEmprunt` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'solde et intérêts',
    `fo_attestationCarteCredit` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'solde et intérêts',
    `fo_attestationHypotheque` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'solde et intérêts',
    FOREIGN KEY (`prive_id`) REFERENCES `Prive`(`prive_id`) ON DELETE CASCADE
);
 
CREATE TABLE `Deduction` (
    `autre_deduction_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `prive_id` BIGINT UNSIGNED NOT NULL,
    `fo_rachatLPP` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_attestation3emePilierA` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_attestation3emePilierB` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Assurance Vie et Vieillesse',
    `fo_attestationAssuranceMaladie` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Prime + Frais médicaux',
    `fo_attestationAssuranceAccident` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_cotisationAVS` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_fraisFormationProfessionnel` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_fraisMedicaux` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Frais médicaux non pris en charge par assurance maladie',
    `fo_fraisHandicap` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_dons` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_versementPartisPolitiques` BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (`prive_id`) REFERENCES `Prive`(`prive_id`) ON DELETE CASCADE
);
 
CREATE TABLE `AutreInformations` (
    `autre_informations_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `prive_id` BIGINT UNSIGNED NOT NULL,
    `fo_versementBoursesEtudes` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_pensionsPercuesEnfantMajeurACharge` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_prestationsAVSSPC` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_prestationsFamilialesSPC` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_prestationsVilleCommune` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_allocationsImpotents` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_reparationTortMoral` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_hospiceGeneral` BOOLEAN NOT NULL DEFAULT FALSE,
    `fo_institutionBienfaisance` BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (`prive_id`) REFERENCES `Prive`(`prive_id`) ON DELETE CASCADE
);