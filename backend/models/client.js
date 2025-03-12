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
        fields: [{ name: "client_id" }]
      },
      {
        name: "utilisateur_id",
        using: "BTREE",
        fields: [{ name: "utilisateur_id" }]
      },
    ]
  });

  // Associations directes
  Client.associate = (models) => {
    Client.belongsTo(models.utilisateur, { foreignKey: 'utilisateur_id' });
    Client.hasOne(models.prive, { foreignKey: 'client_id' });
    Client.hasMany(models.declaration, { foreignKey: 'client_id' });
    Client.hasOne(models.statutclient, { foreignKey: 'client_id' });
    Client.hasOne(models.entreprise, { foreignKey: 'client_id' });
  };

  return Client;
};
