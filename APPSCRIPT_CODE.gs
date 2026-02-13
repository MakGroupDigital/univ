// ============================================
// SCRIPT GOOGLE APPS SCRIPT POUR GOOGLE SHEETS
// ============================================
// INSTRUCTIONS :
// 1. Ouvrez votre Google Sheet
// 2. Cliquez sur "Extensions" > "Apps Script"
// 3. Supprimez le code par défaut
// 4. Collez TOUT ce code ci-dessous
// 5. Cliquez sur "Exécuter" (il demandera les permissions)
// 6. Allez à "Déployer" > "Nouveau déploiement"
// 7. Type : "Application Web"
// 8. Exécuter en tant que : Votre compte
// 9. Qui a accès : "Tout le monde"
// 10. Cliquez sur "Déployer"
// 11. Copiez l'URL générée et collez-la dans l'app
// ============================================

function doPost(e) {
  try {
    // Récupérer les données envoyées par l'app
    let data;
    
    // Vérifier si c'est du FormData ou du JSON brut
    if (e.parameter && e.parameter.data) {
      // FormData
      data = JSON.parse(e.parameter.data);
    } else if (e.postData && e.postData.contents) {
      // JSON brut
      data = JSON.parse(e.postData.contents);
    } else {
      throw new Error("Aucune donnée reçue");
    }
    
    // Vérifier que c'est un tableau
    if (!Array.isArray(data)) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "Les données doivent être un tableau"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Récupérer la feuille active
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Effacer tout le contenu existant
    sheet.clearContents();
    
    // Ajouter les en-têtes
    sheet.appendRow(['ID', 'Université', 'Ville', 'Statut', 'Réponse', 'Observation']);
    
    // Ajouter chaque ligne de données
    data.forEach(row => {
      sheet.appendRow([
        row.id || '',
        row.nom || '',
        row.ville || '',
        row.statut || '',
        row.reponse || '',
        row.observation || ''
      ]);
    });
    
    // Formater les en-têtes en gras
    const headerRange = sheet.getRange(1, 1, 1, 6);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#007FFF');
    headerRange.setFontColor('#FFFFFF');
    
    // Ajuster la largeur des colonnes
    sheet.autoResizeColumns(1, 6);
    
    // Retourner une réponse de succès
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: `${data.length} lignes ajoutées`,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Retourner une réponse d'erreur
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doOptions(e) {
  // Gérer les requêtes OPTIONS (preflight CORS)
  return ContentService.createTextOutput()
    .setMimeType(ContentService.MimeType.TEXT);
}

function doGet(e) {
  try {
    // Récupérer la feuille active
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // Convertir en format JSON (sauter la première ligne qui est les en-têtes)
    const headers = data[0];
    const rows = data.slice(1).map(row => ({
      id: row[0],
      nom: row[1],
      ville: row[2],
      statut: row[3],
      reponse: row[4],
      observation: row[5]
    }));
    
    return ContentService.createTextOutput(JSON.stringify(rows))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
