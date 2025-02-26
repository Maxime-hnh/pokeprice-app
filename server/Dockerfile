# Utilise l'image officielle Node.js
FROM node:18-alpine

# Définit le répertoire de travail
WORKDIR /pokeprice-app

# Copie les fichiers package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie tout le reste des fichiers du projet
COPY . .

# Génère le client Prisma
RUN npx prisma generate

# Compile le projet si TypeScript est utilisé
RUN npm run build

# Expose le port sur lequel NestJS écoute (ex: 3000)
EXPOSE 3001

# Commande de démarrage
CMD ["npm", "run", "start:prod"]
