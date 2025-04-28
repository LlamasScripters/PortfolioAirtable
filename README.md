# Portfolio LlamasScripters

Ce projet est un portfolio permettant de présenter les projets du groupe LlamasScripters. Il comprend une interface publique de consultation et une interface d'administration.

## Membres du groupe

- [Sami ASSIAKH] - [@iSaaMz](https://github.com/iSaaMz)
- [Moustapha CHEGDALI] - [@mchegdali](https://github.com/mchegdali)
- [Aria AMAN] - [@AriaAman](https://github.com/AriaAman)
- [Moussa Seydou TRAORE] - [@MoussaST](https://github.com/MoussaST)


## Technologies utilisées

### Frontend
- **Nuxt.js 3** - Framework Vue.js pour le développement d'applications web
- **Tailwind CSS** - Framework CSS utilitaire

### Backend
- **Nuxt Server API** - API côté serveur intégrée à Nuxt
- **Airtable** - Base de données en tant que service
- **bcrypt** - Bibliothèque pour le hashage de mots de passe

### Autres
- **ESLint** - Linter pour JavaScript
- **Axios** - Client HTTP

## Prérequis

- Node.js
- npm
- Un compte Airtable

## Installation

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/LlamasScripters/PortfolioAirtable.git
   cd PortfolioAirtable
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

3. A partir du fichier `.env.example`, créer un fichier `.env` à la racine du projet avec les variables suivantes :
   ```
   # Airtable
   AIRTABLE_API_KEY=

   # Secret JWT
   JWT_SECRET=
   
   # Configuration application
   API_BASE_URL=http://localhost:3000
   ```

## Lancement du projet

### Développement

Pour lancer le serveur de développement :

```bash
npm run dev
```

L'application sera accessible à l'adresse : http://localhost:3000

### Production

Pour construire l'application pour la production :

```bash
npm run build
```

Pour lancer l'application en mode production :

```bash
npm run start
```

## Structure Airtable

Le projet est structuré sous une base Airtable avec les tables suivantes :

### Table `Projet`
- `Nom` (Texte) - Nom du projet
- `Description` (Texte long) - Description détaillée
- `Lien Projet` (URL) - Lien vers le projet en ligne
- `Etudiant` (Lien vers Utilisateur) - Étudiants associés
- `Technologies` (Lien vers Technologie) - Technologies utilisées
- `Promotion` (Lien vers Promotion) - Promotion associée
- `Nombre de like` (Nombre) - Nombre de likes
- `Catégories` (Sélection multiple) - Catégories du projet
- `Visuels` (Pièces jointes) - Images du projet
- `IsProjetVisible` (Sélection simple) - True/False
- `CommentairesProjets`(Lien vers CommentairesProjet) - Commentaires des projets

### Table `Utilisateur`
- `Nom` (Texte)
- `Prenom` (Texte)
- `Email` (Email)
- `Photo` (Pièce jointe)
- `Password` (Texte) - Mot de passe hashé
- `Rôle` (Sélection multiple) - Administrateur/Etudiant

### Table `Technologie`
- `Nom` (Texte) - Nom de la technologie
- `Icône` (Pièce jointe) - Icône de la technologie
- `Projet` (Lien vers Projet) - Lien vers le projet en ligne 

### Table `Promotion`
- `Ǹom` (Formule) - Nom de la promotion
- `Année` (Séléction unique) - Nom de l'année
- `Ecole` (Sélection unique) - Nom de l'école
- `Filiere` (Formule) - Nom de la promotion
- `Promo` (Sélection multiple) - Nom de la promotion
- `Projet` (Lien vers Projet) - Lien vers le projet en ligne

## Fonctionnalités principales

### Interface publique
- Visualisation de tous les projets publiés
- Détail d'un projet avec informations associées
- Possibilité de liker un projet
- Recherche par mots-clés

### Interface d'administration
- Authentification sécurisée
- Tableau de bord avec statistiques
- Gestion des projets (création, modification, visibilité)
- Ajout de commentaires sur les projets
- Recherche et filtrage


## Accès aux projets

Les projets seront affichés à l'adresse : 
```
http://localhost:3000/projects
```

## Accès à l'interface d'administration

Après avoir lancé l'application, l'interface d'administration est accessible à l'adresse :
```
http://localhost:3000/admin
```
