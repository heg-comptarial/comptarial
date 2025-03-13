const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const Document = sequelize.define('document', {
    doc_id: {
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
    sous_rub_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'sousrubrique',
        key: 'sous_rub_id'
      }
    },
    titre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    date_ajout: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    chemin_fichier: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    statut: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'document',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "doc_id" },
        ]
      },
      {
        name: "client_id",
        using: "BTREE",
        fields: [
          { name: "client_id" },
        ]
      },
      {
        name: "sous_rub_id",
        using: "BTREE",
        fields: [
          { name: "sous_rub_id" },
        ]
      },
    ]
  });

  // Associations directes
  Document.associate = (models) => {
    // Un document appartient à un client
    Document.belongsTo(models.Client, { foreignKey: 'client_id', as: 'client' });
    
    // Un document appartient à une sous-rubrique
    Document.belongsTo(models.Sousrubrique, { foreignKey: 'sous_rub_id', as: 'sousrubrique' });
  };

  return Document;
};
