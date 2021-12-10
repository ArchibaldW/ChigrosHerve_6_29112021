// Ce routeur contient les routes vers les fonctions concernant les utilisateurs
const express = require('express');
const router = express.Router();

// On importe le controller qui défini ce que font les différentes fonctions
const userCtrl = require('../controllers/user');

//On importe les middleware chargés de checker l'email et le mot de passe
const checkEmail = require('../middleware/check-email');
const checkPassword = require('../middleware/check-password');

// Routes vers les différentes fonctions
router.post('/signup', checkEmail, checkPassword, userCtrl.signup); // Inscription d'un utilisateur
router.post('/login', userCtrl.login); // Connection d'un utilisateur

module.exports = router;