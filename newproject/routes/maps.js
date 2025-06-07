const express = require('express');
const axios = require('axios');
const router = express.Router();

require('dotenv').config();
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// GET /api/route?origin=...&destination=...&mode=...&maxDistance=...
router.get('/route', async (req, res) => {
  const { origin, destination, mode, maxDistance, transit_mode } = req.query;

  if (!origin || !destination || !mode) {
    return res.status(400).json({ error: 'origin, destination, and mode are required.' });
  }

  try {
    const params = {
      origin,
      destination,
      mode,
      key: GOOGLE_API_KEY,
    };

    // Si mode transit, on ajoute transit_mode si défini
    if (mode === 'transit' && transit_mode) {
      params.transit_mode = transit_mode; // ex: "tram|bus"
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json`,
      { params }
    );

    const route = response.data.routes[0];
    if (!route) {
      return res.status(404).json({ error: 'No route found' });
    }

    // Calculer la distance totale de marche dans les steps
    let totalWalkingDistance = 0;
    route.legs[0].steps.forEach(step => {
      if (step.travel_mode === 'WALKING') {
        totalWalkingDistance += step.distance.value; // en mètres
      }
    });

    // Si maxDistance défini, on filtre la marche
    if (maxDistance && totalWalkingDistance > parseInt(maxDistance)) {
      return res.status(400).json({
        error: `Total walking distance (${(totalWalkingDistance / 1000).toFixed(2)} km) exceeds max allowed (${(parseInt(maxDistance)/1000).toFixed(2)} km).`
      });
    }

    res.json({
      distance: route.legs[0].distance,
      duration: route.legs[0].duration,
      steps: route.legs[0].steps,
      polyline: route.overview_polyline
    });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Error fetching directions from Google Maps' });
  }
});

module.exports = router;
