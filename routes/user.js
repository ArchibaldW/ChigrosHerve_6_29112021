// Ce routeur contient les routes vers les fonctions concernant les utilisateurs
const express = require('express');
const router = express.Router();

// On importe le controller qui défini ce que font les différentes fonctions
const userCtrl = require('../controllers/user');

// Routes vers les différentes fonctions
router.post('/signup', userCtrl.signup); // Inscription d'un utilisateur
router.post('/login', userCtrl.login); // Connection d'un utilisateur

module.exports = router;