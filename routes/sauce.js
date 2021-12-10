// Ce routeur contient les routes vers les fonctions concernant les sauces
const express = require('express');
const router = express.Router();

// On importe le controller qui défini ce que font les différentes fonctions
const sauceCtrl = require ('../controllers/sauce')

// On importe les middleware, auth pour sécuriser les routes et multer pour la gestion des images
const auth = require ('../middleware/auth');
const multer = require ('../middleware/multer-config')

// On importe le middleware qui va vérifier que le fichier rentré est bien une image avec les bons mimetype
const checkSauceFile = require ('../middleware/check-sauce-file')

// Routes vers les différentes fonctions
router.get('/', auth, sauceCtrl.findSauces); // Récupération des sauces
router.get('/:id', auth, sauceCtrl.findOneSauce); // Récupération d'une sauce
router.post('/', auth, multer, checkSauceFile, sauceCtrl.createSauce); // Création d'une sauce
router.put('/:id', auth, multer, checkSauceFile, sauceCtrl.modifySauce); // Modification d'une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce); // Suppression d'une sauce
router.post('/:id/like', auth, sauceCtrl.likeDislikeSauce); // Like ou Dislike d'une sauce

module.exports = router;