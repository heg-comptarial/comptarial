var DataTypes = require("sequelize").DataTypes;
var _administrateur = require("./administrateur");
var _client = require("./client");
var _commentaire = require("./commentaire");
var _conjoint = require("./conjoint");
var _declaration = require("./declaration");
var _document = require("./document");
var _entreprise = require("./entreprise");
var _formulaire = require("./formulaire");
var _notification = require("./notification");
var _prive = require("./prive");
var _rubrique = require("./rubrique");
var _sousrubrique = require("./sousrubrique");
var _statutclient = require("./statutclient");
var _utilisateur = require("./utilisateur");

function initModels(sequelize) {
  var administrateur = _administrateur(sequelize, DataTypes);
  var client = _client(sequelize, DataTypes);
  var commentaire = _commentaire(sequelize, DataTypes);
  var conjoint = _conjoint(sequelize, DataTypes);
  var declaration = _declaration(sequelize, DataTypes);
  var document = _document(sequelize, DataTypes);
  var entreprise = _entreprise(sequelize, DataTypes);
  var formulaire = _formulaire(sequelize, DataTypes);
  var notification = _notification(sequelize, DataTypes);
  var prive = _prive(sequelize, DataTypes);
  var rubrique = _rubrique(sequelize, DataTypes);
  var sousrubrique = _sousrubrique(sequelize, DataTypes);
  var statutclient = _statutclient(sequelize, DataTypes);
  var utilisateur = _utilisateur(sequelize, DataTypes);

  commentaire.belongsTo(administrateur, { as: "admin", foreignKey: "admin_id"});
  administrateur.hasMany(commentaire, { as: "commentaires", foreignKey: "admin_id"});
  declaration.belongsTo(client, { as: "client", foreignKey: "client_id"});
  client.hasMany(declaration, { as: "declarations", foreignKey: "client_id"});
  document.belongsTo(client, { as: "client", foreignKey: "client_id"});
  client.hasMany(document, { as: "documents", foreignKey: "client_id"});
  entreprise.belongsTo(client, { as: "client", foreignKey: "client_id"});
  client.hasMany(entreprise, { as: "entreprises", foreignKey: "client_id"});
  prive.belongsTo(client, { as: "client", foreignKey: "client_id"});
  client.hasMany(prive, { as: "prives", foreignKey: "client_id"});
  statutclient.belongsTo(client, { as: "client", foreignKey: "client_id"});
  client.hasMany(statutclient, { as: "statutclients", foreignKey: "client_id"});
  formulaire.belongsTo(declaration, { as: "declaration", foreignKey: "declaration_id"});
  declaration.hasMany(formulaire, { as: "formulaires", foreignKey: "declaration_id"});
  rubrique.belongsTo(declaration, { as: "declaration", foreignKey: "declaration_id"});
  declaration.hasMany(rubrique, { as: "rubriques", foreignKey: "declaration_id"});
  commentaire.belongsTo(document, { as: "doc", foreignKey: "doc_id"});
  document.hasMany(commentaire, { as: "commentaires", foreignKey: "doc_id"});
  conjoint.belongsTo(prive, { as: "prive", foreignKey: "prive_id"});
  prive.hasMany(conjoint, { as: "conjoints", foreignKey: "prive_id"});
  formulaire.belongsTo(prive, { as: "prive", foreignKey: "prive_id"});
  prive.hasMany(formulaire, { as: "formulaires", foreignKey: "prive_id"});
  sousrubrique.belongsTo(rubrique, { as: "rubrique", foreignKey: "rubrique_id"});
  rubrique.hasMany(sousrubrique, { as: "sousrubriques", foreignKey: "rubrique_id"});
  document.belongsTo(sousrubrique, { as: "sous_rub", foreignKey: "sous_rub_id"});
  sousrubrique.hasMany(document, { as: "documents", foreignKey: "sous_rub_id"});
  administrateur.belongsTo(utilisateur, { as: "utilisateur", foreignKey: "utilisateur_id"});
  utilisateur.hasMany(administrateur, { as: "administrateurs", foreignKey: "utilisateur_id"});
  client.belongsTo(utilisateur, { as: "utilisateur", foreignKey: "utilisateur_id"});
  utilisateur.hasMany(client, { as: "clients", foreignKey: "utilisateur_id"});
  notification.belongsTo(utilisateur, { as: "utilisateur", foreignKey: "utilisateur_id"});
  utilisateur.hasMany(notification, { as: "notifications", foreignKey: "utilisateur_id"});

  return {
    administrateur,
    client,
    commentaire,
    conjoint,
    declaration,
    document,
    entreprise,
    formulaire,
    notification,
    prive,
    rubrique,
    sousrubrique,
    statutclient,
    utilisateur,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
