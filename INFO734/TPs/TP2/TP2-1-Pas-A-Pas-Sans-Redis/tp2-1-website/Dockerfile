# On récupère la dernière image node
FROM node:latest

# On fait ça pour pouvoir donner une valeur à la variable d'environnement BACKEND_URL lors de la création de l'image
ARG BACKEND_URL=""
ENV BACKEND_URL=$BACKEND_URL

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copie le fichier package.json et package-lock.json
COPY package*.json ./

# Installe les packages
RUN npm install

# Copie tous les fichiers
COPY . .

# Construit le projet
RUN npx next build --profile

# Expose le port par défaut
EXPOSE 8080

# Lance le site web
CMD npx next start -p 8080