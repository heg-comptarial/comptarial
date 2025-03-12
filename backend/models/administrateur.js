const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Administrateur = sequelize.define('Administrateur', {
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
        model: 'Utilisateurs', // Table Utilisateurs
        key: 'utilisateur_id' // Colonne correspondant dans la table Utilisateurs
      }
    },
    niveau_acces: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'administrateur',
    timestamps: false, // Enlever les champs createdAt et updatedAt si tu ne les veux pas
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "admin_id" }, // Index pour admin_id
        ]
      },
      {
        name: "utilisateur_id",
        using: "BTREE",
        fields: [
          { name: "utilisateur_id" }, // Index pour utilisateur_id
        ]
      },
    ]
  });

  // Association : un administrateur appartient à un utilisateur
  Administrateur.belongsTo(sequelize.models.Utilisateur, {
    foreignKey: 'utilisateur_id',
    as: 'utilisateur' // Un administrateur appartient à un utilisateur
  });

  // Association : un administrateur peut avoir plusieurs commentaires
  Administrateur.hasMany(sequelize.models.Commentaire, {
    foreignKey: 'admin_id',
    as: 'commentaires' // Un administrateur peut avoir plusieurs commentaires
  });

  return Administrateur;
};
