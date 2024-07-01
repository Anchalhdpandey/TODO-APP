const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Attendance = require('../models/Attendance');

// Middleware to protect routes
const adminAuth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    if (decoded.user.role !== 'admin') throw new Error();
    req.user = decoded.user;
    next();
  } catch (e) {
    res.status(400).json({ message: 'Token is not valid' });
  }
};

// Admin login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (username !== 'admin' || password !== 'admin') return res.status(400).json({ message: 'Invalid admin credentials' });

  const admin = { id: 'admin', role: 'admin' };
  const payload = { user: admin };
  jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' }, (err, token) => {
    if (err) throw err;
    res.json({ token });
  });
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (e) {
    res.status(500).send('Server error');
  }
});

// Get user attendance report
router.get('/user/:userId/report', adminAuth, async (req, res) => {
  try {
    const report = await Attendance.find({ userId: req.params.userId });
    res.json(report);
  } catch (e) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
