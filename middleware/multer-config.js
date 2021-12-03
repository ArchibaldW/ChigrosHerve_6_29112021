// multer va nous permettre de gérer au mieux les fichiers entrants via les requêtes HTTP
const multer = require('multer');

// Tableau de correspondance pour retrouver facilement l'extension de fichier à partir du mimetype
const MIME_TYPES = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/png' : 'png'
}

// On dit à multer où sauvegarder les fichiers images qu'on lui donne et comment les renommer
const storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, 'images');
    },
    filename : function(req, file, callback){
        const firstName = file.originalname.split(' ').join('_'); // On supprime les espaces pour les remplacer pour des _ dans le nom originel
        const extension = MIME_TYPES[file.mimetype]; // On récupère l'extension du fichier
        const name = firstName.split('.'+extension)[0]; // On enlève l'extension originelle du fichier pour éviter les "image.pngTIMESTAMP.png"
        callback(null, name + Date.now() + '.' + extension); // On renomme le fichier "nameTIMESTAMP.extension" pour qu'il soit unique
    }
})

module.exports = multer ({storage}).single('image');