const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Attendance = require('../models/Attendance');

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

router.get('/today', auth, async (req, res) => {
  const date = new Date().setHours(0, 0, 0, 0);
  try {
    const attendance = await Attendance.findOne({ userId: req.user.id, date });
    res.json({ signedIn: !!attendance && attendance.signedIn });
  } catch (e) {
    res.status(500).send('Server error');
  }
});

router.post('/signin', auth, async (req, res) => {
  const date = new Date().setHours(0, 0, 0, 0);
  try {
    let attendance = await Attendance.findOne({ userId: req.user.id, date });
    if (attendance) {
      return res.status(400).json({ message: 'Already signed in' });
    }

    attendance = new Attendance({ userId: req.user.id, date, signedIn: true });
    await attendance.save();
    res.json(attendance);
  } catch (e) {
    res.status(500).send('Server error');
  }
});

router.post('/signout', auth, async (req, res) => {
  const date = new Date().setHours(0, 0, 0, 0);
  try {
    let attendance = await Attendance.findOne({ userId: req.user.id, date });
    if (!attendance || attendance.signedOut) {
      return res.status(400).json({ message: 'Not signed in or already signed out' });
    }

    attendance.signedOut = true;
    await attendance.save();
    res.json(attendance);
  } catch (e) {
    res.status(500).send('Server error');
  }
});

router.get('/report', auth, async (req, res) => {
  try {
    const report = await Attendance.find({ userId: req.user.id });
    res.json(report);
  } catch (e) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
