import cors from 'cors';
import e from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import cardRoutes from './routes/cards.js';

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

app.use('/auth', authRoutes);
app.use('/cards', cardRoutes);

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
