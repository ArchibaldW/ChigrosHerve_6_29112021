const express = require('express');
const mongoose = require('mongoose');

// Donne accès au système de fichier
const path = require('path');

// On importe les différentes routes de notre application
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// On utilise dotenv pour cacher les informations sensibles grâces à des variables d'environnement
require('dotenv').config();

// On se connecte à la base de donnée MongoDB avec grace au variables d'environnement, pas de mot de passe en clair
mongoose.connect(process.env.SECRET_DB,{useNewUrlParser: true,useUnifiedTopology: true})
    .then(function(){
        console.log('Connexion à MongoDB réussie !')
    })
    .catch(function(){
        console.log('Connexion à MongoDB échouée !')
    });

const app = express();

// Création d'un middleware Header pour contourner les erreurs CORS
app.use(
    function(req, res, next) {
        // On indique que les ressources peuvent être partagées depuis tous les orgines
        res.setHeader('Access-Control-Allow-Origin', '*');
        // On indique les entêtes qui seront utilisées après la pré-vérification cross-origin afin de donner l'autorisation
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
        // On indique les méthodes autorisées pour les requêtes HTTP
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        next();
    }
);

app.use(express.json()); // Transforme les données des requêtes en un objet JSON

// Ce Midleware permet de charger les fichiers qui sont dans le repertoire images et de gérer les ressources d'images de façon statique
app.use('/images', express.static(path.join(__dirname,'images')));

app.use('/api/sauces', sauceRoutes); // Gestion des routes dédiées aus sauces
app.use('/api/auth', userRoutes); // Gestion des routes dédiées aux utilisateurs

module.exports = app;