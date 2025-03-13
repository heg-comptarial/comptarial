const Sequelize = require('sequelize');

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
        fields: [
          { name: "client_id" },
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

  // Associations directes
  Client.associate = (models) => {
    // Client appartient à un utilisateur
    Client.belongsTo(models.Utilisateur, { foreignKey: 'utilisateur_id', as: 'utilisateur' });

    // Un client a soit un compte privé ou une entreprise, relation one-to-one
    Client.hasOne(models.Prive, { foreignKey: 'client_id', as: 'prive' });
    Client.hasOne(models.Entreprise, { foreignKey: 'client_id', as: 'entreprise' });

    // Un client a un statut, relation one-to-one
    Client.hasOne(models.StatutClient, { foreignKey: 'client_id', as: 'statutclient' });

    // Un client a plusieurs déclarations, relation one-to-many
    Client.hasMany(models.Declaration, { foreignKey: 'client_id', as: 'declarations' });
  };

  return Client;
};
