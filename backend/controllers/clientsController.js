const { Client } = require("../models"); // Importer le modèle Client

// 🔹 Obtenir tous les clients
exports.getAllClients = async (req, res) => {
    try {
        const clients = await Client.findAll();  // Trouver tous les clients
        res.status(200).json(clients);  // Retourner les clients au format JSON
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });  // Gérer les erreurs serveur
    }
};

// 🔹 Obtenir un client par ID
exports.getClientById = async (req, res) => {
    try {
        const client = await Client.findByPk(req.params.id);  // Trouver un client par son ID
        if (!client) return res.status(404).json({ error: "Client non trouvé" });  // Vérifier si le client existe
        res.status(200).json(client);  // Retourner le client trouvé
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });  // Gérer les erreurs serveur
    }
};

// 🔹 Créer un nouveau client
exports.createClient = async (req, res) => {
    try {
        const newClient = await Client.create(req.body);  // Créer un client avec les données reçues dans le corps de la requête
        res.status(201).json(newClient);  // Retourner le client créé
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });  // Gérer les erreurs serveur
    }
};

// 🔹 Mettre à jour un client
exports.updateClient = async (req, res) => {
    try {
        const updated = await Client.update(req.body, { where: { client_id: req.params.id } });  // Mettre à jour un client par son ID
        if (updated[0] === 0) return res.status(404).json({ error: "Client non trouvé" });  // Vérifier si la mise à jour a eu lieu
        res.status(200).json({ message: "Client mis à jour" });  // Retourner un message de succès
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });  // Gérer les erreurs serveur
    }
};

// 🔹 Supprimer un client
exports.deleteClient = async (req, res) => {
    try {
        const deleted = await Client.destroy({ where: { client_id: req.params.id } });  // Supprimer un client par son ID
        if (!deleted) return res.status(404).json({ error: "Client non trouvé" });  // Vérifier si le client a été supprimé
        res.status(200).json({ message: "Client supprimé" });  // Retourner un message de succès
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });  // Gérer les erreurs serveur
    }
};
