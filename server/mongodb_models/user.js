import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }], // Reference to Card model
  receivedCards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }], // Cards that the user has received.
});

const User = mongoose.model('User', userSchema);
export default User;
