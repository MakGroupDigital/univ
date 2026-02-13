# Test du Script Apps Script

## Étape 1 : Redéployer le script

1. Ouvrez votre Google Sheet
2. Extensions → Apps Script
3. Supprimez tout le code
4. Copiez le code de `APPSCRIPT_CODE.gs`
5. Collez-le dans l'éditeur
6. Cliquez sur **Enregistrer**

## Étape 2 : Exécutez le script

1. Cliquez sur **Exécuter** (▶)
2. Acceptez les permissions

## Étape 3 : Créez un nouveau déploiement

1. Cliquez sur **Déployer** → **Gérer les déploiements**
2. Supprimez l'ancien déploiement
3. Cliquez sur **Nouveau déploiement**
4. Type : **Application Web**
5. Exécuter en tant que : **Votre compte**
6. Qui a accès : **Tout le monde** ⚠️
7. Cliquez sur **Déployer**
8. Copiez la nouvelle URL

## Étape 4 : Testez directement dans le navigateur

1. Ouvrez un nouvel onglet
2. Collez cette URL (remplacez `YOUR_URL` par votre URL) :
```
YOUR_URL?data={"test":"data"}
```

3. Vous devriez voir une réponse JSON

## Étape 5 : Mettez à jour l'app

1. Ouvrez http://localhost:5000
2. Cliquez sur ⚙️ (Settings)
3. Collez la NOUVELLE URL
4. Cliquez sur "Terminer"

## Étape 6 : Testez l'app

1. Remplissez quelques données
2. Cliquez sur **Sauvegarder**
3. Allez dans votre Google Sheet
4. Actualisez la page (F5)
5. Les données doivent apparaître !

---

## Si ça ne marche toujours pas

### Vérifiez dans la console du navigateur (F12)

1. Ouvrez l'app
2. Appuyez sur F12
3. Allez dans l'onglet **Console**
4. Cliquez sur **Sauvegarder**
5. Regardez les messages d'erreur

### Vérifiez les logs du script Apps Script

1. Allez dans Apps Script
2. Cliquez sur **Exécutions** (à gauche)
3. Regardez les erreurs

### Testez l'URL directement

1. Copiez votre URL
2. Ouvrez-la dans un nouvel onglet
3. Vous devriez voir une réponse JSON
4. Si vous voyez une erreur, le script n'est pas bien déployé
