const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const Utilisateur = sequelize.define('utilisateur', {
    utilisateur_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    nom: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "email"
    },
    mot_de_passe: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    date_creation: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
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
    },
    numero_telephone: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'utilisateur',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "utilisateur_id" },
        ]
      },
      {
        name: "email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
    ]
  });

  // Associations
  Utilisateur.associate = (models) => {
    // Un utilisateur a un admin
    Utilisateur.hasOne(models.Admin, { foreignKey: 'utilisateur_id', as: 'admin' });

    // Un utilisateur a un client
    Utilisateur.hasOne(models.Client, { foreignKey: 'utilisateur_id', as: 'client' });

    // Un utilisateur a plusieurs notifications (1-n)
    Utilisateur.hasMany(models.Notification, { foreignKey: 'utilisateur_id', as: 'notifications' });
  };

  return Utilisateur;
};
