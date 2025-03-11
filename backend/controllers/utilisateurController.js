const Utilisateur = require("../models/utilisateur");

const getAllUsers = async (req, res) => {
  try {
    const users = await Utilisateur.getAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await Utilisateur.getById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const createUser = async (req, res) => {
  try {
    const id = await Utilisateur.create(req.body);
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const affectedRows = await Utilisateur.delete(req.params.id);
    if (!affectedRows)
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json({ message: "Utilisateur supprimé" });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

module.exports = { getAllUsers, getUserById, createUser, deleteUser };
