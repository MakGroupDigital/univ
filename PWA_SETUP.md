# Configuration PWA - Suivi Universitaire RDC

L'app est maintenant configurée comme PWA (Progressive Web App). Voici ce qui a été fait :

## ✅ Fichiers créés

1. **favicon.svg** - Favicon moderne basé sur les couleurs RDC
2. **manifest.json** - Manifeste PWA avec métadonnées
3. **sw.js** - Service Worker pour le cache et offline
4. **index.html** - Mise à jour avec métadonnées PWA
5. **robots.txt** - Pour les moteurs de recherche
6. **.well-known/assetlinks.json** - Vérification de domaine

## 📱 Fonctionnalités PWA

- ✅ Installation sur l'écran d'accueil
- ✅ Mode standalone (sans barre d'adresse)
- ✅ Icônes personnalisées
- ✅ Splash screen
- ✅ Fonctionnement offline (cache)
- ✅ Métadonnées Open Graph
- ✅ Raccourcis d'application

## 🖼️ Générer les icônes PNG

Tu dois générer les icônes PNG suivantes et les placer dans le dossier `public/` :

1. **icon-192.png** (192x192px)
2. **icon-512.png** (512x512px)
3. **icon-192-maskable.png** (192x192px, avec padding pour maskable)
4. **icon-512-maskable.png** (512x512px, avec padding pour maskable)

### Utiliser un outil en ligne :

1. Allez sur [PWA Image Generator](https://www.pwabuilder.com/imageGenerator)
2. Uploadez le favicon.svg
3. Téléchargez les icônes générées
4. Placez-les dans le dossier `public/`

Ou utilise ImageMagick :

```bash
convert favicon.svg -resize 192x192 public/icon-192.png
convert favicon.svg -resize 512x512 public/icon-512.png
```

## 🧪 Tester la PWA

1. Ouvre l'app sur http://localhost:5000
2. Ouvre DevTools (F12)
3. Allez à **Application** → **Manifest**
4. Vérifiez que le manifest est chargé
5. Allez à **Application** → **Service Workers**
6. Vérifiez que le service worker est enregistré

## 📦 Déployer

Quand tu déploies :

1. Assure-toi que HTTPS est activé
2. Vérifie que le manifest.json est accessible
3. Teste l'installation sur mobile
4. Teste le fonctionnement offline

## 🔐 Sécurité

- Le service worker cache uniquement les ressources statiques
- Les requêtes Firebase ne sont pas cachées (toujours fraîches)
- Les données locales restent dans localStorage

## 📝 Personnalisation

Pour personnaliser :

1. **Couleurs** : Modifie `theme_color` et `background_color` dans manifest.json
2. **Icônes** : Remplace favicon.svg et les PNG
3. **Nom** : Modifie `name` et `short_name` dans manifest.json
4. **Raccourcis** : Ajoute/modifie les `shortcuts` dans manifest.json
