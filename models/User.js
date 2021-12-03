const mongoose = require('mongoose');

// Le mail se doit d'être unique, ce package assurera l'unicité du mail rentré par l'utilisateur
const uniqueValidator = require('mongoose-unique-validator');

// Création du Schema mongoose pour les données relative aux utilisateurs
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);