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
    app.listen(3000, function() {
      console.log('listening on 3000')
    });
  }
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/populate', function(req, res) {
  db.collection('quotes').remove();
  var quotes = require('./quotes.json');
  db.collection('quotes').insert(quotes, function(err, result) {
    res.send("DONE! " + result);
  })
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

app.get('/background.png', function(req, res) {
  res.sendFile(__dirname + '/background.png');
});
