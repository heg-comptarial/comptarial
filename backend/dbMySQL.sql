-- Drop tables if they exist
DROP TABLE IF EXISTS Commentaire;
DROP TABLE IF EXISTS Document;
DROP TABLE IF EXISTS Formulaire;
DROP TABLE IF EXISTS Conjoint;
DROP TABLE IF EXISTS StatutClient;
DROP TABLE IF EXISTS Entreprise;
DROP TABLE IF EXISTS Prive;
DROP TABLE IF EXISTS SousRubrique;
DROP TABLE IF EXISTS Rubrique;
DROP TABLE IF EXISTS Declaration;
DROP TABLE IF EXISTS Notification;
DROP TABLE IF EXISTS Administrateur;
DROP TABLE IF EXISTS Client;
DROP TABLE IF EXISTS Utilisateur;

-- Table Utilisateur
CREATE TABLE Utilisateur (
    utilisateur_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    localite VARCHAR(255) NOT NULL,
    adresse VARCHAR(255) NOT NULL,
    code_postal VARCHAR(10) NOT NULL,
    numero_telephone VARCHAR(20) NOT NULL
);

-- Table Client
CREATE TABLE Client (
    client_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id BIGINT UNSIGNED NOT NULL,
    type_entreprise VARCHAR(255) NOT NULL,
    adresse VARCHAR(255) NOT NULL,
    numero_fiscal VARCHAR(255) NOT NULL,
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur (utilisateur_id) ON DELETE CASCADE
);

-- Table Administrateur
CREATE TABLE Administrateur (
    admin_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id BIGINT UNSIGNED NOT NULL,
    niveau_acces VARCHAR(255) NOT NULL,
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur (utilisateur_id) ON DELETE CASCADE
);

-- Table Declaration
CREATE TABLE Declaration (
    declaration_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    client_id BIGINT UNSIGNED NOT NULL,
    titre VARCHAR(255) NOT NULL,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    statut VARCHAR(255) NOT NULL,
    FOREIGN KEY (client_id) REFERENCES Client (client_id) ON DELETE CASCADE
);

-- Table Rubrique
CREATE TABLE Rubrique (
    rubrique_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    declaration_id BIGINT UNSIGNED NOT NULL,
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (declaration_id) REFERENCES Declaration (declaration_id) ON DELETE CASCADE
);

-- Table SousRubrique
CREATE TABLE SousRubrique (
    sous_rub_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    rubrique_id BIGINT UNSIGNED NOT NULL,
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (rubrique_id) REFERENCES Rubrique (rubrique_id) ON DELETE CASCADE
);

-- Table Document
CREATE TABLE Document (
    doc_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    client_id BIGINT UNSIGNED NOT NULL,
    sous_rub_id BIGINT UNSIGNED NOT NULL,
    titre VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    date_ajout DATETIME DEFAULT CURRENT_TIMESTAMP,
    chemin_fichier VARCHAR(255) NOT NULL,
    statut VARCHAR(255) NOT NULL,
    FOREIGN KEY (client_id) REFERENCES Client (client_id) ON DELETE CASCADE,
    FOREIGN KEY (sous_rub_id) REFERENCES SousRubrique (sous_rub_id) ON DELETE CASCADE
);

-- Table Notification
CREATE TABLE Notification (
    notification_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id BIGINT UNSIGNED NOT NULL,
    type_notif VARCHAR(255) NOT NULL,
    contenu TEXT NOT NULL,
    date_envoi DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    lecture_statut ENUM('Y', 'N') DEFAULT 'N' NOT NULL,
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur (utilisateur_id) ON DELETE CASCADE
);

-- Table Commentaire
CREATE TABLE Commentaire (
    commentaire_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    doc_id BIGINT UNSIGNED NOT NULL,
    admin_id BIGINT UNSIGNED NOT NULL,
    contenu TEXT NOT NULL,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (doc_id) REFERENCES Document (doc_id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES Administrateur (admin_id) ON DELETE CASCADE
);

-- Table Prive
CREATE TABLE Prive (
    prive_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    client_id BIGINT UNSIGNED NOT NULL,
    nationalite VARCHAR(255) NOT NULL,
    date_de_naissance DATE NOT NULL,
    etat_civil VARCHAR(255) NOT NULL,
    FOREIGN KEY (client_id) REFERENCES Client (client_id) ON DELETE CASCADE
);

-- Table Entreprise
CREATE TABLE Entreprise (
    entreprise_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    client_id BIGINT UNSIGNED NOT NULL,
    raison_sociale VARCHAR(255) NOT NULL,
    prestations TEXT NOT NULL,
    nouvelle_entreprise ENUM('Y', 'N') DEFAULT 'N' NOT NULL,
    grand_livre VARCHAR(255) NOT NULL,
    FOREIGN KEY (client_id) REFERENCES Client (client_id) ON DELETE CASCADE
);

-- Table StatutClient
CREATE TABLE StatutClient (
    statut_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    client_id BIGINT UNSIGNED NOT NULL,
    nom VARCHAR(255) NOT NULL,
    FOREIGN KEY (client_id) REFERENCES Client (client_id) ON DELETE CASCADE
);

-- Table Conjoint
CREATE TABLE Conjoint (
    conjoint_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    prive_id BIGINT UNSIGNED NOT NULL,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    nationalite VARCHAR(255) NOT NULL,
    date_de_naissance DATE NOT NULL,
    localite VARCHAR(255) NOT NULL,
    adresse VARCHAR(255) NOT NULL,
    code_postal VARCHAR(10) NOT NULL,
    FOREIGN KEY (prive_id) REFERENCES Prive (prive_id) ON DELETE CASCADE
);

-- Table Formulaire
CREATE TABLE Formulaire (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    prive_id BIGINT UNSIGNED NOT NULL,
    declaration_id BIGINT UNSIGNED NOT NULL,
    titre_formulaire VARCHAR(255) NOT NULL,
    banques ENUM('Y', 'N') DEFAULT 'N' NOT NULL,
    dettes ENUM('Y', 'N') DEFAULT 'N' NOT NULL,
    enfants ENUM('Y', 'N') DEFAULT 'N' NOT NULL,
    immobiliers ENUM('Y', 'N') DEFAULT 'N' NOT NULL,
    FOREIGN KEY (prive_id) REFERENCES Prive (prive_id) ON DELETE CASCADE,
    FOREIGN KEY (declaration_id) REFERENCES Declaration (declaration_id) ON DELETE CASCADE
);
