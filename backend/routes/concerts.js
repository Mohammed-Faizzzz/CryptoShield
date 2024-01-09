const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { exec } = require('child_process');
const Concert = require('../models/Concert');

router.get('/', async (req, res) => {
  try {
    const concerts = await Concert.find();
    if (!concerts) {
      res.status('500').json({ success: false, error: 'No concerts found' });
    }
    res.send(concerts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  const { name, description, date, venue, organiser } = req.body;
  try {
    const concert = new Concert({
      name,
      description,
      date,
      venue,
      organiser
    });
    await concert.save();
    res.send(concert);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;