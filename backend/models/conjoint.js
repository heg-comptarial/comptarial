const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const Conjoint = sequelize.define('conjoint', {
    conjoint_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    prive_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'prive',  // Associe à la table 'prive'
        key: 'prive_id'  // Clé étrangère dans 'prive'
      }
    },
    nom: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    prenom: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nationalite: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    date_de_naissance: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    localite: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    adresse: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    code_postal: {
      type: DataTypes.STRING(10),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'conjoint',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "conjoint_id" },
        ]
      },
      {
        name: "prive_id",
        using: "BTREE",
        fields: [
          { name: "prive_id" },
        ]
      },
    ]
  });

  // Associations directes
  Conjoint.associate = (models) => {
    Conjoint.belongsTo(models.Prive, { foreignKey: 'prive_id', as: 'prive' });
  };

  return Conjoint;
};
