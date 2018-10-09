var express = require('express');
var app = express();

var scraper = require('product-scraper');

const redis = require('redis');
const bluebird = require("bluebird");

// make node_redis promise compatible
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

//connect to Redis
const client = redis.createClient({ "host": "127.0.0.1", "port": "6379" });
client.on('connect', () => {
    console.log(`connected to redis`);
});
client.on('error', err => {
    console.log(`Error: ${err}`);
});

app.get('/check', function (req, res) {
  //res.send('Hello World');

  // check redis first to see if the product details is available
  client.hgetall('B002QYW8LW', function(err, object) {

    console.log(object);
    console.log('err: '  + err);
    console.log('object: '+ JSON.stringify(object));

    if (err || err == null || object == null) {

      // call product api
      scraper.init('https://www.amazon.com/gp/product/B002QYW8LW/', function(data){
          console.log(data);

          // save to redis
          client.hmset('B002QYW8LW', {'price': data.price, 'title': data.title});

          // display
          return res.json(data);

      });

    } else {
      return res.json(object);
    }

  });
});

app.listen(3000, function () {
  console.log('App listening on port 3000!');
});
