const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Attendance = require('../models/Attendance');

// Middleware to protect routes
const auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded.user;
    next();
  } catch (e) {
    res.status(400).json({ message: 'Token is not valid' });
  }
};

// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ username, password });
    await user.save();
    const payload = { user: { id: user.id } };
    jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (e) {
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { user: { id: user.id } };
    jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (e) {
    res.status(500).send('Server error');
  }
});

// Sign in
router.get('/attendance/today', auth, async (req, res) => {
    const date = new Date().setHours(0, 0, 0, 0);
    try {
      const attendance = await Attendance.findOne({ userId: req.user.id, date });
      res.json({ signedIn: !!attendance && attendance.signedIn });
    } catch (e) {
      console.error('Error fetching today\'s attendance:', e);
      res.status(500).send('Server error');
    }
  });

// Sign out
router.post('/attendance/signout', auth, async (req, res) => {
  const date = new Date().setHours(0, 0, 0, 0);
  try {
    let attendance = await Attendance.findOne({ userId: req.user.id, date });
    if (!attendance || attendance.signedOut) return res.status(400).json({ message: 'Not signed in or already signed out' });

    attendance.signedOut = true;
    await attendance.save();
    res.json(attendance);
  } catch (e) {
    res.status(500).send('Server error');
  }
});

// Get attendance report
router.get('/attendance/report', auth, async (req, res) => {
  try {
    const report = await Attendance.find({ userId: req.user.id });
    res.json(report);
  } catch (e) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
