const { data, error } = await supabase.auth.signInWithOtp({ phone: phoneNumber });
const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");

// Charger les variables d'environnement
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ✅ Route pour envoyer l’OTP
router.post("/send-otp", async (req, res) => {
  const { phoneNumber } = req.body;

  // Vérifier que le numéro est béninois (+229)
  const regexBenin = /^\+229\d{8}$/;
  if (!regexBenin.test(phoneNumber)) {
    return res.status(400).json({ error: "Numéro invalide. Format attendu : +229XXXXXXXX" });
  }

  try {
    const { data, error } = await supabase.auth.signInWithOtp({ phone: phoneNumber });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: "OTP envoyé avec succès", data });
  } catch (err) {
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

// ✅ Route pour vérifier l’OTP
router.post("/verify-otp", async (req, res) => {
  const { phoneNumber, token } = req.body;

  if (!phoneNumber || !token) {
    return res.status(400).json({ error: "Numéro et code OTP requis" });
  }

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phoneNumber,
      token,
      type: "sms", // on précise que c’est un OTP par SMS
    });

    if (error) {
      return res.status(401).json({ error: "OTP invalide ou expiré" });
    }

    res.json({ message: "Authentification réussie", session: data });
  } catch (err) {
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

module.exports = router;


