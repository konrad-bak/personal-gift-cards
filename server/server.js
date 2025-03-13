import cors from 'cors';
import e from 'express';
import mongoose from 'mongoose';
import Card from './models/card.js';
import User from './models/user.js';
// const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken';

import authenticate from './middleware/authenticate.js';

const app = e();
const PORT = process.env.PORT;

const corsOptions = {
  origin: 'http://127.0.0.1:5173',
};

app.use(cors(corsOptions));
app.use(e.json()); // Add middleware to parse JSON requests

// MONGODB ---------------------------------------------------------
// Connect to MongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/personalGiftCards_db', {})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Create Card
app.post('/cards', authenticate, async (req, res) => {
  try {
    const card = new Card(req.body);
    await card.save();
    await User.findByIdAndUpdate(req.body.owner, {
      $push: { cards: card._id },
    });

    //Add card to each recipient's received cards.
    for (const recipientId of req.body.recipients) {
      await User.findByIdAndUpdate(recipientId, {
        $push: { receivedCards: card._id },
      });
    }
    res.status(201).send(card);
  } catch (error) {
    res.status(400).send(error);
  }
});

//Send card to user
app.put('/cards/send/:cardId/:recipientId', authenticate, async (req, res) => {
  try {
    const { cardId, recipientId } = req.params;
    await Card.findByIdAndUpdate(cardId, { recipient: recipientId });
    await User.findByIdAndUpdate(recipientId, {
      $push: { receivedCards: cardId },
    });
    res.status(200).send({ message: 'Card sent' });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get User Cards
app.get('/users/:userId/cards', authenticate, async (req, res) => {
  try {
    if (req.params.userId !== req.userId) {
      return res.status(403).send({ message: 'Unauthorized' });
    }
    const user = await User.findById(req.params.userId)
      .populate({
        path: 'cards',
        populate: { path: 'recipients' }, // Populate recipients
      })
      .populate({ path: 'receivedCards', populate: { path: 'recipients' } });
    const allCards = [...user.cards, ...user.receivedCards];
    res.send(allCards);
  } catch (error) {
    res.status(500).send(error);
  }
});

// USERS ----------------------------------------------------------
const JWT_SECRET = process.env.JWT_SECRET;

// User Login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.send({ token, userId: user._id });
  } catch (error) {
    res.status(500).send(error);
  }
});

// User Registration
app.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Test for now ----------------------------------------------------
app.get('/', (req, res) => {
  res.json({
    serverText: 'This text came from server HA!',
  });
});
// -----------

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server started at port ${PORT}`);
});
