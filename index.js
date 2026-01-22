const { google } = require('googleapis');

// Charger les credentials
const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// ID de votre Google Sheet
const spreadsheetId = '1H2o0cRLkrfaeheO7gUbgC3DwCyWI-xehgA6_FeK2wjo';

async function lireData() {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'formulaire!A1:E20', // Lit les colonnes A à E, lignes 1 à 20
    });

    console.log('Données lues du tableau :');
    console.log(response.data.values);
}

async function ecrireData() {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    // Exemple : ajouter une ligne de données
    await sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: 'formulaire!A2', // Commence à la ligne 2
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: [
                ['Jean Dupont', '0612345678', 'Paris', '2024-01-15', 'Manager']
            ],
        },
    });

    console.log('Nouvelle ligne ajoutée avec succès!');
}

// Appeler la fonction pour lire les données
lireData();

// Pour écrire des données, décommentez la ligne suivante :
// ecrireData();