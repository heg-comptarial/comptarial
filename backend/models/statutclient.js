const Sequelize = require('sequelize');
const Client = require('./client');


module.exports = function(sequelize, DataTypes) {
  return sequelize.define('statutclient', {
    statut_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    client_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'client',
        key: 'client_id'
      }
    },
    nom: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'statutclient',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "statut_id" },
        ]
      },
      {
        name: "client_id",
        using: "BTREE",
        fields: [
          { name: "client_id" },
        ]
      },
    ]
  });

  // Association : Un StatutClient appartient à un Client
  StatutClient.belongsTo(Client, { 
    foreignKey: 'client_id', 
    onDelete: 'CASCADE', as: 'client' 
  });

  return StatutClient;
};
