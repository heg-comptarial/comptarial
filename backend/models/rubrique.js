const Sequelize = require('sequelize');
const Declaration = require('./Declaration');
const SousRubrique = require('./SousRubrique');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('rubrique', {
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

  // belongsto the declaration
  rubrique.belongsTo(Declaration, { 
    foreignKey: 'declaration_id', 
    targetKey: 'declaration_id' 
  });

  //hasmany sous_rubrique
  rubrique.hasMany(SousRubrique, { 
    foreignKey: 'rubrique_id', 
    targetKey: 'rubrique_id' 
  });

  return rubrique;
};
