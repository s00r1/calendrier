# Calendrier du ménage de la cuisine

## Présentation du projet
Cette application web gère la répartition des tâches de ménage dans la cuisine.
Elle fonctionne entièrement côté client : ouvrez simplement `index.html` dans un navigateur moderne pour générer et imprimer un calendrier personnalisé.

### Fonctionnalités principales
- Génération dynamique d'un calendrier mensuel
- Attribution manuelle ou automatique des chambres (de **1** à **54** sauf la chambre **13**)
- Mode administrateur protégé par mot de passe pour modifier le planning
- Exclusion de chambres et démarrage de l'attribution à une date précise
- Effacement rapide du calendrier et thème sombre pour le confort visuel
- Impression directe depuis le navigateur
- Les éléments de l'interface administrateur sont automatiquement masqués lors de l'impression
- Interface bilingue (français/العربية) avec changement instantané via le bouton AR/FR
- Sauvegarde en ligne des affectations grâce à Supabase
- Sauvegarde et chargement de configurations d'attribution
- Changement du mot de passe administrateur via l'interface
- Ajout possible de plusieurs chambres par jour et liaison de chambres pour les attributions groupées

---

## 🚀 Installation locale détaillée (Windows, Linux, macOS)

### 1️⃣ Prérequis

Pour utiliser ce projet, il est recommandé d’avoir :
- **Git** (pour cloner le dépôt)
- Un **navigateur moderne** (Chrome, Firefox, Edge, Safari...)
- (Optionnel) [VS Code](https://code.visualstudio.com/) pour modifier le code facilement
- (Pour la sauvegarde) Un compte [Supabase](https://app.supabase.com/)

#### Installer Git selon votre système :

- Windows : Téléchargez Git ici : https://git-scm.com/download/win puis installez-le (option par défaut). Lancez “Git Bash” depuis le menu démarrer.
- Linux : Ouvrez un terminal et tapez :
    sudo apt update
    sudo apt install git
- macOS : Ouvrez le Terminal et tapez :
    brew install git
  (Si Homebrew n'est pas installé, voir https://brew.sh)

---

### 2️⃣ Cloner le dépôt

Ouvrez votre terminal (**Git Bash** sur Windows, terminal classique sur Linux/Mac), puis tapez :

    git clone https://github.com/s00r1/calendrier.git
    cd calendrier

*Astuce : si vous ne souhaitez pas utiliser Git, cliquez sur le bouton “Code” sur la page GitHub, puis “Download ZIP”, et décompressez-le où vous voulez.*

---

### 3️⃣ Ouvrir le projet

- Ouvrez le dossier “calendrier” obtenu.
- Pour modifier les fichiers, ouvrez-le avec [VS Code](https://code.visualstudio.com/) ou votre éditeur favori.
- Si vous ne souhaitez pas modifier, passez à l’étape suivante.

---

### 4️⃣ Lancer le projet en local

Méthode rapide : Double-cliquez sur `index.html`.
Selon votre navigateur/système, certaines fonctions avancées peuvent nécessiter d’utiliser un serveur local.

Serveur local recommandé (pour tout voir et modifier) :
- Installez Live Server sur VS Code (extension gratuite).
- Clic droit sur `index.html` → “Open with Live Server”.
- Alternatif : `npx serve .` ou `python3 -m http.server` dans le dossier du projet.

---

## Configuration

1. Copiez le fichier `.env.example` en `.env`.
2. Renseignez-y vos identifiants Supabase et le mot de passe administrateur :

    SUPABASE_URL=<votre_url>
    SUPABASE_KEY=<votre_cle>
    ADMIN_PASS=s00r1

Pour utiliser la sauvegarde Supabase :
- Créez un compte sur https://app.supabase.com et un projet.
- Suivez la suite “Configuration” (voir plus bas).

---

## Travail sur GitHub

Pour collaborer/modifier :

1. Forkez ce dépôt sur GitHub (bouton “Fork” en haut à droite).
2. Clonez votre fork :

    git clone https://github.com/s00r1/calendrier.git
    cd calendrier

3. Créez une branche dédiée à vos changements :

    git checkout -b ma-fonctionnalite

4. Commitez vos modifications, puis poussez la branche :

    git add .
    git commit -m "Ajout de ma fonctionnalité"
    git push origin ma-fonctionnalite

5. Sur GitHub, ouvrez une Pull Request pour proposer votre contribution.

---

## Tests manuels

- `node testSupabase.js` vérifie l'accès à la table `assignments`.
- `index.html?test-api=1` ou `dev.html` testent les requêtes Supabase depuis le navigateur.

---

## ⚙️ Configuration avancée Supabase

Copiez le fichier `.env.example` vers `.env` et renseignez `SUPABASE_URL`, `SUPABASE_KEY` ainsi que `ADMIN_PASS`.

### Création des tables Supabase

1. Connectez-vous à https://app.supabase.com et créez un projet.
2. Dans **Table Editor**, créez la table `assignments` :
   - `id` : auto‑incrément, clé primaire
   - `due_date` : date, unique
   - `title` : texte
3. Activez la Row Level Security (RLS) puis ajoutez une politique autorisant le rôle `anon` à lire et écrire dans la table (expression `true` pour les tests).
4. Dans **Settings > API**, copiez l'URL et la clé `anon` de votre projet.
5. Renseignez ces valeurs dans le fichier `.env`.
6. Dans le **SQL Editor**, copiez le bloc ci-dessous pour créer la table `admin_configs`, activer la RLS et ajouter la politique `anon_full_access` :

```sql
-- Table pour les configurations admin
create table if not exists public.admin_configs (
  id bigint generated by default as identity primary key,
  name text not null unique,
  excluded integer[] not null default '{}'::integer[],
  linked jsonb not null default '[]',
  admin_pass text not null default 's00r1',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_admin_configs_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

create trigger trg_admin_configs_updated_at
before update on public.admin_configs
for each row execute procedure public.set_admin_configs_updated_at();

alter table public.admin_configs enable row level security;

create policy anon_full_access on public.admin_configs
  for all to anon
  using (true)
  with check (true);
```

#### Création automatique via SQL Editor

Ouvrez le SQL Editor, cliquez sur New query puis copiez/collez :

    create table if not exists public.assignments (
      id bigint generated by default as identity primary key,
      due_date date not null unique,
      title text
    );

    alter table public.assignments enable row level security;

    create policy anon_full_access on public.assignments
      for all to anon
      using (true)
      with check (true);

Répétez l'opération pour la table `admin_configs` en utilisant le bloc SQL ci-dessus.

---

## Utilisation rapide

1. Sélectionnez le mois et l'année souhaités, le calendrier se met à jour instantanément.
2. Activez le mode administrateur via le bouton Admin et entrez le mot de passe défini dans le fichier `.env`.
3. Renseignez les numéros de chambre pour chaque date ou utilisez l'attribution automatique. Utilisez le bouton + pour ajouter plusieurs chambres si besoin.
5. Cliquez sur Imprimer pour générer une version papier du planning.
6. Changez la langue à tout moment via le bouton AR/FR en haut de page. Les modifications sont enregistrées automatiquement dans Supabase si la configuration est correcte.
7. Utilisez la barre Configuration en haut du panneau admin pour charger ou sauvegarder un jeu d'options et modifier le mot de passe.

### Attribution automatique

Dans la section administrateur, indiquez la chambre de départ ainsi que la date de début.
Appuyez sur le bouton Auto pour préremplir le calendrier en tenant compte des éventuelles chambres exclues.

### Exclure des chambres

Sélectionnez le numéro ou le couple de chambres à ignorer dans le menu déroulant puis validez pour retirer ces chambres de la planification automatique.
Les couples apparaissent sous la forme « a/b » et excluent les deux numéros.

#### Cas particulier

Si la liste d'exclusion contient toutes les chambres (les 54 numéros), le bouton Auto affiche un message d'erreur et aucune attribution n'est réalisée.

### Lier des chambres

Utilisez les deux champs sous la section admin pour indiquer deux numéros de chambre à lier.
Elles seront attribuées ensemble lors des modifications et de l'attribution automatique.
Un bouton permet de supprimer un lien existant.
Les couples ainsi créés apparaissent dans les menus déroulants sous la forme « a/b » (la valeur renvoyée reste le premier numéro).

### Sauvegarder ou charger une configuration

La première ligne de la zone admin affiche maintenant un bandeau Configuration placé juste sous le bouton Admin.
On y trouve un menu déroulant listant les configurations enregistrées ainsi que les boutons Charger, Sauvegarder et Supprimer.
Ce même bandeau comporte aussi un bouton Changer mot de passe.

- Utilisez Sauvegarder pour stocker les exclusions et liaisons actuellement définies.
- Sélectionnez ensuite un nom dans la liste et cliquez sur Charger pour réappliquer ces réglages.
- Supprimer retire l'entrée choisie.
- Changer mot de passe enregistre un nouveau mot de passe administrateur dans Supabase.

### Nettoyer le calendrier

Le bouton Clear efface rapidement toutes les valeurs saisies et permet de repartir sur une grille vierge.

### Tester la sauvegarde

Après avoir rempli manuellement le planning ou utilisé le bouton Auto, rafraîchissez la page.
Toutes les dates attribuées doivent réapparaître grâce à la persistance via Supabase.
Si ce n'est pas le cas, vérifiez votre configuration Supabase.

### Vérifier la connexion Supabase

Un script Node (`testSupabase.js`) permet de tester rapidement l'accès à la table `assignments`.

1. Installez les dépendances (une seule fois) :
    npm install
2. Exécutez le script :
    node testSupabase.js
Les données récupérées ou un message d'erreur complet s'afficheront dans la console.

### Tests manuels de l'API

Un autre script (`test-api.js`) permet de vérifier depuis le navigateur que les requêtes Supabase fonctionnent correctement.
Ouvrez la page `index.html?test-api=1` (ou simplement `dev.html`) pour exécuter ces tests manuels.
Les résultats ou erreurs s'afficheront directement sur l'interface.

### Thème sombre

Activez le bouton Thème pour basculer entre un affichage clair et sombre selon vos préférences.

---

## Contribuer

Les contributions sont les bienvenues !
N'hésitez pas à ouvrir des issues ou des pull requests pour proposer des améliorations.

### Pour démarrer

1. Copiez le fichier `.env.example` vers `.env` puis renseignez les variables nécessaires.
2. Exécutez éventuellement `npm install` puis `npm start` (ou `npx serve .`) pour servir l'application localement.
3. Lancez `node testSupabase.js` afin de vérifier la connexion à Supabase.
4. Les pull requests doivent préserver la compatibilité client‑side : merci de ne pas ajouter de dépendances serveur supplémentaires.

---

## Licence

Ce projet est distribué sous la [licence MIT](LICENSE).
Une documentation est également disponible en anglais : [README_en.md](README_en.md).
Une documentation et une licence en arabe sont disponibles : [README_ar.md](README_ar.md) et [LICENSE_AR.md](LICENSE_AR.md).

---

## 💡 Astuces & FAQ débutant

- Clonage impossible ? Vérifiez que Git est bien installé (voir étape 1).
- Problème de droit sur le dossier ? Lancez votre éditeur/terminal en tant qu’administrateur (Windows) ou utilisez sudo (Linux/Mac).
- Erreur au lancement ? Vérifiez que les clés Supabase sont correctement remplies dans `.env` et que la connexion internet est active.
- Besoin de réinitialiser le projet ? Supprimez le dossier, reclonez, recommencez calmement.

Pour toute question ou problème : ouvrez une issue GitHub sur https://github.com/s00r1/calendrier/issues.
