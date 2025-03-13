const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const Commentaire = sequelize.define('commentaire', {
    commentaire_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    doc_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'document',
        key: 'doc_id'
      }
    },
    admin_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'administrateur',
        key: 'admin_id'
      }
    },
    contenu: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    date_creation: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    }
  }, {
    sequelize,
    tableName: 'commentaire',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "commentaire_id" },
        ]
      },
      {
        name: "doc_id",
        using: "BTREE",
        fields: [
          { name: "doc_id" },
        ]
      },
      {
        name: "admin_id",
        using: "BTREE",
        fields: [
          { name: "admin_id" },
        ]
      },
    ]
  });

  // Associations directes
  Commentaire.associate = (models) => {
    // Un commentaire appartient à un administrateur
    Commentaire.belongsTo(models.Administrateur, { foreignKey: 'admin_id', as: 'admin' });

    // Un commentaire appartient à un document
    Commentaire.belongsTo(models.Document, { foreignKey: 'doc_id', as: 'doc' });
  };

  return Commentaire;
};
