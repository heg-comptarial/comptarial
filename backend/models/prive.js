const Sequelize = require('sequelize');
const Client = require('./client');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('prive', {
    prive_id: {
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
    nationalite: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    date_de_naissance: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    etat_civil: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'prive',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "prive_id" },
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
  Prive.belongsTo(Client, { foreignKey: 'client_id', onDelete: 'CASCADE' });

  return Prive;
};

