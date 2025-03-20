import e from 'express';
import jwt from 'jsonwebtoken';
import Card from '../mongodb_models/card.js';
import User from '../mongodb_models/user.js';

const router = e.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.send({ token, userId: user._id, username: user.username });
  } catch (error) {
    console.error('Login Error:', error); // Log the error
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// User Registration
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// User Deletion
router.delete('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    // console.log('Delete User Request - User ID:', userId); // Log user ID

    // Delete cards owned by the user
    await Card.deleteMany({ owner: userId });

    // Delete the user
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.send({ message: 'User and associated cards deleted successfully' });
  } catch (error) {
    console.error('Delete User Error:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

export default router;
