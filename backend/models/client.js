const Sequelize = require('sequelize');
const Utilisateur = require('./Utilisateur');
const Prive = require('./utilisateur');
const Declaration = require('./declaration');
const StatutClient = require('./statutclient');
const Entreprise = require('./entreprise');


module.exports = function(sequelize, DataTypes) {
  const Client = sequelize.define('client', {
    client_id: {
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
    type_entreprise: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    adresse: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    numero_fiscal: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'client',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "client_id" }]
      },
      {
        name: "utilisateur_id",
        using: "BTREE",
        fields: [{ name: "utilisateur_id" }]
      },
    ]
  });

  // Associations directes
  Client.belongsTo(Utilisateur, { foreignKey: 'utilisateur_id' });
  Client.hasOne(Prive, { foreignKey: 'client_id' });
  Client.hasMany(Declaration, { foreignKey: 'client_id' });
  Client.hasOne(StatutClient, { foreignKey: 'client_id' });
  Client.hasOne(Entreprise, { foreignKey: 'client_id' });

  return Client;

};
