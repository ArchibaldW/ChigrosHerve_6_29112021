module.exports = function(req, res, next){
    /*  Cette regex a été créée pour satisfaire plusieurs conditions spécifiques :
        *   - Les seuls caractères autorisés sont les lettres de a à z sans accents ni cédilles, les chiffres, les tirets et les points
        *   - Le prefixe de l'adresse ne commence ni par un numero, ni par un point, ni par un tiret et ne termine ni par un point ni par un tiret
        *   - La partie entre l'arobase et le point du nom de domaine ne commence ni par un point ni par un tiret et ne termine ni par un point ni par un tiret
        *   - L'adresse mail ne peut pas conteni deux caractère spéciaux consécutifs (par exemple ".-" ou "..")
        *   - Le nom de domaine est constitué de 2 à 4 caractère alphanumeriques
        */
    let emailRegexp = /^[a-z]([.-]{0,1}[a-z0-9]+)*@[a-z0-9]([.-]{0,1}[a-z0-9]+)*\.[a-z0-9]{2,4}$/i;
    if (emailRegexp.test(req.body.email)){
        next();
    } else {
        res.status(400).json({ message: 'mail non valide' });
    } 
};