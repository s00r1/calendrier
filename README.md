# Calendrier du ménage de la cuisine

Cette application web gère la répartition des tâches de ménage dans la cuisine. Elle fonctionne entièrement côté client : ouvrez simplement `index.html` dans un navigateur moderne pour générer et imprimer un calendrier personnalisé.

## Fonctionnalités principales

- Génération dynamique d'un calendrier mensuel
- Attribution manuelle ou automatique des chambres (de **1** à **54** sauf la chambre **13**)
- Mode administrateur protégé par mot de passe pour modifier le planning
- Exclusion de chambres et démarrage de l'attribution à une date précise
- Effacement rapide du calendrier et thème sombre pour le confort visuel
- Impression directe depuis le navigateur
- Export du calendrier au format PDF
- Les éléments de l'interface administrateur sont automatiquement masqués lors
  de l'impression
- Interface bilingue (français/العربية) avec changement instantané via le bouton AR/FR
- Sauvegarde en ligne des affectations grâce à Supabase
- Sauvegarde et chargement de configurations d'attribution
- Changement du mot de passe administrateur via l'interface
- Ajout possible de plusieurs chambres par jour et liaison de chambres pour les attributions groupées

## Installation

Aucune installation spécifique n'est requise. Clonez le dépôt puis ouvrez le fichier `index.html` avec votre navigateur préféré. Vous pouvez également servir le dossier via un petit serveur HTTP si vous souhaitez y accéder depuis d'autres machines :

```bash
npx serve .
# ou
npm start
```

Le script `npm start` lance automatiquement `npx serve .` pour servir l'application.

### Configuration

Copiez le fichier `.env.example` vers `.env` et renseignez `SUPABASE_URL`, `SUPABASE_KEY` ainsi que `ADMIN_PASS`.

Pour conserver les affectations avec Supabase :

1. Connectez-vous à [Supabase](https://app.supabase.com) et créez un projet (par ex. **menage**).
2. Dans **Table Editor**, créez une table `assignments` avec les colonnes `id` (auto‑incrément, clé primaire), `due_date` (date, unique) et `title` (texte). La colonne `due_date` doit être unique pour permettre l’`upsert`.
3. Activez la *Row Level Security* puis ajoutez une politique autorisant le rôle `anon` à lire et écrire dans la table (expression `true` pour les tests).
4. Dans **Settings > API**, copiez l'URL et la clé `anon` de votre projet.
5. Renseignez ces valeurs dans `supabase-config.js` aux constantes `SUPABASE_URL` et `SUPABASE_KEY`.
6. Créez la table `admin_configs` en exécutant le script `create_admin_configs.sql` dans le SQL Editor de Supabase.

**Note :** ces clés sont temporaires pour les tests et seront remplacées ultérieurement par une méthode plus sûre.

## Utilisation rapide

1. Sélectionnez le mois et l'année souhaités, le calendrier se met à jour instantanément.
2. Activez le **mode administrateur** via le bouton *Admin* et entrez le mot de passe defini dans le fichier `.env` (cle `ADMIN_PASS`).
3. Renseignez les numéros de chambre pour chaque date ou utilisez l'attribution automatique. Utilisez le bouton **+** pour ajouter plusieurs chambres si besoin.
4. Cliquez sur **Télécharger PDF** pour enregistrer le planning.
5. Cliquez sur **Imprimer** pour générer une version papier du planning.
6. Changez la langue à tout moment via le bouton **AR/FR** en haut de page.
   Les modifications sont enregistrées automatiquement dans Supabase si
   la configuration est correcte.
7. Utilisez la barre **Configuration** en haut du panneau admin pour charger ou sauvegarder un jeu d'options et modifier le mot de passe.

### Attribution automatique

Dans la section administrateur, indiquez la **chambre de départ** ainsi que la **date de début**. Appuyez sur le bouton **Auto** pour préremplir le calendrier en tenant compte des éventuelles chambres exclues.

### Exclure des chambres

Sélectionnez le numéro ou le couple de chambres à ignorer dans le menu déroulant puis validez pour retirer ces chambres de la planification automatique. Les couples apparaissent sous la forme « a/b » et excluent les deux numéros.

#### Cas particulier


Si la liste d'exclusion contient toutes les chambres (les 54 numéros), le bouton **Auto** affiche un message d'erreur et aucune attribution n'est réalisée.

### Lier des chambres

Utilisez les deux champs sous la section admin pour indiquer deux numéros de chambre à lier. Elles seront attribuées ensemble lors des modifications et de l'attribution automatique. Un bouton permet de supprimer un lien existant. Les couples ainsi créés apparaissent dans les menus déroulants sous la forme « a/b » (la valeur renvoyée reste le premier numéro).


### Sauvegarder ou charger une configuration

La première ligne de la zone admin affiche maintenant un bandeau **Configuration** placé juste sous le bouton *Admin*. On y trouve un menu déroulant listant les configurations enregistrées ainsi que les boutons **Charger**, **Sauvegarder** et **Supprimer**. Ce même bandeau comporte aussi un bouton **Changer mot de passe**.

- Utilisez **Sauvegarder** pour stocker les exclusions et liaisons actuellement définies.
- Sélectionnez ensuite un nom dans la liste et cliquez sur **Charger** pour réappliquer ces réglages.
- **Supprimer** retire l'entrée choisie.
- **Changer mot de passe** enregistre un nouveau mot de passe administrateur dans Supabase.
### Nettoyer le calendrier

Le bouton **Clear** efface rapidement toutes les valeurs saisies et permet de repartir sur une grille vierge.

### Tester la sauvegarde

Après avoir rempli manuellement le planning ou utilisé le bouton **Auto**, rafraîchissez la page. Toutes les dates attribuées doivent réapparaître grâce à la persistance via Supabase. Si ce n'est pas le cas, vérifiez votre configuration Supabase.

### Verifier la connexion Supabase

Un script Node (`testSupabase.js`) permet de tester rapidement l'acces a la table `assignments`.

1. Installez les dependances (une seule fois) :
```bash
npm install
```
2. Executez le script :
```bash
node testSupabase.js
```

Les donnees recuperees ou un message d'erreur complet s'afficheront dans la console.

### Tests manuels de l'API

Un autre script (`test-api.js`) permet de verifier depuis le navigateur que les requetes
Supabase fonctionnent correctement. Ouvrez la page `index.html?test-api=1` (ou
simplement `dev.html`) pour executer ces tests manuels. Les resultats ou erreurs
s'afficheront directement sur l'interface.


### Thème sombre

Activez le bouton **Thème** pour basculer entre un affichage clair et sombre selon vos préférences.

## Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir des issues ou des pull requests pour proposer des améliorations.

## Licence

Ce projet est distribué sous la licence [MIT](LICENSE).
Une documentation est également disponible en anglais : [README_en.md](README_en.md).
Une documentation et une licence en arabe sont disponibles : [README_ar.md](README_ar.md) et [LICENSE_AR.md](LICENSE_AR.md).
