
# Gestion de Facturation - Backend

Bienvenue dans le projet backend pour la gestion de facturation. Ce fichier README fournit une documentation complète sur la mise en place et l'utilisation du backend pour ce projet. Le backend est développé en **Node.js** avec **Express.js**, et il utilise **Prisma** pour la gestion de la base de données.

## 📋 Table des Matières
1. [Description](#description)
2. [Fonctionnalités](#fonctionnalités)
3. [Technologies Utilisées](#technologies-utilisées)
4. [Prérequis](#prérequis)
5. [Installation](#installation)
6. [Connexion avec le Frontend](#connexion-avec-le-frontend)
7. [Exemple de Routes](#exemple-de-routes)
8. [Auteur](#auteur)

---

## 📄 Description

**Gestion de Facturation - Backend** est une application serveur qui permet de gérer les opérations de facturation, les paiements, les clients, les utilisateurs, et les modes de paiement pour les petites et moyennes entreprises (PME). Ce backend fournit une API REST sécurisée et optimisée pour interagir avec le frontend.

---

## 🚀 Fonctionnalités

- **Gestion des Factures** : Création, mise à jour, suppression et récupération de factures.
- **Gestion des Paiements** : Enregistrement et suivi des paiements partiels ou complets.
- **Gestion des Clients** : Ajout, modification et suppression des clients.
- **Gestion des Utilisateurs** : Gestion des rôles et des utilisateurs de l'application.
- **Gestion des Modes de Paiement** : Configuration et mise à jour des différents modes de paiement.
- **Authentification** : Connexion sécurisée avec JSON Web Tokens (JWT).
- **Réinitialisation de Mot de Passe** : Fonctionnalité complète pour la réinitialisation des mots de passe via email.

---

## 🛠️ Technologies Utilisées

- **[Node.js](https://nodejs.org/)** - Plateforme côté serveur (v18.x ou ultérieure)
- **[Express.js](https://expressjs.com/)** - Framework pour la création d'API REST (v4.x)
- **[Prisma](https://www.prisma.io/)** - ORM pour la gestion des bases de données (v4.x)
- **[PostgreSQL](https://www.postgresql.org/)** - Base de données relationnelle
- **[JSON Web Token (JWT)](https://jwt.io/)** - Authentification sécurisée
- **[Nodemailer](https://nodemailer.com/)** - Service d'envoi d'emails

---

## ✅ Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :
- [Node.js](https://nodejs.org/) (v14.x ou ultérieure)
- [PostgreSQL](https://www.postgresql.org/) (v12.x ou ultérieure)
- Un gestionnaire de packages comme **npm** ou **yarn**

---

## ⚙️ Installation

1. **Clonez le dépôt**

   ```bash
   git clone https://github.com/Fatoumacisse99/Gestion-Facturation.git
   ```

2. **Accédez au répertoire du projet**

   ```bash
   cd Gestion-Facturation
   ```

3. **Installez les dépendances**

   ```bash
   npm install
   ```

4. **Configurez les variables d'environnement**

   Créez un fichier `.env` à la racine du projet et ajoutez-y les variables suivantes :

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/gestion_facturation"
   JWT_SECRET=your_secret_key_here
   EMAIL_SERVICE=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_email_password
   ```

5. **Mettez à jour la base de données**

   Exécutez la commande suivante pour synchroniser le schéma Prisma avec votre base de données :

   ```bash
   npx prisma migrate dev
   ```

6. **Démarrez le serveur**

   ```bash
   npm start
   ```

   Le serveur sera accessible à l'adresse suivante : `http://localhost:4000`.

---

## 🌐 Connexion avec le Frontend

Le backend est configuré pour interagir avec le frontend via les routes et l'URL de base suivante :

### URL de Base
```
http://localhost:4000
```

---

## 🔗 Exemple de Routes

| Méthode | Endpoint                | Description                                  |
|---------|-------------------------|----------------------------------------------|
| GET     | `/api/factures`         | Récupère toutes les factures.               |
| POST    | `/api/factures`         | Crée une nouvelle facture.                  |
| PUT     | `/api/factures/:id`     | Met à jour une facture existante.           |
| DELETE  | `/api/factures/:id`     | Supprime une facture par ID.                |
| GET     | `/api/paiements`        | Récupère tous les paiements.                |
| POST    | `/api/paiements`        | Enregistre un nouveau paiement.             |
| GET     | `/api/users`            | Récupère tous les utilisateurs.             |
| POST    | `/api/users`            | Crée un nouvel utilisateur.                 |
| GET     | `/auth/login`           | Authentifie un utilisateur.                 |
| POST    | `/auth/request-password-reset` | Demande de réinitialisation de mot de passe. |
| POST    | `/auth/reset-password`  | Réinitialise le mot de passe d'un utilisateur. |

---
## 📋 Documentation API

Pour faciliter l'utilisation des endpoints de l'API, une collection Postman est incluse dans le projet. Cette collection comprend tous les endpoints nécessaires pour tester et interagir avec l'API backend.

### 📋 Importer la Collection dans Postman
1. Téléchargez le fichier **Gestion-Facturations.postman_collection.json** depuis le dossier racine du projet.
2. Ouvrez Postman.
3. Cliquez sur le bouton **Importer** dans l'interface de Postman.
4. Sélectionnez le fichier **Gestion-Facturations.postman_collection.json** que vous avez téléchargé.
5. Cliquez sur **Importer** pour ajouter la collection à votre espace de travail.
6. Explorez les endpoints et testez les différentes fonctionnalités de l'API.

## ✍️ Auteur

Développé par **Fatoumacisse99**.  
GitHub : [Fatoumacisse99](https://github.com/Fatoumacisse99)
