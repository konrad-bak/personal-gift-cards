import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of recipient IDs
  imageUrl: { type: String }, // URL of the uploaded image
});

const Card = mongoose.model('Card', cardSchema);
export default Card;
