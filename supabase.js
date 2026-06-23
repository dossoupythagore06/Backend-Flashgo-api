const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Erreur : Variables SUPABASE_URL ou SUPABASE_SERVICE_KEY manquantes dans le .env");
  process.exit(1);
}

// Création du client avec la clé secrète (pleins pouvoirs côté serveur)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log("🔌 Connexion à Supabase initialisée avec succès !");

module.exports = supabase;