'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Utilisateurs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nom: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      mot_de_passe: {
        type: Sequelize.STRING
      },
      date_creation: {
        type: Sequelize.DATE
      },
      localite: {
        type: Sequelize.STRING
      },
      adresse: {
        type: Sequelize.STRING
      },
      code_postal: {
        type: Sequelize.STRING
      },
      numero_telephone: {
        type: Sequelize.STRING
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Utilisateurs');
  }
};