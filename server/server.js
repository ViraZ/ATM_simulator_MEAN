require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const moment = require('moment');


var {mongoose} = require('./db/mongoose');
var {Atm} = require('./models/atm');
var {Card} = require('./models/cards');
var {Transaction} = require('./models/transaction');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.post('/cards', (req, res) => {
  var card = new Card({
    card_number: req.body.card_number,
    pin: req.body.pin,
    balance: req.body.balance    
  });

  card.save().then((cards) => {
    res.send(cards);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/cards', (req, res) => {
  Card.find().then((cards) => {
    res.send({cards});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/cards/:cardNum', (req, res) => {
  Card.findOne({card_number: req.params.cardNum}).then((cards) => {
    res.send({
      cards
    });
  }, (e) => {
    res.status(400).send(e);
  });
});

app.post('/transactions', (req, res) => {
  var transaction = new Transaction({
    debit_amt: req.body.debit_amt,
    debit_date: moment().format('MMMM Do YYYY, h:mm:ss a')
  });

  transaction.save().then((transaction) => {
    res.send(transaction);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/transactions', (req, res) => {
  Transaction.find().then((transaction) => {
    res.send({transaction}
    );
  }, (e) => {
    res.status(400).send(e);
  });
});

app.post('/atm', (req, res) => {
  var atm = new Atm(
    {
      2000: req.body.twothousands,
      500: req.body.fivehundreds,
      100: req.body.hundreds
  });
  atm.save().then((atm) => {
    res.send(atm);
  }, (e) => {
    res.status(400).send(e);
  });
});



app.get('/atm', (req, res) => {
  Atm.find().then((atm) => {
    res.send({
      atm
    });
  }, (e) => {
    res.status(400).send(e);
  });
});

app.patch('/cards/:cardNum', (req, res) => {
  var cardNum = req.params.cardNum;
  console.log(req.body.balance);
  
  var body = _.pick(req.body, ['balance']);   //multi true kar
  Card.findOneAndUpdate({ card_number: cardNum }, { $set: body}, {new: true}).then((atm) => {
    if (!atm) {
      return res.status(404).send();
    }
    res.send({atm});
  }).catch((e) => {
    res.status(400).send();
  })
});

app.patch('/atm', (req, res) => {
  var body = _.pick(req.body, ['hundreds', 'fivehundreds', 'twothousands']);
  console.log(req.body); 
  const upDateBody = {
    '100': req.body.hundreds,
    '500': req.body.fivehundreds,
    '2000': req.body.twothousands
  };
  console.log(upDateBody);
  Atm.findByIdAndUpdate({'_id': '5afb339fd670be16f4d01b28' }, {$set: upDateBody},{ upsert: true, new: true }) // kidhar ??wait
    .then((atm) => {
      if (!atm) {
        return res.status(404).send();
      }
      res.send({
        atm
      });
    }).catch((e) => {
      res.status(400).send();
    })
});


// POST /login {card_number, pin}
// app.get('/login', (req, res) => {
//   var body = _.pi(req.body, ['card_number', 'pin']);
//   if (body.card_number) {
//     Card.findOne(body).then((user) => {
//       if (!user) {
//         return res.status(404).send();
//       }
//       res.send({ user });
//     }).catch((e) => {
//       res.status(400).send();
//     }
// });

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
