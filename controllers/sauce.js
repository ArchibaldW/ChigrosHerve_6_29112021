// Controller où se trouve la logique métier liée à la gestion des sauces

// On importe le model Sauce avec le schema mongoose pour traiter les données des sauces
const Sauce = require('../models/sauce');

// On importe le module "file system" pour gérer les téléchargements, modification et suppression d'images
const fs = require('fs');

// Middleware qui gère la récupération de toutes les sauces depuis la bdd
exports.findSauces = function(req, res, next) {
    // On cherche toutes les sauces dans la bdd
    Sauce.find()
        .then(function(sauces){
            res.status(200).json(sauces);
        })
        .catch(function(error){
            res.status(400).json({error});
        });
};

// Middleware qui gère la récupération d'une sauce depuis la bdd
exports.findOneSauce = function(req, res, next) {
    // On cherche la sauce avec l'id présent dans la requête dans la bdd
    Sauce.findOne({_id : req.params.id})
        .then(function(sauce){
            res.status(200).json(sauce);
        })
        .catch(function(error){
            res.status(404).json({error});
        });
};

// Middleware qui gère la création d'une nouvelle sauce et sa sauvegarde en bdd
exports.createSauce = function(req, res, next) {
    // On transforme les données du corps de la requête en objet Sauce utilisable
    const sauceObjet = JSON.parse(req.body.sauce);
    // On supprime l'id généré automatiquement par la requête, MongoDB se chargera lui même de la création de l'id
    delete sauceObjet._id;
    // Création d'un nouvel objet Sauce et initialisation des likes/dislikes et des tableaux usersLiked/usersDisliked
    const sauce = new Sauce({
        ...sauceObjet,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Modification de l'url de l'image
    });
    // Sauvegarde de la nouvelle sauce dans la bdd
    sauce.save()
        .then(function(){
            res.status(201).json({ message : 'Sauce enregistrée'})
        })
        .catch(function(error){
            res.status(400).json({ error })
        });
}

// Middleware qui gère la modification d'une sauce avec un id donné et sa sauvegarde en bdd
exports.modifySauce = function(req, res, next) {
    // On cherche la sauce avec l'id présent dans la requête dans la bdd pour supprimer l'ancien fichier si il y a lieu d'être
    Sauce.findOne({_id: req.params.id })
        .then(function(sauce){
            // Si il y a un nouveau fichier dans la requête, on supprime l'ancien fichier attaché à cette sauce
            if (req.file){
                const filename = sauce.imageUrl.split('/images')[1];
                fs.unlink(`images/${filename}`, function(){
                    return;
                })
            }
            // Si il y a un nouveau fichier dans la requête, alors on charge les données et on change l'imageURL, 
            // Sinon on charge les données normalement
            const sauceObjet = req.file ? 
            {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            } : { ...req.body };
            // On modifie les données de la sauce avec l'id donné dans la bdd avec les nouvelles données
            Sauce.updateOne({_id : req.params.id},{...sauceObjet, _id : req.params.id})
                .then(function(){
                    res.status(200).json({ message : "Sauce modifiée !"});
                })
                .catch(function(error){
                    res.status(404).json({error});
                });
        })
        .catch(function(error){
            res.status(400).json({ message: 'Sauce non trouvée' })
        })
    
};

// Middleware qui gère la suppression d'une sauce avec un id donné de la bdd
exports.deleteSauce = function(req, res, next) {
    // On cherche la sauce avec l'id présent dans la requête dans la bdd pour supprimer l'ancien fichier
    Sauce.findOne({ _id: req.params.id })
        .then(function(sauce){
            // On récupère l'url de l'image de la sauce et on split pour avoir uniquement le nom du fichier
            const filename = sauce.imageUrl.split('/images')[1];
            // Avec ce nom de fichier on peut supprimer l'image avec unlink
            fs.unlink(`images/${filename}`, function(){
                // Une fois le fichier supprimé, on peut supprimer la sauce de la bdd
                Sauce.deleteOne({ _id: req.params.id })
                .then(function() {
                    res.status(200).json({ message: 'Objet supprimé !'})
                })
                .catch(function(error){
                    res.status(400).json({ error })
                });
            })
        })
        .catch(function(error){
            res.status(500).json({ error })
        })
};

// Middleware qui gère les like et les dislike d'une sauce
exports.likeDislikeSauce = function(req, res, next) {
    // On récupère les informations depuis la requête ou les paramêtres
    let like = req.body.like;
    let userId = req.body.userId; 
    let sauceId = req.params.id; 
    // On cherche la sauce avec le sauceId depuis la baes de donnée
    Sauce.findOne({_id : sauceId})
        .then(function(sauce){
            // 3 cas possible :
            switch (like){
                // like = 1, l'utilisateur a liké cette sauce 
                case 1 : 
                    // Si l'userId est déjà dans le tableau usersLiked, alors on retourne une erreur
                    if(sauce.usersLiked.includes(userId)){
                        res.status(400).json({ message: 'Impossible de faire cette action' });
                        return;
                    }
                    // On modifie la sauce avec le sauceId en base de donnée en incrémentant likes de 1 et en l'ajoutant au tableau usersLiked
                    Sauce.updateOne({ _id: sauceId },{ $push: { usersLiked: userId }, $inc: { likes: +1 }})
                        .then(function(){
                            res.status(200).json({ message: `J'aime` })
                        })
                        .catch(function(error){
                            res.status(400).json({ error })
                        });
                    break;
                // like = 0, l'utilisateur annule son like ou son dislike
                case 0 :
                    // Si l'userID est dans le tableau usersLiked, il annule un like
                    // On décrémente likes de 1 et on le retire du tableau usersLiked
                    if (sauce.usersLiked.includes(userId)) {
                        Sauce.updateOne({ _id: sauceId },{ $pull: { usersLiked: userId }, $inc: { likes: -1 } } )
                            .then(function(){
                                res.status(200).json({ message: `Neutre` })
                            })
                            .catch(function(error){
                                res.status(400).json({ error })
                            });
                      }
                      // Si l'userID est dans le tableau usersLiked, il annule un dislike
                      // On décrémente dislikes de 1 et on le retire du tableau usersDisiked
                      if (sauce.usersDisliked.includes(userId)) {
                        Sauce.updateOne({ _id: sauceId },{ $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } })
                            .then(function(){
                                res.status(200).json({ message: `Neutre` })
                            })
                            .catch(function(error){
                                res.status(400).json({ error })
                            });
                      }
                    break;
                // like = -1, l'utilisateur a disliké cette sauce 
                case -1 :
                    // Si l'userId est déjà dans le tableau usersDisiked, alors on retourne une erreur
                    if (sauce.usersDisliked.includes(req.userId)) {
                        res.status(400).json({ message: 'Impossible de faire cette action' });
                        return;
                    }
                    // On modifie la sauce avec le sauceId en base de donnée en incrémentant dislikes de 1 et en l'ajoutant au tableau usersDisliked
                    Sauce.updateOne({ _id: sauceId },{ $push: { usersDisliked: userId }, $inc: { dislikes: +1 } })
                        .then(function(){
                            res.status(200).json({ message: `Je n'aime pas` });
                        })
                        .catch(function(error){
                            res.status(400).json({ error })
                        });
                    break;
                default:
                    console.log(error);
            }
        })
        .catch(function(error){
            res.status(404).json({error});
        });
};