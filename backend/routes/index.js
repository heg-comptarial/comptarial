var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* Route de test pour le frontend */
router.get("/api/test", function (req, res, next) {
  res.json({ message: "Hello from backend!" });
});

module.exports = router;
