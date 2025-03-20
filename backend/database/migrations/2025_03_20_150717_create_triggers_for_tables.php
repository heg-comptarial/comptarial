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
            BEFORE INSERT ON Prive
            FOR EACH ROW
            BEGIN
                DECLARE user_exists INT;

                -- Vérifier si le user_id existe déjà dans Entreprise ou Administrateur
                SELECT COUNT(*) INTO user_exists
                FROM (
                    SELECT user_id FROM Entreprise WHERE user_id = NEW.user_id
                    UNION
                    SELECT user_id FROM Administrateur WHERE user_id = NEW.user_id
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
            BEFORE INSERT ON Entreprise
            FOR EACH ROW
            BEGIN
                DECLARE user_exists INT;

                -- Vérifier si le user_id existe déjà dans Prive ou Administrateur
                SELECT COUNT(*) INTO user_exists
                FROM (
                    SELECT user_id FROM Prive WHERE user_id = NEW.user_id
                    UNION
                    SELECT user_id FROM Administrateur WHERE user_id = NEW.user_id
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
            BEFORE INSERT ON Administrateur
            FOR EACH ROW
            BEGIN
                DECLARE user_exists INT;

                -- Vérifier si le user_id existe déjà dans Prive ou Entreprise
                SELECT COUNT(*) INTO user_exists
                FROM (
                    SELECT user_id FROM Prive WHERE user_id = NEW.user_id
                    UNION
                    SELECT user_id FROM Entreprise WHERE user_id = NEW.user_id
                ) AS combined_users;

                -- Si user_id existe, empêcher l\'insertion
                IF user_exists > 0 THEN
                    SIGNAL SQLSTATE \'45000\'
                    SET MESSAGE_TEXT = \'Ce user_id existe déjà dans Prive ou Entreprise.\';
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
    }
}
