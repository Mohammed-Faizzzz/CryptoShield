import { Schema, model, models } from 'mongoose';

const ticketSchema = new Schema({
  concert: {
    type: Schema.Types.ObjectId,
    ref: 'Concert',
    required: true,
  },
  seatNumber: { type: String, required: true },
  price: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
});

const Ticket = models.Ticket || model('Ticket', ticketSchema);

module.exports = Ticket;
