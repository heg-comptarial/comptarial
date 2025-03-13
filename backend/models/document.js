const Sequelize = require('sequelize');
const Commentaire = require('./commentaire');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('document', {
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


// Association: A Document belongs to a SousRubrique
Document.belongsTo(SousRubrique, { foreignKey: 'sous_rub_id', onDelete: 'CASCADE', as: 'sousRubrique' });

// Association: A Document has many Commentaires
Document.hasMany(Commentaire, { foreignKey: 'doc_id', onDelete: 'CASCADE', as: 'commentaires' });


return Document;
};
