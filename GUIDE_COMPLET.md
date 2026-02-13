# Guide Complet - Suivi Universitaire RDC

## 🚀 Démarrage Rapide

### 1. Lancer l'application
```bash
npm install  # Déjà fait
npm run dev  # L'app est sur http://localhost:5000
```

### 2. Configurer Google Sheets (IMPORTANT)

#### Étape A : Créer/Ouvrir Google Sheet
- Allez sur [Google Sheets](https://sheets.google.com)
- Créez une nouvelle feuille ou ouvrez une existante

#### Étape B : Ajouter le script Apps Script
1. Dans votre Google Sheet, cliquez sur **Extensions** (menu du haut)
2. Sélectionnez **Apps Script**
3. Un nouvel onglet s'ouvrira
4. Supprimez tout le code par défaut
5. Ouvrez le fichier `APPSCRIPT_CODE.gs` de ce projet
6. Copiez TOUT le code
7. Collez-le dans l'éditeur Apps Script
8. Cliquez sur **Enregistrer** (Ctrl+S)

#### Étape C : Exécuter le script (pour les permissions)
1. Cliquez sur le bouton **Exécuter** (▶ en haut)
2. Google demandera les permissions - acceptez-les
3. Attendez que l'exécution se termine

#### Étape D : Déployer comme Web App
1. Cliquez sur **Déployer** (en haut à droite)
2. Cliquez sur **Nouveau déploiement**
3. Cliquez sur l'icône ⚙️ et sélectionnez **Application Web**
4. Configurez :
   - **Exécuter en tant que** : Votre compte Google
   - **Qui a accès** : **Tout le monde** ⚠️ (IMPORTANT!)
5. Cliquez sur **Déployer**
6. Copiez l'URL affichée (ressemble à : `https://script.google.com/macros/s/AKfycbz...`)

#### Étape E : Connecter l'app à Google Sheets
1. Ouvrez l'app sur http://localhost:5000
2. Cliquez sur l'icône ⚙️ (Settings) en haut à droite
3. Collez l'URL complète du déploiement
4. Cliquez sur "Terminer"

---

## 📝 Utilisation

### Ajouter une candidature
1. Cliquez sur le bouton **+ Ajouter**
2. Remplissez les champs :
   - **Établissement** : Nom de l'université
   - **Ville** : Localisation
   - **Statut** : Non envoyé / En préparation / Envoyé
   - **Réponse** : - / En attente / Oui / Non
   - **Notes** : Observations

### Sauvegarder dans Google Sheets
1. Cliquez sur le bouton **Sauvegarder** (vert, avec icône cloud)
2. Les données apparaîtront dans votre Google Sheet
3. Un message de confirmation s'affichera

### Importer depuis Google Sheets
1. Cliquez sur le bouton **Importer** (avec icône cloud)
2. Les données de votre Google Sheet seront chargées dans l'app

### Exporter en Excel
1. Cliquez sur le bouton **Télécharger** (avec icône download)
2. Un fichier CSV sera téléchargé

---

## ⚠️ Dépannage

### Les données n'apparaissent pas dans Google Sheets
**Cause probable** : L'URL n'est pas correcte ou le déploiement n'a pas les bonnes permissions

**Solution** :
1. Vérifiez que l'URL est complète (commence par `https://script.google.com/macros/s/`)
2. Allez dans Apps Script
3. Cliquez sur **Déployer** > **Gérer les déploiements**
4. Supprimez l'ancien déploiement
5. Créez un nouveau déploiement
6. Assurez-vous que "Qui a accès" = "Tout le monde"
7. Copiez la nouvelle URL dans l'app

### Erreur "Accès refusé" ou HTTP 403
**Cause** : Les permissions ne sont pas correctes

**Solution** :
1. Allez dans Apps Script
2. Cliquez sur **Déployer** > **Gérer les déploiements**
3. Cliquez sur l'ancien déploiement
4. Vérifiez que "Qui a accès" = "Tout le monde"
5. Si ce n'est pas le cas, supprimez et créez un nouveau déploiement

### Erreur "Impossible de lire les données"
**Cause** : L'URL est invalide ou le script n'est pas accessible

**Solution** :
1. Testez l'URL directement dans votre navigateur
2. Vous devriez voir un tableau JSON
3. Si vous voyez une erreur, refaites le déploiement

### Les données ne se synchronisent pas automatiquement
**C'est normal** : L'app ne synchronise que quand vous cliquez sur "Sauvegarder" ou "Importer"

---

## 🔄 Après chaque modification du script Apps Script

Si vous modifiez le code dans `APPSCRIPT_CODE.gs` :

1. Allez dans Apps Script
2. Cliquez sur **Déployer** > **Gérer les déploiements**
3. Supprimez l'ancien déploiement
4. Créez un nouveau déploiement
5. Copiez la nouvelle URL
6. Mettez à jour l'URL dans l'app (Settings)

---

## 📊 Structure des données

Les données sont stockées localement dans le navigateur ET synchronisées avec Google Sheets.

**Format** :
```json
[
  {
    "id": 1,
    "nom": "Université de Kinshasa",
    "ville": "Kinshasa",
    "statut": "Envoyé",
    "reponse": "En attente",
    "observation": "Dossier déposé"
  }
]
```

---

## 💾 Stockage local

L'app sauvegarde automatiquement les données dans le navigateur (localStorage). Vous ne perdrez pas vos données même si vous fermez l'app.

---

## 🆘 Besoin d'aide ?

Si ça ne marche toujours pas :
1. Vérifiez que vous avez suivi TOUTES les étapes
2. Vérifiez que "Qui a accès" = "Tout le monde" dans le déploiement
3. Essayez de supprimer et recréer le déploiement
4. Vérifiez que l'URL est complète et correcte
