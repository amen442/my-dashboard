const express = require('express');
const Ticket = require('../models/Ticket');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

// simple check admin example
function checkAdmin(req, res, next) {
  if (req.user.email === 'admin@admin.com') {
    next();
  } else {
    res.status(403).json({ message: 'Accès interdit : Admin seulement' });
  }
}

router.get('/admin/tickets', authenticateToken, checkAdmin, async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('userId', 'email').sort({ date: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/tickets/:id', authenticateToken, checkAdmin, async (req, res) => {
  const { statut } = req.body;
  const validStatus = ['Ouvert', 'En cours', 'Fermé'];

  if (!validStatus.includes(statut)) {
    return res.status(400).json({ message: 'Statut invalide' });
  }

  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket non trouvé' });

    ticket.statut = statut;
    await ticket.save();

    res.json({ message: 'Statut mis à jour', ticket });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
