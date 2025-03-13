const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('administrateur', {
    admin_id: {
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
    niveau_acces: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'administrateur',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "admin_id" },
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
