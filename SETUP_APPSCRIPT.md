# Configuration Google Apps Script - Guide Complet

## Étape 1 : Créer/Ouvrir votre Google Sheet

1. Allez sur [Google Sheets](https://sheets.google.com)
2. Créez une nouvelle feuille de calcul ou ouvrez une existante

## Étape 2 : Accéder à Apps Script

1. Dans votre Google Sheet, cliquez sur **Extensions** (en haut)
2. Sélectionnez **Apps Script**
3. Un nouvel onglet s'ouvrira avec l'éditeur de code

## Étape 3 : Copier le code

1. Dans l'éditeur Apps Script, supprimez tout le code par défaut
2. Ouvrez le fichier `APPSCRIPT_CODE.gs` dans ce projet
3. Copiez TOUT le code (Ctrl+A, Ctrl+C)
4. Collez-le dans l'éditeur Apps Script (Ctrl+V)
5. Cliquez sur **Enregistrer** (Ctrl+S)

## Étape 4 : Exécuter le script (pour les permissions)

1. Cliquez sur le bouton **Exécuter** (▶)
2. Google demandera les permissions - acceptez-les
3. Attendez que l'exécution se termine

## Étape 5 : Déployer comme Web App

1. Cliquez sur **Déployer** (en haut à droite)
2. Sélectionnez **Nouveau déploiement**
3. Cliquez sur l'icône ⚙️ et sélectionnez **Application Web**
4. Remplissez les champs :
   - **Exécuter en tant que** : Votre compte Google
   - **Qui a accès** : Tout le monde
5. Cliquez sur **Déployer**
6. Google affichera une URL comme : `https://script.google.com/macros/s/AKfycbz...`

## Étape 6 : Copier l'URL dans l'app

1. Copiez l'URL complète du déploiement
2. Ouvrez l'app React sur http://localhost:5000
3. Cliquez sur l'icône ⚙️ (Settings)
4. Collez l'URL dans le champ "Lien Google Sheet"
5. Cliquez sur "Terminer"

## Étape 7 : Tester

1. Remplissez quelques données dans l'app
2. Cliquez sur le bouton **Sauvegarder** (vert)
3. Allez dans votre Google Sheet
4. Les données doivent apparaître automatiquement !

## Dépannage

### Les données n'apparaissent pas
- Vérifiez que l'URL est correcte (copiée entièrement)
- Vérifiez que vous avez bien cliqué sur "Déployer" (pas juste "Enregistrer")
- Vérifiez que "Qui a accès" est défini sur "Tout le monde"

### Erreur "Accès refusé"
- Allez dans Apps Script
- Cliquez sur **Déployer** > **Gérer les déploiements**
- Supprimez l'ancien déploiement
- Créez un nouveau déploiement avec les bonnes permissions

### Erreur HTTP 403
- Cela signifie que les permissions ne sont pas correctes
- Refaites le déploiement en vous assurant que "Qui a accès" = "Tout le monde"

## Après chaque modification du script

Si vous modifiez le code Apps Script :
1. Cliquez sur **Déployer** > **Gérer les déploiements**
2. Supprimez l'ancien déploiement
3. Créez un nouveau déploiement
4. Copiez la nouvelle URL dans l'app
