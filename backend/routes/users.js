const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const { exec } = require('child_process');

// Signup route
router.post('/signup', async (req, res) => {
  const { name, email, password, isOrganizer } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Call Python script to generate XRPL wallet
    exec('python3 createWallet.py', async (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).send('Error generating wallet');
      }

      // Parse the wallet details
      const wallet = JSON.parse(stdout);

      // Create new user with wallet details
      user = new User({
        name,
        email,
        password,
        isOrganizer,
        xrplWallet: wallet
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = { user: { id: user.id }};
      jwt.sign(payload, 'your_jwt_secret', { expiresIn: 3600 }, (err, token) => {
        if (err) throw err;
        res.json({ token, xrplWallet: user.xrplWallet });
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User does not exist' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Incorrect password' });
    }

    const payload = { user: { id: user.id }};
    jwt.sign(payload, 'your_jwt_secret', { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
