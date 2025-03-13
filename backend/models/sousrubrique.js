const Sequelize = require('sequelize');
const Document = require('./document');
const Rubrique = require('./rubrique');


module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sousrubrique', {
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

  // Association: A SousRubrique belongs to a Rubrique
  SousRubrique.belongsTo(Rubrique, { 
    foreignKey: 'rubrique_id', 
    onDelete: 'CASCADE', as: 'rubrique' 
  });

  // Association: A SousRubrique has many Documents
  SousRubrique.hasMany(Document, { 
    foreignKey: 'sous_rub_id', 
    onDelete: 'CASCADE', as: 'documents' 
  });

  return SousRubrique;
  
};
