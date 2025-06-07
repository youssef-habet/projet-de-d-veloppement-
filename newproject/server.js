require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const authRoutes = require('./routes/auth');
const mapsRoutes = require('./routes/maps');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', mapsRoutes);

// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
