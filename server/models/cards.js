var mongoose = require('mongoose');

var Card = mongoose.model('Card', {
  card_number: {
    type: String,
    required: true,
    minlength: 16,
    trim: true
  },
  pin: {
      type: Number,
      required: true,
      minlength: 4
  },
  balance: {
      type: Number,
      required: true,
  }
});

module.exports = {Card};
