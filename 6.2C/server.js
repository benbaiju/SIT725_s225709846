var express = require('express');
var path = require('path');
var app = express();
var port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function compute(a, b, op) {
  var x = Number(a) || 0;
  var y = Number(b) || 0;
  if (op === 'add') return x + y;
  if (op === 'subtract') return x - y;
  if (op === 'multiply') return x * y;
  if (op === 'divide') return y === 0 ? 'Error: divide by zero' : x / y;
  if (op === 'square') return x * x;
  return 0;
}

function sendTwoQueryNumbers(req, res, op) {
  var a = req.query.a;
  var b = req.query.b;
  if (a === undefined || b === undefined) {
    return res.status(400).send('Missing parameters');
  }
  var x = Number(a);
  var y = Number(b);
  if (isNaN(x) || isNaN(y)) {
    return res.status(400).send('Invalid number');
  }
  var result = compute(a, b, op);
  res.send(result.toString());
}

function sendOneQueryNumber(req, res, op) {
  var a = req.query.a;
  if (a === undefined) {
    return res.status(400).send('Missing parameters');
  }
  var x = Number(a);
  if (isNaN(x)) {
    return res.status(400).send('Invalid number');
  }
  var result = compute(a, 0, op);
  res.send(result.toString());
}

app.get('/add', function (req, res) {
  sendTwoQueryNumbers(req, res, 'add');
});

app.get('/subtract', function (req, res) {
  sendTwoQueryNumbers(req, res, 'subtract');
});

app.get('/multiply', function (req, res) {
  sendTwoQueryNumbers(req, res, 'multiply');
});

app.get('/divide', function (req, res) {
  sendTwoQueryNumbers(req, res, 'divide');
});

app.get('/square', function (req, res) {
  sendOneQueryNumber(req, res, 'square');
});

app.post('/calculate', function (req, res) {
  var a = req.body.a;
  var b = req.body.b;
  var op = (req.body.op || '').toLowerCase();
  var result = compute(a, b, op);
  res.send(result.toString());
});

app.listen(port, function () {
  console.log('App listening on port ' + port);
});
