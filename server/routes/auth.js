import e from 'express';
import jwt from 'jsonwebtoken';
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
    res.send({ token, userId: user._id });
  } catch (error) {
    console.error('Login Error:', error); // Log the error
    res.status(500).send({ message: 'Internal Server Error' });
    console.log(JWT_SECRET);
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

export default router;
