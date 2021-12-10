// On importe le module "file system" pour gérer les téléchargements, modification et suppression d'images
const fs = require('fs');

module.exports = (req, res, next) => {
    // Si on importe un fichier, on vérifie bien que c'est une image avant de la mettre en base, sinon on continue sur notre lancée
    if (req.file){
        // Si le fichier n'est pas une image, on renvoie une erreur et on supprime le fichier qui vient d'être créé par multer, sinon on continue
        if (req.file.mimetype !== "image/jpeg" && req.file.mimetype !== "image/jpg" && req.file.mimetype !== "image/png"){
            fs.unlink(`images/${req.file.filename}`, function(){
                return;
            })
            res.status(400).json({ message: 'Le fichier doit être une image' });
        } else {
            next();
        }
    } else {
        next();
    }
};