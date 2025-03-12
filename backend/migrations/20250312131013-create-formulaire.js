'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Formulaires', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      prive_id: {
        type: Sequelize.INTEGER
      },
      declaration_id: {
        type: Sequelize.INTEGER
      },
      titre_formulaire: {
        type: Sequelize.STRING
      },
      banques: {
        type: Sequelize.STRING
      },
      dettes: {
        type: Sequelize.STRING
      },
      enfants: {
        type: Sequelize.STRING
      },
      immobiliers: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Formulaires');
  }
};