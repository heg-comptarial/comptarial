require("dotenv").config(); // Load environment variables from .env file
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const fs = require("fs");

// Importer la connexion MySQL depuis models/db.js
const pool = require("./models/db");

// const indexRouter = require("./routes/index");
// const usersRouter = require("./routes/users");
// const utilisateurRouter = require("./routes/utilisateurs");

// Import all routes in one place
const routes = [
  { path: "/", router: require("./routes/index") },
  { path: "/users", router: require("./routes/users") },
  { path: "/api/utilisateurs", router: require("./routes/utilisateurs") },
];

const app = express();

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000", // Authorize only your frontend
  })
);

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use("/", indexRouter);
// app.use("/users", usersRouter);
// app.use("/api/utilisateurs", utilisateurRouter); // Ajout des routes Utilisateur
// Register all routes from the array
routes.forEach((route) => app.use(route.path, route.router));

// Vérifier la connexion MySQL
async function checkDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connected to MySQL database");
    connection.release();
  } catch (err) {
    console.error("❌ Error connecting to MySQL:", err);
  }
}

checkDatabaseConnection();

//Exécuter le script SQL si nécessaire
// const sqlScriptPath = path.join(__dirname, "dbMySQL.sql");
//
// if (fs.existsSync(sqlScriptPath)) {
//   fs.readFile(sqlScriptPath, "utf8", async (err, sqlScript) => {
// if (err) {
//   console.error("❌ Error reading SQL script:", err);
//   return;
// }
// try {
//   await pool.query(sqlScript);
//   console.log("✅ Database setup complete");
// } catch (error) {
//   console.error("❌ Error executing SQL script:", error);
// }
//   });
// } else {
//   console.warn("⚠ No SQL script found at", sqlScriptPath);
// }
//

// Check if the database is initialized
const checkIfDatabaseNeedsInitialization = async () => {
  try {
    const result = await pool.query("SHOW TABLES");
    const tables = result.map((row) => Object.values(row)[0]);

    // If there are no tables, run the setup script
    if (tables.length === 0) {
      console.log("Database is empty. Running setup...");
      await runDatabaseSetup();
    }
  } catch (err) {
    console.error("❌ Error checking database:", err);
  }
};

const runDatabaseSetup = async () => {
  const sqlScriptPath = path.join(__dirname, "dbMySQL.sql");

  if (fs.existsSync(sqlScriptPath)) {
    fs.readFile(sqlScriptPath, "utf8", async (err, sqlScript) => {
      if (err) {
        console.error("❌ Error reading SQL script:", err);
        return;
      }
      try {
        await pool.query(sqlScript);
        console.log("✅ Database setup complete");
      } catch (error) {
        console.error("❌ Error executing SQL script:", error);
      }
    });
  } else {
    console.warn("⚠ No SQL script found at", sqlScriptPath);
  }
};

// Run the check at app start
checkIfDatabaseNeedsInitialization();

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

// Démarrer le serveur après avoir défini `app`
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
