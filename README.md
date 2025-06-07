# Calendrier du ménage de la cuisine

Cette application web gère la répartition des tâches de ménage dans la cuisine. Elle fonctionne entièrement côté client : ouvrez simplement `index.html` dans un navigateur moderne pour générer et imprimer un calendrier personnalisé.

## Fonctionnalités principales

- Génération dynamique d'un calendrier mensuel
- Attribution manuelle ou automatique des chambres (de **1** à **54** sauf la chambre **13**)
- Mode administrateur protégé par mot de passe pour modifier le planning
- Exclusion de chambres et démarrage de l'attribution à une date précise
- Effacement rapide du calendrier et thème sombre pour le confort visuel
- Impression directe depuis le navigateur

## Installation

Aucune installation spécifique n'est requise. Clonez le dépôt puis ouvrez le fichier `index.html` avec votre navigateur préféré. Vous pouvez également servir le dossier via un petit serveur HTTP si vous souhaitez y accéder depuis d'autres machines :

```bash
npx serve .
```

## Utilisation rapide

1. Sélectionnez le mois et l'année souhaités, le calendrier se met à jour instantanément.
2. Activez le **mode administrateur** via le bouton *Admin* et entrez le mot de passe par défaut `s00r1`.
3. Renseignez les numéros de chambre pour chaque date ou utilisez l'attribution automatique.
4. Cliquez sur **Imprimer** pour générer une version papier du planning.

### Attribution automatique

Dans la section administrateur, indiquez la **chambre de départ** ainsi que la **date de début**. Appuyez sur le bouton **Auto** pour préremplir le calendrier en tenant compte des éventuelles chambres exclues.

### Exclure des chambres

Saisissez les numéros à ignorer dans le champ d'exclusion puis validez pour retirer ces chambres de la planification automatique.

### Nettoyer le calendrier

Le bouton **Clear** efface rapidement toutes les valeurs saisies et permet de repartir sur une grille vierge.

### Thème sombre

Activez le bouton **Thème** pour basculer entre un affichage clair et sombre selon vos préférences.

## Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir des issues ou des pull requests pour proposer des améliorations.

## Licence

Ce projet est distribué sous la licence [MIT](LICENSE).
