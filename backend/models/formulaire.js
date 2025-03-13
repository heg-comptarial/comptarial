const Sequelize = require('sequelize');
const Prive = require('./prive');
const Declaration = require('./declaration');


module.exports = function(sequelize, DataTypes) {
  return sequelize.define('formulaire', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    prive_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'prive',
        key: 'prive_id'
      }
    },
    declaration_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'declaration',
        key: 'declaration_id'
      }
    },
    titre_formulaire: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    banques: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false,
      defaultValue: "N"
    },
    dettes: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false,
      defaultValue: "N"
    },
    enfants: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false,
      defaultValue: "N"
    },
    immobiliers: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false,
      defaultValue: "N"
    }
  }, {
    sequelize,
    tableName: 'formulaire',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "prive_id",
        using: "BTREE",
        fields: [
          { name: "prive_id" },
        ]
      },
      {
        name: "declaration_id",
        using: "BTREE",
        fields: [
          { name: "declaration_id" },
        ]
      },
    ]
  });

  // Associations
Formulaire.belongsTo(Prive, { foreignKey: 'prive_id', onDelete: 'CASCADE' });
Formulaire.belongsTo(Declaration, { foreignKey: 'declaration_id', onDelete: 'CASCADE' });

return Formulaire;
};
