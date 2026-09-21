document.addEventListener('DOMContentLoaded', () => {
  // 1. Demande du pseudonyme à l'utilisateur (requis par la consigne)
  let username = prompt('Entrez votre pseudo pour le chat :');
  if (!username || !username.trim()) {
    username = 'Utilisateur_' + Math.floor(1000 + Math.random() * 9000);
  } else {
    username = username.trim();
  }

  // Éléments DOM
  const currentUsernameEl = document.getElementById('current-username');
  const userChipEl = document.getElementById('user-chip');
  const messagesContainer = document.getElementById('messages-container');
  const messagesList = document.getElementById('messages-list');
  const chatForm = document.getElementById('chat-form');
  const messageInput = document.getElementById('message-input');
  const connectionStatusEl = document.getElementById('connection-status');
  const usersCountEl = document.getElementById('users-count');
  const statusIndicator = document.querySelector('.status-indicator');

  // Mettre à jour l'affichage du pseudo
  currentUsernameEl.textContent = username;

  // Possibilité de changer de pseudo en cliquant sur le badge
  userChipEl.addEventListener('click', () => {
    const newUsername = prompt('Modifier votre pseudo :', username);
    if (newUsername && newUsername.trim() && newUsername.trim() !== username) {
      username = newUsername.trim();
      currentUsernameEl.textContent = username;
      socket.emit('user:join', username);
    }
  });

  // 2. Connexion au serveur Socket.IO
  const socket = io();

  // Événement : Connexion établie
  socket.on('connect', () => {
    connectionStatusEl.textContent = 'Connecté';
    statusIndicator.classList.remove('offline');

    // Annoncer l'arrivée avec le pseudo choisi
    socket.emit('user:join', username);
  });

  // Événement : Déconnexion
  socket.on('disconnect', () => {
    connectionStatusEl.textContent = 'Déconnecté';
    statusIndicator.classList.add('offline');
  });

  // Événement : Mise à jour du nombre d'utilisateurs connectés
  socket.on('users:count', (count) => {
    usersCountEl.textContent = count;
  });

  // Événement : Notification système (arrivée / départ)
  socket.on('system:notification', (data) => {
    appendSystemNotification(data);
    scrollToBottom();
  });

  // Événement : Nouveau message reçu
  socket.on('chat:message', (data) => {
    appendChatMessage(data);
    scrollToBottom();
  });

  // 3. Envoi d'un message via le formulaire
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const text = messageInput.value.trim();
    if (!text) return;

    // Émettre l'événement chat:message vers le serveur
    socket.emit('chat:message', { text });

    // Réinitialiser le champ de saisie
    messageInput.value = '';
    messageInput.focus();
  });

  // Fonction pour injecter une notification système dans le DOM
  function appendSystemNotification(data) {
    const notificationDiv = document.createElement('div');
    notificationDiv.className = `system-notification ${data.type}`;

    const dot = document.createElement('span');
    dot.className = 'dot';

    const textSpan = document.createElement('span');
    textSpan.textContent = data.text;

    const timeSpan = document.createElement('span');
    timeSpan.style.fontSize = '0.7rem';
    timeSpan.style.opacity = '0.6';
    timeSpan.textContent = `(${data.timestamp})`;

    notificationDiv.appendChild(dot);
    notificationDiv.appendChild(textSpan);
    notificationDiv.appendChild(timeSpan);

    messagesList.appendChild(notificationDiv);
  }

  // Fonction pour injecter un message dans le DOM
  function appendChatMessage(data) {
    const isSelf = data.senderId === socket.id;

    const row = document.createElement('div');
    row.className = `message-row ${isSelf ? 'sent' : 'received'}`;

    // Meta (Auteur + Heure)
    const meta = document.createElement('div');
    meta.className = 'message-meta';

    const author = document.createElement('span');
    author.className = 'message-author';
    author.textContent = isSelf ? 'Moi' : data.username;

    const time = document.createElement('span');
    time.className = 'message-time';
    time.textContent = data.timestamp;

    meta.appendChild(author);
    meta.appendChild(time);

    // Bulle de contenu
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = data.text; // Utilisation de textContent pour éviter les injections XSS

    row.appendChild(meta);
    row.appendChild(bubble);

    messagesList.appendChild(row);
  }

  // Défilement automatique vers le bas
  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
});
