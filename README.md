# Calendrier du ménage de la cuisine

Cette application web gère la répartition des tâches de ménage dans la cuisine. Elle fonctionne entièrement côté client : ouvrez simplement `index.html` dans un navigateur moderne pour générer et imprimer un calendrier personnalisé.

## Fonctionnalités principales

- Génération dynamique d'un calendrier mensuel
- Attribution manuelle ou automatique des chambres (de **1** à **54** sauf la chambre **13**)
- Mode administrateur protégé par mot de passe pour modifier le planning
- Exclusion de chambres et démarrage de l'attribution à une date précise
- Effacement rapide du calendrier et thème sombre pour le confort visuel
- Impression directe depuis le navigateur
- Les éléments de l'interface administrateur sont automatiquement masqués lors
  de l'impression
- Interface bilingue (français/العربية) avec changement instantané via le bouton AR/FR
- Sauvegarde en ligne des affectations grâce à JSONBin (modifiez `BIN_URL` dans `calendar.js` et fournissez votre clé API via `localStorage` ou un `<script data-api-key>`)

## Installation

Aucune installation spécifique n'est requise. Clonez le dépôt puis ouvrez le fichier `index.html` avec votre navigateur préféré. Vous pouvez également servir le dossier via un petit serveur HTTP si vous souhaitez y accéder depuis d'autres machines :

```bash
npx serve .
```

Si vous souhaitez conserver les affectations, modifiez `BIN_URL` dans `calendar.js` et renseignez votre clé API dans `localStorage` (clé `jsonbin_api_key`) ou via un `<script data-api-key>`.

## Utilisation rapide

1. Sélectionnez le mois et l'année souhaités, le calendrier se met à jour instantanément.
2. Activez le **mode administrateur** via le bouton *Admin* et entrez le mot de passe par défaut `s00r1`.
3. Renseignez les numéros de chambre pour chaque date ou utilisez l'attribution automatique.
4. Cliquez sur **Imprimer** pour générer une version papier du planning.
5. Changez la langue à tout moment via le bouton **AR/FR** en haut de page.
   Les modifications sont enregistrées automatiquement dans votre bin JSONBin si
   les paramètres sont renseignés.

### Attribution automatique

Dans la section administrateur, indiquez la **chambre de départ** ainsi que la **date de début**. Appuyez sur le bouton **Auto** pour préremplir le calendrier en tenant compte des éventuelles chambres exclues.

### Exclure des chambres

Saisissez les numéros à ignorer dans le champ d'exclusion puis validez pour retirer ces chambres de la planification automatique.

### Nettoyer le calendrier

Le bouton **Clear** efface rapidement toutes les valeurs saisies et permet de repartir sur une grille vierge.

### Tester la sauvegarde

Après avoir rempli manuellement le planning ou utilisé le bouton **Auto**, rafraîchissez la page. Toutes les dates attribuées doivent réapparaître grâce à la persistance via JSONBin. Si ce n'est pas le cas, vérifiez que `BIN_URL` est correct et que la clé API est disponible dans le navigateur.

### Thème sombre

Activez le bouton **Thème** pour basculer entre un affichage clair et sombre selon vos préférences.

## Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir des issues ou des pull requests pour proposer des améliorations.

## Licence

Ce projet est distribué sous la licence [MIT](LICENSE).
Une documentation et une licence en arabe sont disponibles : [README_ar.md](README_ar.md) et [LICENSE_AR.md](LICENSE_AR.md).
