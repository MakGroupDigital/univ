# Configuration Google Sheets API

Cette approche utilise l'API Google Sheets directement, sans AppScript.

## Étape 1 : Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com)
2. Cliquez sur le sélecteur de projet (en haut)
3. Cliquez sur **NOUVEAU PROJET**
4. Donnez un nom (ex: "Suivi Universitaire")
5. Cliquez sur **CRÉER**
6. Attendez que le projet soit créé

## Étape 2 : Activer l'API Google Sheets

1. Dans la console, allez à **APIs et services** → **Bibliothèque**
2. Recherchez "Google Sheets API"
3. Cliquez sur le résultat
4. Cliquez sur **ACTIVER**

## Étape 3 : Créer une clé API

1. Allez à **APIs et services** → **Identifiants**
2. Cliquez sur **+ CRÉER DES IDENTIFIANTS**
3. Sélectionnez **Clé API**
4. Une clé API sera générée (ressemble à : `AIzaSyD...`)
5. Copiez-la

## Étape 4 : Obtenir l'ID de votre Google Sheet

1. Ouvrez votre Google Sheet
2. Regardez l'URL : `https://docs.google.com/spreadsheets/d/[ID_ICI]/edit`
3. Copiez l'ID (la longue chaîne entre `/d/` et `/edit`)

## Étape 5 : Configurer l'app

1. Ouvrez l'app sur http://localhost:5000
2. Cliquez sur l'icône ⚙️ (Settings)
3. Collez :
   - **ID du Google Sheet** : L'ID de l'étape 4
   - **Clé API Google** : La clé de l'étape 3
4. Cliquez sur "Terminer"

## Étape 6 : Tester

1. Remplissez quelques données dans l'app
2. Cliquez sur **Sauvegarder**
3. Allez dans votre Google Sheet
4. Les données doivent apparaître !

---

## Dépannage

### Erreur "Accès refusé" ou "Unauthorized"
- Vérifiez que l'API Google Sheets est activée
- Vérifiez que la clé API est correcte
- Vérifiez que l'ID du Sheet est correct

### Les données n'apparaissent pas
- Vérifiez que vous avez cliqué sur "Sauvegarder"
- Actualisez votre Google Sheet (F5)
- Vérifiez que la feuille s'appelle "Sheet1"

### Erreur "Not Found"
- Vérifiez que l'ID du Sheet est correct
- Vérifiez que vous avez accès au Sheet

---

## Avantages de cette approche

✅ Pas besoin d'AppScript
✅ Synchronisation directe avec Google Sheets
✅ Plus simple à configurer
✅ Fonctionne avec AppSheet aussi

## Limitations

⚠️ La clé API est stockée localement (pas sécurisé pour la production)
⚠️ Tout le monde avec la clé peut modifier votre Sheet
⚠️ Pour la production, utilisez une authentification OAuth2
