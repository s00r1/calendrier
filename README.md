# Calendrier du ménage de la cuisine

Cette page permet de générer et d'imprimer un calendrier mensuel pour organiser le ménage de la cuisine.
L'édition du calendrier est réservée à l'administrateur.

- Les chambres vont de **1** à **54** mais la chambre **13** est exclue.
- Le calendrier se génère entièrement côté client, aucun serveur n'est nécessaire.

## Utilisation

1. Ouvrez `index.html` dans votre navigateur.
2. Sélectionnez le mois et l'année souhaités : le calendrier se met à jour automatiquement.
3. Si vous devez modifier le calendrier, cliquez sur **Admin** et entrez le mot de passe `s00r1` pour activer le mode édition.
4. Renseignez les numéros de chambre pour chaque date.
5. Si besoin, utilisez le bouton **Clear** pour vider toutes les cases du calendrier.
6. Utilisez le bouton **Imprimer** pour obtenir la version papier du calendrier.

## Mode administrateur

Cliquez sur le bouton **Admin** pour activer l'édition du calendrier. Le mot de
passe par défaut est `s00r1`. Une fois connecté, des contrôles supplémentaires
apparaissent pour faciliter la gestion des chambres.

## Attribution automatique

Dans le mode administrateur, les champs **Chambre de départ** et **Date de
début** permettent de remplir automatiquement le calendrier. Indiquez la
première chambre à assigner ainsi que le jour du mois où commencer, puis
cliquez sur **Auto** pour préremplir les cases.

## Exclure des chambres

Si certaines chambres ne doivent pas être planifiées, saisissez leur numéro dans
l'entrée d'exclusion et cliquez sur le bouton **+**. Ces chambres seront ignorées
lors de l'attribution automatique.

## Nettoyer le calendrier

Le bouton **Clear** efface toutes les valeurs saisies dans le calendrier pour repartir sur une grille vide.

## Thème sombre

Le bouton **Thème** permet de passer en mode sombre ou de revenir au mode clair
afin d'améliorer le confort visuel.
