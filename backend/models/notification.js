const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notification', {
    notification_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    utilisateur_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'utilisateur',
        key: 'utilisateur_id'
      }
    },
    type_notif: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    contenu: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    date_envoi: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    lecture_statut: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false,
      defaultValue: "N"
    }
  }, {
    sequelize,
    tableName: 'notification',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "notification_id" },
        ]
      },
      {
        name: "utilisateur_id",
        using: "BTREE",
        fields: [
          { name: "utilisateur_id" },
        ]
      },
    ]
  });
};
