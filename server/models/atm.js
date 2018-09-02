var mongoose = require('mongoose');

var Atm = mongoose.model('Atm', {
  '2000': {
    type: Number
  },
  '500': {
    type: Number
  },
  '100': {
    type: Number
  },
  count: {
    type: Number
  }
});

module.exports = {
  Atm
};