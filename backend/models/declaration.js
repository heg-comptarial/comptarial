const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const Declaration = sequelize.define('declaration', {
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
        model: 'client',  // Associe à la table 'client'
        key: 'client_id'  // Clé étrangère dans 'client'
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

  // Associations directes
  Declaration.associate = (models) => {
    // Une Déclaration appartient à un Client
    Declaration.belongsTo(models.Client, { foreignKey: 'client_id', as: 'client' });

    // Une Déclaration a un Formulaires
    Declaration.hasOne(models.Formulaire, { foreignKey: 'declaration_id', as: 'formulaires' });

    // Une Déclaration a plusieurs rubriques
    Declaration.hasMany(models.Rubrique, { foreignKey: 'rubrique_id', as: 'rubrique' });
  };

  return Declaration;
};
