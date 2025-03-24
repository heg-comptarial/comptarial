<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class CreateTriggersForTables extends Migration
{
    /**
     * Exécutez les migrations.
     *
     * @return void
     */
    public function up()
    {
        // Définir les triggers pour la table Prive
        DB::statement('
            CREATE TRIGGER before_insert_prive
            BEFORE INSERT ON prive
            FOR EACH ROW
            BEGIN
                DECLARE user_exists INT;

                -- Vérifier si le user_id existe déjà dans Entreprise ou Administrateur
                SELECT COUNT(*) INTO user_exists
                FROM (
                    SELECT user_id FROM entreprise WHERE user_id = NEW.user_id
                    UNION
                    SELECT user_id FROM administrateur WHERE user_id = NEW.user_id
                ) AS combined_users;

                -- Si user_id existe, empêcher l\'insertion
                IF user_exists > 0 THEN
                    SIGNAL SQLSTATE \'45000\'
                    SET MESSAGE_TEXT = \'Ce user_id existe déjà dans Entreprise ou Administrateur.\';
                END IF;
            END;
        ');

        // Définir les triggers pour la table Entreprise
        DB::statement('
            CREATE TRIGGER before_insert_entreprise
            BEFORE INSERT ON entreprise
            FOR EACH ROW
            BEGIN
                DECLARE user_exists INT;

                -- Vérifier si le user_id existe déjà dans Prive ou Administrateur
                SELECT COUNT(*) INTO user_exists
                FROM (
                    SELECT user_id FROM prive WHERE user_id = NEW.user_id
                    UNION
                    SELECT user_id FROM administrateur WHERE user_id = NEW.user_id
                ) AS combined_users;

                -- Si user_id existe, empêcher l\'insertion
                IF user_exists > 0 THEN
                    SIGNAL SQLSTATE \'45000\'
                    SET MESSAGE_TEXT = \'Ce user_id existe déjà dans Prive ou Administrateur.\';
                END IF;
            END;
        ');

        // Définir les triggers pour la table Administrateur
        DB::statement('
            CREATE TRIGGER before_insert_administrateur
            BEFORE INSERT ON administrateur
            FOR EACH ROW
            BEGIN
                DECLARE user_exists INT;

                -- Vérifier si le user_id existe déjà dans Prive ou Entreprise
                SELECT COUNT(*) INTO user_exists
                FROM (
                    SELECT user_id FROM prive WHERE user_id = NEW.user_id
                    UNION
                    SELECT user_id FROM entreprise WHERE user_id = NEW.user_id
                ) AS combined_users;

                -- Si user_id existe, empêcher l\'insertion
                IF user_exists > 0 THEN
                    SIGNAL SQLSTATE \'45000\'
                    SET MESSAGE_TEXT = \'Ce user_id existe déjà dans Prive ou Entreprise.\';
                END IF;
            END;
        ');

        // Définir un trigger pour empêcher l'ajout d'un 'prive' si l'utilisateur n'est pas 'approved'
        DB::statement('
        CREATE TRIGGER check_user_status_before_prive
        BEFORE INSERT ON prive
        FOR EACH ROW
        BEGIN
            DECLARE user_statut VARCHAR(50);
            
            -- Vérifier le statut de l\'utilisateur
            SELECT statut INTO user_statut FROM `user` WHERE user_id = NEW.user_id LIMIT 1;
            
            -- Si l\'utilisateur n\'est pas "approved", empêcher l\'insertion
            IF user_statut <> "approved" THEN
                SIGNAL SQLSTATE "45000"
                SET MESSAGE_TEXT = "L\'utilisateur doit être accepté avant de pouvoir être ajouté comme Privé.";
            END IF;
        END;
    ');

    // Définir un trigger pour empêcher l'ajout d'une 'entreprise' si l'utilisateur n'est pas 'approved'
    DB::statement('
        CREATE TRIGGER check_user_status_before_entreprise
        BEFORE INSERT ON entreprise
        FOR EACH ROW
        BEGIN
            DECLARE user_statut VARCHAR(50);
            
            -- Vérifier le statut de l\'utilisateur
            SELECT statut INTO user_statut FROM `user` WHERE user_id = NEW.user_id LIMIT 1;
            
            -- Si l\'utilisateur n\'est pas "approved", empêcher l\'insertion
            IF user_statut <> "approved" THEN
                SIGNAL SQLSTATE "45000"
                SET MESSAGE_TEXT = "L\'utilisateur doit être accepté avant de pouvoir être ajouté comme Entreprise.";
            END IF;
        END;
    ');


    }

    /**
     * Annulez les migrations.
     *
     * @return void
     */
    public function down()
    {
        // Supprimer les triggers dans la méthode down pour pouvoir les réinitialiser en cas de rollback
        DB::statement('
            DROP TRIGGER IF EXISTS before_insert_prive;
        ');

        DB::statement('
            DROP TRIGGER IF EXISTS before_insert_entreprise;
        ');

        DB::statement('
            DROP TRIGGER IF EXISTS before_insert_administrateur;
        ');

        DB::statement('
            DROP TRIGGER IF EXISTS check_user_status_before_prive;
        ');

        DB::statement('
            DROP TRIGGER IF EXISTS check_user_status_before_entreprise;
        ');

        
    }
}
