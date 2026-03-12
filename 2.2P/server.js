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

app.get('/add', function(req, res){
    var a = req.query.a;
    var b = req.query.b;
    var result = compute(a, b, 'add');
    res.send(result.toString());
});

app.get('/subtract', function(req, res){
    var a = req.query.a;
    var b = req.query.b;
    var result = compute(a, b, 'subtract');
    res.send(result.toString());
});

app.get('/multiply', function(req, res){
    var a = req.query.a;
    var b = req.query.b;
    var result = compute(a, b, 'multiply');
    res.send(result.toString());
});

app.get('/divide', function(req, res){
    var a = req.query.a;
    var b = req.query.b;
    var result = compute(a, b, 'divide');
    res.send(result.toString());
});

app.get('/square', function(req, res){
    var a = req.query.a;
    var result = compute(a, 0, 'square');
    res.send(result.toString());
});

app.post('/calculate', function(req, res){
    var a = req.body.a;
    var b = req.body.b;
    var op = (req.body.op || '').toLowerCase();
    var result = compute(a, b, op);
    res.send(result.toString());
});

app.listen(port, function () {
  console.log('App listening on port ' + port);
});
