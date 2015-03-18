var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var url = require('url');
var mongo = require('mongodb');
var app = express();
var options = {
  host: '127.0.0.1',
  key: fs.readFileSync('ssl/server.key'),
  cert: fs.readFileSync('ssl/server.crt')
};
http.createServer(app).listen(80);
https.createServer(options, app).listen(443);

function isEmpty(str) {
  return (!str || 0 === str.length);
}

app.use(express.bodyParser());

app.use('/', express.static('./public', {
  maxAge: 60 * 60 * 1000
}));

app.post('/test', function(req, res){
  console.log(req.body.data.json);
  res.writeHead(200);
  res.end("");
});

app.get('/getcity', function(req, res) {
      var urlObj = url.parse(req.url, true, false);
        fs.readFile("cities.dat.txt", function(err, data) {
          if (err) {
            res.writeHead(200);
            res.end("There was an error getting your cities...")
          } else {
            var resultArray = [];
            if (!isEmpty(urlObj.query["q"])) {
              var cities = data.toString().split('\n');
              var myRe = new RegExp("^" + urlObj.query["q"]);
              for (i = 0; i < cities.length; i++) {
                var result = cities[i].search(myRe);
                if (result != -1) {
                  var obj = {
                    "city": cities[i]
                  }
                  resultArray.push(obj);
                }
              }
            }
            res.writeHead(200);
            res.end(JSON.stringify(resultArray));
          }
        });
      });

    app.post('/comment', function(req, res) {
      var jsonData = "";
      req.on('data', function(chunk) {
        jsonData += chunk;
      });
      req.on('end', function() {
        var reqObj = JSON.parse(jsonData);
        var mongo_client = mongo.MongoClient;
        mongo_client.connect("mongodb://localhost/weather", function(err, db) {
          if (err) {
            console.log("error");
          } else {
            db.collection('comments').insert(reqObj, function(err, records) {
              res.writeHead(200);
              res.end("");
            });
          }
        });
      });
    });

    app.get('/comment', function(req, res) {
      var mongo_client = mongo.MongoClient;
      mongo_client.connect("mongodb://localhost/weather", function(err, db) {
        if (err) {
          console.log("error");
        } else {
          db.collection("comments", function(err, comments) {
            comments.find(function(err, items) {
              items.toArray(function(err, item_array) {
                res.writeHead(200);
                res.end(JSON.stringify(item_array));
              });
            });
          });
        }
      });
    });
