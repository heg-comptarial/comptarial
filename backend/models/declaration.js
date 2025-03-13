const Sequelize = require('sequelize');
const Client = require('./client');
const Rubrique = require('./rubrique');
const Formulaire = require('./formulaire');


module.exports = function(sequelize, DataTypes) {
  return sequelize.define('declaration', {
    declaration_id: {
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
    titre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    date_creation: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    statut: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'declaration',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "declaration_id" },
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

  // Association: A Declaration belongs to a Client
Declaration.belongsTo(Client, { foreignKey: 'client_id', onDelete: 'CASCADE', as: 'client' });

// Association: A Declaration has many Rubriques
Declaration.hasMany(Rubrique, { foreignKey: 'declaration_id', onDelete: 'CASCADE', as: 'rubriques' });

// Association: A Declaration has many Formulaires
Declaration.hasMany(Formulaire, { foreignKey: 'declaration_id', onDelete: 'CASCADE', as: 'formulaires' });


return Declaration;
};
