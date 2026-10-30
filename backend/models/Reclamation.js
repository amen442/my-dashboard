// models/Reclamation.js
const mongoose = require('mongoose');

const reclamationSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reclamation', reclamationSchema);
