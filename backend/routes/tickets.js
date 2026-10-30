// routes/tickets.js
const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const authMiddleware = require('../middleware/auth');

router.put('/tickets/:id/reclamation', authMiddleware, async (req, res) => {
  const ticketId = req.params.id;
  const { reclamation } = req.body;

  if (!reclamation || reclamation.trim() === '') {
    return res.status(400).json({ message: 'Le champ réclamation est requis.' });
  }

  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket non trouvé.' });
    }

    // Ici, on suppose que l'utilisateur peut faire une réclamation sur son propre ticket
    // Vous pouvez ajouter une vérification userId === req.user.id si besoin

    ticket.reclamation = reclamation;
    await ticket.save();

    res.json({ message: 'Réclamation mise à jour avec succès.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router;
