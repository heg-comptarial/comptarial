const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const SousRubrique = sequelize.define('sousrubrique', {
    sous_rub_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    rubrique_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'rubrique',
        key: 'rubrique_id'
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
    tableName: 'sousrubrique',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "sous_rub_id" },
        ]
      },
      {
        name: "rubrique_id",
        using: "BTREE",
        fields: [
          { name: "rubrique_id" },
        ]
      },
    ]
  });

  // Associations directes
  SousRubrique.associate = (models) => {
    // Une SousRubrique appartient à une Rubrique
    SousRubrique.belongsTo(models.Rubrique, { foreignKey: 'rubrique_id', as: 'rubrique' });

    // Une SousRubrique a plusieurs Documents
    SousRubrique.hasMany(models.Document, { foreignKey: 'sous_rub_id', as: 'documents' });
  };

  return SousRubrique;
};
