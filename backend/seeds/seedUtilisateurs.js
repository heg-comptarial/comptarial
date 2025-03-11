const pool = require("../models/db");

async function seedUtilisateurs() {
  const utilisateurs = [
    {
      nom: "John Doe",
      email: "john.doe@example.com",
      mot_de_passe: "hashedPassword1", // You can replace with an actual hashed password
      localite: "Geneva",
      adresse: "123 Main St",
      code_postal: "1201",
      numero_telephone: "1234567890",
    },
    {
      nom: "Jane Smith",
      email: "jane.smith@example.com",
      mot_de_passe: "hashedPassword2",
      localite: "Lausanne",
      adresse: "456 Elm St",
      code_postal: "1001",
      numero_telephone: "0987654321",
    },
    // Add more sample users as needed
  ];

  try {
    for (const utilisateur of utilisateurs) {
      await pool.query(
        `INSERT INTO Utilisateur (nom, email, mot_de_passe, localite, adresse, code_postal, numero_telephone) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          utilisateur.nom,
          utilisateur.email,
          utilisateur.mot_de_passe,
          utilisateur.localite,
          utilisateur.adresse,
          utilisateur.code_postal,
          utilisateur.numero_telephone,
        ]
      );
      console.log(`User ${utilisateur.nom} inserted successfully`);
    }
    console.log("✅ Seeder completed successfully");
  } catch (err) {
    console.error("❌ Error seeding utilisateurs:", err);
  }
}

seedUtilisateurs();
