const mongoose = require('mongoose');
const { Schema, model, models } = mongoose;
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
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const Concert = models.Concert || model('Concert', concertSchema);

module.exports = Concert;


