const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const Prive = sequelize.define('prive', {
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

  // Associations directes
  Prive.associate = (models) => {
    // Un Prive appartient à un Client
    Prive.belongsTo(models.Client, { foreignKey: 'client_id', as: 'client' });

    // Un Prive a plusieurs Formulaire
    Prive.hasMany(models.Formulaire, { foreignKey: 'prive_id', as: 'formulaire' });

    // Un Prive a un Conjoints
    Prive.hasOne(models.Conjoint, { foreignKey: 'prive_id', as: 'conjoints' });
  };

  return Prive;
};
