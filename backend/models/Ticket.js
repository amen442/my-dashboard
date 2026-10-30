const mongoose = require('mongoose');

const reclamationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  date: { type: Date, default: Date.now }
});

const ticketSchema = new mongoose.Schema({
  sujet: String,
  description: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  statut: String,
  reclamations: [reclamationSchema],
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', ticketSchema);
