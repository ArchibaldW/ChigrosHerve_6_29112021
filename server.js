// On écoute les requetes http et les responses

const http = require('http'); // Importation du package http
const app = require('./app'); // On importe app pour utilisation de l'application sur le serveur

// Renvoie un port valide avec la fonction normalizePort
function normalizePort(val){
    const port = parseInt(val, 10);

    if (isNaN(port)) {
      return val;
    }

    if (port >= 0) {
      return port;
    }

    return false;
};

// Si aucun port n'est fourni on écoutera sur le port 3000
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// la fonction errorHandler capte les différentes erreurs et les enregistre dans le serveur
function errorHandler(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
    
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;

    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
      default:
        throw error;
    }
};

// création d'une constante pour les appels serveur (requetes et reponses)
const server = http.createServer(app);

// Lance le serveur et affiche sur quel port se connecter ou gère les erreurs s'il y en a
server.on('error', errorHandler);
server.on('listening', function() {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

// Le serveur écoute le port définit plus haut
server.listen(port);