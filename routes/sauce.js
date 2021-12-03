// Ce routeur contient les routes vers les fonctions concernant les sauces
const express = require('express');
const router = express.Router();

// On importe le controller qui défini ce que font les différentes fonctions
const sauceCtrl = require ('../controllers/sauce')

// On importe les middleware, auth pour sécuriser les routes et multer pour la gestion des images
const auth = require ('../middleware/auth');
const multer = require ('../middleware/multer-config')

// Routes vers les différentes fonctions
router.get('/', auth, sauceCtrl.findSauces); // Récupération des sauces
router.get('/:id', auth, sauceCtrl.findOneSauce); // Récupération d'une sauce
router.post('/', auth, multer, sauceCtrl.createSauce); // Création d'une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce); // Modification d'une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce); // Suppression d'une sauce
router.post('/:id/like', auth, sauceCtrl.likeDislikeSauce); // Like ou Dislike d'une sauce

module.exports = router;