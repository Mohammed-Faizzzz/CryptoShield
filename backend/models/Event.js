const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  organiserName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  organiserXrplWallet: {
    address: {
      type: String,
      required: true,
    },
  },
  numberOfTickets: {
    type: Number,
    required: true,
  },
  ticketPrice: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Event', EventSchema);
