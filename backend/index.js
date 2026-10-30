const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/User');
const Ticket = require('./models/Ticket');
const Reclamation = require('./models/Reclamation');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'uneCleSecreteTrèsForte';

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ DB connection error:', err));

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

function checkAdmin(req, res, next) {
  if (req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Accès interdit : Admin seulement' });
  }
}

// Routes

app.get('/', (req, res) => {
  res.send('Server is running');
});

// Register
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = email === 'amen321@gmail.com' ? 'admin' : 'client';

    const newUser = new User({ email, password: hashedPassword, role });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ message: 'User registered successfully', token, role: newUser.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Créer un ticket
app.post('/tickets', authenticateToken, async (req, res) => {
  const { sujet, description } = req.body;

  try {
    const newTicket = new Ticket({
      sujet,
      description,
      userId: req.user.id,
      statut: 'Ouvert'
    });
    await newTicket.save();
    res.status(201).json({ message: '🎫 Ticket envoyé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Erreur serveur' });
  }
});

// Tickets utilisateur connecté
app.get('/tickets', authenticateToken, async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Erreur serveur' });
  }
});

// Admin: Tous les tickets
app.get('/admin/tickets', authenticateToken, checkAdmin, async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate('userId', 'email')
      .sort({ date: -1 });

    // نجيبو الشكاوي المرتبطة بكل تكت
    const reclamations = await Reclamation.find();

    // ندمجوهم مع بعض
    const merged = tickets.map(ticket => {
      const related = reclamations.filter(r => r.ticketId.toString() === ticket._id.toString());
      return {
        ...ticket.toObject(),
        reclamations: related,
      };
    });

    res.json(merged);
  } catch (err) {
    console.error('❌ Erreur admin/tickets:', err);
    res.status(500).json({ message: '❌ Erreur serveur' });
  }
});



// ✅ Admin: Tickets avec réclamations
app.get('/admin/tickets/reclamations', authenticateToken, checkAdmin, async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('userId', 'email').sort({ date: -1 });
    const allReclamations = await Reclamation.find();

    const ticketsWithReclamations = tickets.map(ticket => {
      const reclamations = allReclamations.filter(rec => rec.ticketId.toString() === ticket._id.toString());
      return {
        ...ticket.toObject(),
        reclamations
      };
    });

    res.json(ticketsWithReclamations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Erreur serveur' });
  }
});

// Admin: Modifier statut
app.patch('/tickets/:id', authenticateToken, checkAdmin, async (req, res) => {
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
    console.error(err);
    res.status(500).json({ message: '❌ Erreur serveur' });
  }
});

// Dashboard sécurisé
app.get('/dashboard-data', authenticateToken, (req, res) => {
  res.json({
    data: `Bienvenue ${req.user.email}, voici vos données sécurisées 🎉`
  });
});

// Ajouter une réclamation
app.post('/reclamations', authenticateToken, async (req, res) => {
  const { ticketId, content } = req.body;

  if (!ticketId || !content) {
    return res.status(400).json({ message: 'ticketId et content sont requis' });
  }

  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: 'Ticket non trouvé' });

    const newReclamation = new Reclamation({
      ticketId,
      content
    });

    await newReclamation.save();

    res.status(201).json({ message: 'Réclamation envoyée avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
