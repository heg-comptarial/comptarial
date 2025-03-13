const Sequelize = require('sequelize');
const Client = require('./client');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('entreprise', {
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
        model: 'client',
        key: 'client_id'
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
      type: DataTypes.ENUM('Y','N'),
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

  // Associations
  Entreprise.belongsTo(Client, { foreignKey: 'client_id', onDelete: 'CASCADE' });


  return Entreprise;
};
