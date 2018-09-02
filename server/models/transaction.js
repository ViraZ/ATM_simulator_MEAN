var mongoose = require('mongoose');

var Transaction = mongoose.model('Transaction', {
  debit_amt: {
   type: String,
    default: null,
    required: true
  },
  debit_date: {
     type: String
  }
});

module.exports = {Transaction};
