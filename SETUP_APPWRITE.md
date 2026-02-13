# Configuration Appwrite

Appwrite est une plateforme backend open-source qui fournit une base de données, l'authentification, et plus.

## Étape 1 : Créer un compte Appwrite Cloud

1. Allez sur [Appwrite Cloud](https://cloud.appwrite.io)
2. Cliquez sur **Sign Up**
3. Créez un compte avec votre email
4. Vérifiez votre email

## Étape 2 : Créer un projet

1. Connectez-vous à Appwrite Cloud
2. Cliquez sur **Create Project**
3. Donnez un nom (ex: "Suivi Universitaire")
4. Cliquez sur **Create**

## Étape 3 : Créer une base de données

1. Dans votre projet, allez à **Databases**
2. Cliquez sur **Create Database**
3. Donnez le nom : `suivi_universitaire`
4. Cliquez sur **Create**

## Étape 4 : Créer une collection

1. Dans la base de données, cliquez sur **Create Collection**
2. Donnez le nom : `universites`
3. Cliquez sur **Create**

## Étape 5 : Ajouter les attributs

Dans la collection `universites`, créez ces attributs :

1. **id** (Integer, Required)
2. **nom** (String, Required)
3. **ville** (String, Required)
4. **statut** (String, Required)
5. **reponse** (String, Required)
6. **observation** (String, Optional)

## Étape 6 : Créer une clé API

1. Allez à **Settings** → **API Keys**
2. Cliquez sur **Create API Key**
3. Donnez un nom (ex: "App Key")
4. Sélectionnez les permissions :
   - ✅ databases.read
   - ✅ databases.write
   - ✅ collections.read
   - ✅ documents.read
   - ✅ documents.write
   - ✅ documents.delete
5. Cliquez sur **Create**
6. Copiez la clé API

## Étape 7 : Obtenir votre Project ID

1. Allez à **Settings** → **General**
2. Copiez votre **Project ID**

## Étape 8 : Configurer l'app

1. Ouvrez l'app sur http://localhost:5000
2. Cliquez sur l'icône ⚙️ (Settings)
3. Collez :
   - **ID du Projet Appwrite** : Votre Project ID
   - **Clé API Appwrite** : Votre API Key
4. Cliquez sur "Terminer"

## Étape 9 : Tester

1. Remplissez quelques données dans l'app
2. Cliquez sur **Sauvegarder**
3. Allez dans Appwrite Cloud → Databases → suivi_universitaire → universites
4. Les données doivent apparaître !

---

## Dépannage

### Erreur "Unauthorized"
- Vérifiez que votre API Key est correcte
- Vérifiez que les permissions sont correctes

### Les données n'apparaissent pas
- Vérifiez que vous avez créé la base de données `suivi_universitaire`
- Vérifiez que vous avez créé la collection `universites`
- Vérifiez que vous avez cliqué sur "Sauvegarder"

### Erreur "Database not found"
- Vérifiez que la base de données s'appelle `suivi_universitaire`
- Vérifiez que vous avez créé la base de données

---

## Avantages d'Appwrite

✅ Gratuit et open-source
✅ Base de données intégrée
✅ API REST simple
✅ Pas besoin de backend personnalisé
✅ Peut être auto-hébergé ou utiliser le cloud
✅ Authentification intégrée (optionnel)

## Limitations

⚠️ La clé API est stockée localement (pas sécurisé pour la production)
⚠️ Pour la production, utilisez une authentification OAuth2
