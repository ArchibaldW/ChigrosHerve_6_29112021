const jwt = require('jsonwebtoken');

require('dotenv').config();

// On vérifie si l'ID utilisateur dans la requête correspond bien à l'ID présent dans le token, si oui alors il est autorisé à continuer
// Ce middleware sera utilisé pour sécuriser toutes les routes de notre application
module.exports = function(req, res, next){
    try{
        const token = req.headers.authorization.split(' ')[1]; // On récupère le token dans les headers
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN); // On décripte le token pour avoir les informations que l'on veut
        const userId = decodedToken.userId; 
        req.userId = userId;
        if (req.body.userId && req.body.userId !== userId){ // On compare les deux userId
            throw "User Id non valable";
        } else{
            next();
        }
    } catch(error) {
        res.status(401).json({error: error | "Requête non authentifiée !"});
    } 
}