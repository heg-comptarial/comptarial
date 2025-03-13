const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const Administrateur = sequelize.define('administrateur', {
    administrateur_id: {
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
    },    niveau_acces: {
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
          { name: "administrateur_id" },
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

  // Associations
  Administrateur.associate = (models) => {
    // L'administrateur appartient à un utilisateur
    Administrateur.belongsTo(models.Utilisateur, { foreignKey: 'utilisateur_id', as: 'utilisateur' });
    
    // Un administrateur peut avoir plusieurs commentaires
    Administrateur.hasMany(models.Commentaire, { foreignKey: 'admin_id', as: 'commentaires' });
  };

  return Administrateur;
};
