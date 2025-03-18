# JobTracker Backend

## Description
JobTracker est une application backend développée avec NestJS qui permet aux utilisateurs de suivre leurs candidatures et le processus de recherche d'emploi. L'application offre des fonctionnalités d'authentification sécurisée et de gestion des offres d'emploi.

## Technologies Utilisées
- [NestJS](https://nestjs.com/) - Framework Node.js pour la construction d'applications serveur
- [TypeORM](https://typeorm.io/) - ORM pour la gestion de la base de données
- [PostgreSQL](https://www.postgresql.org/) - Base de données relationnelle
- [Docker](https://www.docker.com/) - Conteneurisation
- [JWT](https://jwt.io/) - Authentification
- [Jest](https://jestjs.io/) - Tests unitaires et d'intégration

## Prérequis
- Docker (v20.10 ou supérieur)
- Docker Compose (v2.0 ou supérieur)

## Installation et Démarrage

1. Cloner le repository :
```bash
git clone https://github.com/votre-username/jobtracker-backend.git
cd jobtracker-backend
```

2. Configurer les variables d'environnement :
```bash
cp .env.example .env
```
Remplir les variables dans le fichier `.env` avec vos valeurs.

3. Construire et démarrer les conteneurs :
```bash
# Construire les images
docker compose build

# Démarrer les conteneurs en arrière-plan
docker compose up -d
```

4. Vérifier que les conteneurs sont en cours d'exécution :
```bash
docker compose ps
```

## Commandes Docker Utiles

### Gestion des Conteneurs
```bash
# Démarrer les conteneurs
docker compose up -d

# Arrêter les conteneurs
docker compose down

# Voir les logs
docker compose logs -f

# Reconstruire et redémarrer les conteneurs
docker compose up -d --build
```

### Exécution des Commandes dans le Conteneur
```bash
# Accéder au shell du conteneur
docker compose exec app sh

# Exécuter les tests
docker compose exec app npm run test

# Générer une migration
docker compose exec app npm run typeorm migration:generate -- -n NomDeLaMigration

# Exécuter les migrations
docker compose exec app npm run typeorm migration:run
```

## Structure du Projet
```
src/
├── auth/                 # Module d'authentification
├── users/               # Module de gestion des utilisateurs
├── jobs/                # Module de gestion des offres d'emploi
├── config/              # Configuration de l'application
└── main.ts             # Point d'entrée de l'application
```

## API Endpoints

### Authentification
- `POST /auth/register` - Inscription d'un nouvel utilisateur
- `POST /auth/login` - Connexion utilisateur

### Utilisateurs
- `GET /users/profile` - Récupérer le profil de l'utilisateur connecté

### Jobs
- `POST /jobs` - Créer une nouvelle offre d'emploi
- `GET /jobs` - Récupérer toutes les offres d'emploi
- `GET /jobs/:id` - Récupérer une offre d'emploi spécifique
- `PATCH /jobs/:id` - Mettre à jour une offre d'emploi
- `DELETE /jobs/:id` - Supprimer une offre d'emploi

## Tests
L'application utilise Jest pour les tests unitaires et d'intégration.

### Lancer les tests
```bash
# Lancer tous les tests
docker compose exec app npm run test

# Lancer les tests en mode watch
docker compose exec app npm run test:watch

# Lancer les tests avec couverture
docker compose exec app npm run test:cov
```

## Base de Données
La base de données PostgreSQL est gérée via Docker. Les migrations sont gérées avec TypeORM.

### Migrations
```bash
# Générer une migration
docker compose exec app npm run typeorm migration:generate -- -n NomDeLaMigration

# Exécuter les migrations
docker compose exec app npm run typeorm migration:run

# Annuler la dernière migration
docker compose exec app npm run typeorm migration:revert
```

## Sécurité
- Authentification JWT
- Hachage des mots de passe avec bcrypt
- Validation des données avec class-validator
- Protection des routes avec Guards

## Contribution
1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Licence
Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Contact
Votre Nom - [@votre_twitter](https://twitter.com/votre_twitter) - email@example.com

Lien du projet : [https://github.com/votre-username/jobtracker-backend](https://github.com/votre-username/jobtracker-backend)
