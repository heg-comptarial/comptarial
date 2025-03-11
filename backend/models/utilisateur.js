const pool = require("./db");

const Utilisateur = {
  getAll: async () => {
    const [rows] = await pool.query("SELECT * FROM Utilisateur");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await pool.query(
      "SELECT * FROM Utilisateur WHERE utilisateur_id = ?",
      [id]
    );
    return rows[0];
  },

  create: async (data) => {
    const {
      nom,
      email,
      mot_de_passe,
      localite,
      adresse,
      code_postal,
      numero_telephone,
    } = data;
    const [result] = await pool.query(
      `INSERT INTO Utilisateur (nom, email, mot_de_passe, localite, adresse, code_postal, numero_telephone) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        nom,
        email,
        mot_de_passe,
        localite,
        adresse,
        code_postal,
        numero_telephone,
      ]
    );
    return result.insertId;
  },

  delete: async (id) => {
    const [result] = await pool.query(
      "DELETE FROM Utilisateur WHERE utilisateur_id = ?",
      [id]
    );
    return result.affectedRows;
  },
};

module.exports = Utilisateur;
