import e from 'express';
import authenticate from '../middleware/authenticate.js';
import Card from '../mongodb_models/card.js';
import User from '../mongodb_models/user.js';

const router = e.Router();

// Create Card
router.post('/', authenticate, async (req, res) => {
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

// Get User Cards
router.get('/users/:userId/cards', authenticate, async (req, res) => {
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

//Send card to user
router.put('/send/:cardId/:recipientId', authenticate, async (req, res) => {
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

export default router;
