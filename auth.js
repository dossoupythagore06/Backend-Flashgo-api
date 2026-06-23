const supabase = require('../supabase');

router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        error: 'Numéro de téléphone requis'
      });
    }

    if (!phone.startsWith('+229')) {
      return res.status(400).json({
        error: 'Le numéro doit être au format +229'
      });
    }

    const { data, error } =
      await supabase.auth.signInWithOtp({
        phone
      });

    if (error) {
      return res.status(400).json({
        error: error.message
      });
    }

    return res.status(200).json({
      message: 'OTP envoyé avec succès',
      data
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
});
module.exports = async (req, res, next) => {
  try {
    // 1. Récupérer le token dans l'en-tête de la requête HTTP
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Accès refusé. Token manquant ou invalide." });
    }

    const token = authHeader.split(' ')[1];

    // 2. Vérifier le token avec le SDK Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Token invalide ou expiré." });
    }

    // 3. Injecter l'utilisateur dans la requête pour que les routes y aient accès
    req.user = user;
    
    // 4. Passer au middleware ou à la route suivante
    next();
  } catch (err) {
    return res.status(500).json({ error: "Erreur interne au niveau du middleware d'authentification." });
  }
};
const express = require('express');
const router = express.Router();
const supabase = require('../supabase');