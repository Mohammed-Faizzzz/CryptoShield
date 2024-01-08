import { Schema, model, models } from 'mongoose';

const concertSchema = new Schema({
  organiser: { 
      type: Schema.Types.ObjectId,
      ref: 'User', 
      required: true 
  },
  venue: { type: String, required: true },
  date: { type: Date, required: true },
  tickets: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  ],
});

const Concert = models.Concert || model('Concert', concertSchema);

module.exports = Concert;


