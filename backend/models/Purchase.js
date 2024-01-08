import { Schema, model, models } from 'mongoose';

const bookingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tickets: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  ],
  totalPrice: { type: Number, required: true },
});

const Booking = models.Booking || model('Booking', bookingSchema);

module.exports = Booking;
