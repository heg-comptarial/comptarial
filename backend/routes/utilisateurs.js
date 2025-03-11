const express = require("express");
const router = express.Router();
const utilisateurController = require("../controllers/utilisateurController");

router.get("/", utilisateurController.getAllUsers);
router.get("/:id", utilisateurController.getUserById);
router.post("/", utilisateurController.createUser);
router.delete("/:id", utilisateurController.deleteUser);

module.exports = router;
