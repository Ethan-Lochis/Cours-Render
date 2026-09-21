const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Configuration du moteur de template Twig
app.set('view engine', 'twig');
app.set('views', path.join(__dirname, 'views'));
// Optionnel pour le dev : désactiver le cache en local
if (process.env.NODE_ENV !== 'production') {
  app.set('twig options', {
    allow_async: true,
    strict_variables: false,
    cache: false,
  });
}

// Fichiers statiques (CSS, JS client, images)
app.use(express.static(path.join(__dirname, 'public')));

// Route principale : affichage de la page de chat
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Chat Minimaliste - Temps Réel',
    appName: 'InstantChat',
  });
});

// Suivi du nombre d'utilisateurs connectés
let connectedUsersCount = 0;

// Gestion des connexions Socket.IO
io.on('connection', (socket) => {
  connectedUsersCount++;
  io.emit('users:count', connectedUsersCount);

  // Enregistrement du pseudonyme
  socket.on('user:join', (username) => {
    const cleanUsername = (username && username.trim()) || 'Anonyme';
    socket.username = cleanUsername;

    // Notifier tous les utilisateurs de l'arrivée du nouvel utilisateur
    io.emit('system:notification', {
      type: 'join',
      text: `${cleanUsername} a rejoint le chat`,
      timestamp: new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
  });

  // Réception et diffusion des messages de chat
  socket.on('chat:message', (data) => {
    if (!data || !data.text || !data.text.trim()) return;

    const messageData = {
      id: Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      username: socket.username || 'Anonyme',
      text: data.text.trim(),
      timestamp: new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      senderId: socket.id,
    };

    // Diffuser à tout le monde (les clients distingueront si c'est leur propre message via senderId)
    io.emit('chat:message', messageData);
  });

  // Déconnexion
  socket.on('disconnect', () => {
    connectedUsersCount = Math.max(0, connectedUsersCount - 1);
    io.emit('users:count', connectedUsersCount);

    if (socket.username) {
      io.emit('system:notification', {
        type: 'leave',
        text: `${socket.username} a quitté le chat`,
        timestamp: new Date().toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
    }
  });
});

// Port dynamique pour compatibilité Render
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`🚀 Serveur de chat démarré sur http://localhost:${PORT}`);
  console.log(`📡 Prêt pour le déploiement sur Render (Port: ${PORT})`);
});
