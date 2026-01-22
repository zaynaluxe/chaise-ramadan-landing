import express from "express";
import bodyParser from "body-parser";
import { google } from "googleapis";
import cors from "cors";
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("."));

// Configuration Google Auth
let auth;

// Si les variables d'environnement existent (production)
if (process.env.GOOGLE_PRIVATE_KEY) {
  auth = new google.auth.GoogleAuth({
    credentials: {
      type: "service_account",
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.GOOGLE_CERT_URL,
      universe_domain: "googleapis.com"
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
} else {
  // Sinon utiliser le fichier credentials.json (développement local)
  auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

const spreadsheetId = process.env.SPREADSHEET_ID || "1H2o0cRLkrfaeheO7gUbgC3DwCyWI-xehgA6_FeK2wjo";

// Route principale
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "." });
});

// Route de santé
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Route de test de connexion Google Sheets
app.get("/test-connection", async (req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });
    
    const response = await sheets.spreadsheets.get({
      spreadsheetId: spreadsheetId
    });
    
    res.json({ 
      success: true, 
      message: "Connexion Google Sheets réussie",
      sheetTitle: response.data.properties.title
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Erreur de connexion",
      error: error.message 
    });
  }
});

// Route de soumission du formulaire
app.post("/submit", async (req, res) => {
  try {
    const { name, phone, city, quantity } = req.body;

    // Validation des données
    if (!name || !phone || !city || !quantity) {
      return res.status(400).json({ 
        success: false, 
        message: "Tous les champs sont requis" 
      });
    }

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    // Obtenir la date et l'heure au Maroc
    const now = new Date();
    const moroccoTime = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Casablanca" }));
    const formattedDate = moroccoTime.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    // Ajouter la ligne dans Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "formulaire!A:E",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[
          formattedDate,
          name,
          phone,
          city,
          quantity
        ]],
      },
    });

    console.log(`✅ Nouvelle commande: ${name} - ${city} - ${quantity} chaises`);
    res.json({ 
      success: true, 
      message: "Commande enregistrée avec succès!" 
    });
    
  } catch (err) {
    console.error("❌ Erreur lors de l'enregistrement:", err.message);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de l'enregistrement. Veuillez réessayer." 
    });
  }
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: "Route non trouvée" });
});

// Port dynamique pour le déploiement
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 URL locale: http://localhost:${PORT}`);
  console.log(`📊 Google Sheets ID: ${spreadsheetId}`);
  console.log(`🔧 Mode: ${process.env.NODE_ENV || "development"}`);
});