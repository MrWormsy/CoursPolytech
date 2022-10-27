# On récupère une image node à sa dernière version
FROM node:latest

# Définir le répertoire de travail
WORKDIR /usr/src/app

# On copie le package.json et le package-lock.json
COPY package*.json ./

# On installe les dépendances
RUN npm install

# On copie les fichiers
COPY . .

# On expose le port 80
EXPOSE 80

# Quand un container sera démarré à partir de cette image, c'est cette commande qui sera exécutée
CMD npm start