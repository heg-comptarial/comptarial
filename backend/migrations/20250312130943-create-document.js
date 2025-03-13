'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Documents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      client_id: {
        type: Sequelize.INTEGER
      },
      sous_rub_id: {
        type: Sequelize.INTEGER
      },
      titre: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      date_ajout: {
        type: Sequelize.DATE
      },
      chemin_fichier: {
        type: Sequelize.STRING
      },
      statut: {
        type: Sequelize.STRING
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Documents');
  }
};