module.exports = function(req, res, next){
    /*  Cette regex a été créée pour satisfaire plusieurs conditions spécifiques :
        *   - Au minimum une lettre majuscule non accentuée
        *   - Au minimum une lettre minuscule non accentuée
        *   - Au minimum un chiffre
        *   - Au minimum un caractère spécial
        *   - Pas de caractère espace
        *   - Entre 10 et 64 caractères
        */
    let emailRegexp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])[^ ]{10,64}$/;
    if (emailRegexp.test(req.body.password)){
        next();
    } else {
        res.status(400).json({ message: 'mot de passe non valide' });
    } 
};