const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const Rubrique = sequelize.define('rubrique', {
    rubrique_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    declaration_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'declaration',
        key: 'declaration_id'
      }
    },
    titre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'rubrique',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "rubrique_id" },
        ]
      },
      {
        name: "declaration_id",
        using: "BTREE",
        fields: [
          { name: "declaration_id" },
        ]
      },
    ]
  });

  // Associations directes
  Rubrique.associate = (models) => {
    // Une Rubrique appartient à une Déclaration
    Rubrique.belongsTo(models.Declaration, { foreignKey: 'declaration_id', as: 'declaration' });

    // Une Rubrique a plusieurs SousRubriques
    Rubrique.hasMany(models.Sousrubrique, { foreignKey: 'rubrique_id', as: 'sousrubriques' });
  };

  return Rubrique;
};
