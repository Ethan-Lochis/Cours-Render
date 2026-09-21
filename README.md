# 💬 InstantChat - Version 1 (Chat Minimaliste)

Projet d'apprentissage : Maîtrise des bases de **Node.js**, **Express**, **Twig** et **Socket.IO** avec déploiement continu (**CI/CD**) sur **Render**.

---

## 🎯 Objectifs de la Version 1

- Développer un serveur HTTP minimaliste avec Express en **CommonJS** (`require` / `module.exports`).
- Mettre en place un moteur de rendu côté serveur avec **Twig.js**.
- Gérer la communication bidirectionnelle en temps réel grâce à **Socket.IO**.
- Gérer les pseudos via un `prompt()` au démarrage.
- Messages éphémères en mémoire (sans base de données pour cette version).
- Préparer le code pour un déploiement continu automatisé sur **Render**.

---

## 📁 Structure du Projet

```text
Render/
├── public/
│   ├── css/
│   │   └── style.css       # Styles CSS modernes (dark mode, glassmorphism)
│   └── js/
│       └── chat.js         # Client Socket.IO, gestion du prompt et du DOM
├── views/
│   └── index.twig          # Template Twig de la vue principale du chat
├── .gitignore              # Exclusion de node_modules/ et fichiers temporaires
├── package.json            # Dépendances et scripts (start, dev)
├── README.md               # Guide d'installation et de déploiement
└── server.js               # Point d'entrée serveur Express & Socket.IO
```

---

## 🚀 Lancement en Local

### 1. Installation des dépendances

```bash
npm install
```

### 2. Démarrage de l'application

En mode développement (avec redémarrage automatique grâce à `nodemon`) :
```bash
npm run dev
```

Ou en mode standard :
```bash
npm start
```

Ouvrez ensuite votre navigateur sur [http://localhost:3000](http://localhost:3000). Ouvrez un second onglet pour tester la discussion en direct !

---

## 🌐 Déploiement Continu (CI/CD) sur Render

### Étape 1 : Initialiser le dépôt Git local

Si ce n'est pas déjà fait :
```bash
git init
git add .
git commit -m "feat: Version 1 chat minimaliste avec Node, Express, Twig et Socket.IO"
```

### Étape 2 : Publier sur GitHub

1. Créez un nouveau dépôt sur [GitHub](https://github.com/new).
2. Liez votre dépôt local au dépôt distant :
   ```bash
   git remote add origin https://github.com/<votre-nom-utilisateur>/<nom-du-repo>.git
   git branch -M main
   git push -u origin main
   ```

### Étape 3 : Configurer le Web Service sur Render

1. Rendez-vous sur le dashboard [Render](https://dashboard.render.com/) et connectez-vous.
2. Cliquez sur **New +** > **Web Service**.
3. Liez votre compte GitHub et sélectionnez votre dépôt.
4. Renseignez la configuration suivante :
   - **Name** : `instant-chat` (ou le nom de votre choix)
   - **Environment** : `Node`
   - **Region** : Frankfurt (EU Central) ou Oregon (US West)
   - **Branch** : `main`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
5. Cliquez sur **Create Web Service**.

> Render va automatiquement installer les dépendances, lancer le serveur et lui attribuer une URL sécurisée en HTTPS/WSS avec CI/CD activé : à chaque `git push`, le service sera redéployé automatiquement !
