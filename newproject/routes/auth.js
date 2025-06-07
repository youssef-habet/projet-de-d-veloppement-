const express = require('express');
const router = express.Router();
const db = require('../config/db'); // La connexion à MySQL

router.post('/register', (req, res) => {
  const { nom, email, mot_de_passe } = req.body;

  if (!nom || !email || !mot_de_passe) {
    return res.status(400).json({ message: 'Champs manquants.' });
  }

  const sql = 'INSERT INTO users (nom, email, mot_de_passe) VALUES (?, ?, ?)';
  db.query(sql, [nom, email, mot_de_passe], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erreur lors de l\'ajout.' });
    }
    res.status(201).json({ message: 'Utilisateur enregistré avec succès !' });
  });
});

module.exports = router;