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
- Sauvegarde en ligne des affectations grâce à JSONBin via `/api/jsonbin-proxy` (à déployer sur Vercel avec la variable d'environnement `JSONBIN_KEY`)

## Installation

Aucune installation spécifique n'est requise. Clonez le dépôt puis ouvrez le fichier `index.html` avec votre navigateur préféré. Vous pouvez également servir le dossier via un petit serveur HTTP si vous souhaitez y accéder depuis d'autres machines :

```bash
npx serve .
```

Si vous souhaitez conserver les affectations, déployez la fonction `api/jsonbin-proxy/[[...path]].js` sur Vercel (ou une plateforme serverless similaire) en définissant la variable d'environnement `JSONBIN_KEY`.

Cette fonction contient un identifiant de bin fixé dans la constante `BIN_ID`. Remplacez cette valeur par l'identifiant de votre propre bin ou exposez-le via la variable `JSONBIN_ID` lors du déploiement. La clé `JSONBIN_KEY` doit correspondre à ce même bin.

Le front-end utilise alors automatiquement `/api/jsonbin-proxy` pour communiquer avec JSONBin.

La variable `JSONBIN_KEY` doit impérativement correspondre à la *Master Key* de votre bin JSONBin, disponible depuis le tableau de bord du service.

Exemple de déploiement avec Vercel :

```bash
JSONBIN_KEY=<ma_master_key> JSONBIN_ID=<mon_bin_id> vercel --prod
```

Pour un test en local, vous pouvez lancer :

```bash
JSONBIN_KEY=<ma_master_key> JSONBIN_ID=<mon_bin_id> vercel dev
```

Ensuite ouvrez l'URL `/api/jsonbin-proxy` dans votre navigateur pour vérifier que le proxy répond correctement.

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

#### Cas particulier

Si la liste d'exclusion contient toutes les chambres (les 54 numéros), le bouton **Auto** affiche un message d'erreur et aucune attribution n'est réalisée.

### Nettoyer le calendrier

Le bouton **Clear** efface rapidement toutes les valeurs saisies et permet de repartir sur une grille vierge.

### Tester la sauvegarde

Après avoir rempli manuellement le planning ou utilisé le bouton **Auto**, rafraîchissez la page. Toutes les dates attribuées doivent réapparaître grâce à la persistance via JSONBin. Si ce n'est pas le cas, vérifiez que le proxy est bien lancé et que `JSONBIN_KEY` est configurée côté serveur.

### Thème sombre

Activez le bouton **Thème** pour basculer entre un affichage clair et sombre selon vos préférences.

## Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir des issues ou des pull requests pour proposer des améliorations.

## Licence

Ce projet est distribué sous la licence [MIT](LICENSE).
Une documentation est également disponible en anglais : [README_en.md](README_en.md).
Une documentation et une licence en arabe sont disponibles : [README_ar.md](README_ar.md) et [LICENSE_AR.md](LICENSE_AR.md).
