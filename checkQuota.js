module.exports = (req, res, next) => {
  // Ce middleware vérifiera plus tard si l'utilisateur n'a pas dépassé ses limites quotidiennes
  console.log(`[QUOTA] Vérification des limites pour l'utilisateur.`);
  
  // Pour l'instant, on laisse passer tout le monde
  next();
};