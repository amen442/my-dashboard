const express = require('express');
const Ticket = require('../models/Ticket');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

router.post('/tickets', authenticateToken, async (req, res) => {
  const { sujet, description } = req.body;

  try {
    const newTicket = new Ticket({
      sujet,
      description,
      userId: req.user.id,
      statut: 'Ouvert'
    });

    await newTicket.save();
    res.status(201).json({ message: 'Ticket créé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/tickets', authenticateToken, async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
