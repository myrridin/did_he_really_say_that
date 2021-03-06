const express = require('express');
const app = express();
const mongo = require('mongodb');

const MongoClient = require('mongodb').MongoClient;

var db;
MongoClient.connect('mongodb://dhrst:dhrst@ds053176.mlab.com:53176/dhrst', function(err, database) {
  if (err) {
    return console.log(err)
  }
  else {
    db = database;
    app.listen(process.env.PORT || 3000, function() {
      db.collection('quotes').remove();
      var quotes = require('./quotes.json');
      db.collection('quotes').insert(quotes);
    });
  }
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/quote', function(req, res) {
  db.collection('quotes').aggregate([{$sample: {size: 1}}]).toArray(function(err,items){
    if(err) {
      console.log("ERROR", err);
        res.send({});
    }
    else {
      res.send(items[0]);
    }
  });
});

app.get('/submit', function(req, res) {
  console.log(req.query.name, req.query.score);
  db.collection('scores').insertOne({
    name: req.query.name,
    score: req.query.score
  });
  res.send("Score submitted!");
});

app.get('/scores', function(req, res) {
  db.collection('scores').find().sort({score: -1}).toArray(function(err, items) {
    res.send(items);
  });
});

app.get('/background.png', function(req, res) {
  res.sendFile(__dirname + '/background.png');
});
