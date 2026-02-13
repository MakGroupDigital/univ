# ⚠️ REDÉPLOIEMENT NÉCESSAIRE

Le script Apps Script a été corrigé pour gérer les requêtes CORS correctement.

## Étapes pour redéployer :

### 1. Allez dans Apps Script
- Ouvrez votre Google Sheet
- Extensions → Apps Script

### 2. Remplacez le code
- Supprimez tout le code actuel
- Ouvrez le fichier `APPSCRIPT_CODE.gs` de ce projet
- Copiez TOUT le code
- Collez-le dans l'éditeur Apps Script
- Cliquez sur **Enregistrer** (Ctrl+S)

### 3. Exécutez le script
- Cliquez sur **Exécuter** (▶)
- Acceptez les permissions si demandé

### 4. Créez un nouveau déploiement
- Cliquez sur **Déployer** (en haut à droite)
- Cliquez sur **Gérer les déploiements**
- Supprimez l'ancien déploiement (cliquez sur la poubelle)
- Cliquez sur **Nouveau déploiement**
- Cliquez sur l'icône ⚙️ et sélectionnez **Application Web**
- Configurez :
  - **Exécuter en tant que** : Votre compte Google
  - **Qui a accès** : **Tout le monde**
- Cliquez sur **Déployer**

### 5. Copiez la nouvelle URL
- Copiez l'URL affichée (ressemble à : `https://script.google.com/macros/s/AKfycbz...`)

### 6. Mettez à jour l'app
- Ouvrez l'app sur http://localhost:5000
- Cliquez sur l'icône ⚙️ (Settings)
- Collez la NOUVELLE URL
- Cliquez sur "Terminer"

### 7. Testez
- Remplissez quelques données
- Cliquez sur **Sauvegarder**
- Les données doivent apparaître dans votre Google Sheet !

---

## Pourquoi ce redéploiement ?

Le problème était une erreur CORS (Cross-Origin Resource Sharing). Le script a été corrigé pour :
- Accepter les requêtes POST avec `Content-Type: text/plain`
- Gérer les requêtes OPTIONS (preflight CORS)
- Retourner les bonnes en-têtes CORS

Maintenant ça devrait marcher !
