'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Notifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      utilisateur_id: {
        type: Sequelize.INTEGER
      },
      type_notif: {
        type: Sequelize.STRING
      },
      contenu: {
        type: Sequelize.TEXT
      },
      date_envoi: {
        type: Sequelize.DATE
      },
      lecture_statut: {
        type: Sequelize.STRING
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Notifications');
  }
};