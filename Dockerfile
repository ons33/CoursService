# Utilise l'image officielle de Node.js 18 comme base
FROM node:16

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Installe nodemon globalement
RUN npm install -g nodemon

# Copie les fichiers de dépendances et installe les dépendances
COPY package*.json ./
RUN npm install

# Copie le reste du code source de l'application dans le conteneur
COPY . .

# Expose le port sur lequel ton application s'exécutera dans le conteneur
EXPOSE 3007

# Commande pour démarrer ton application avec nodemon
CMD ["nodemon", "server.js"]
