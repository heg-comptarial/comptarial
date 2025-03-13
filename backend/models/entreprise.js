const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const Entreprise = sequelize.define('entreprise', {
    entreprise_id: {
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
    raison_sociale: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    prestations: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    nouvelle_entreprise: {
      type: DataTypes.ENUM('Y', 'N'),
      allowNull: false,
      defaultValue: "N"
    },
    grand_livre: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'entreprise',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "entreprise_id" },
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

  // Association directe
  Entreprise.associate = (models) => {
    // Une entreprise appartient à un client
    Entreprise.belongsTo(models.Client, { foreignKey: 'client_id', as: 'client' });
  };

  return Entreprise;
};
