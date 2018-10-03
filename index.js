var express = require('express');
var app = express();

const redis = require('redis');
const bluebird = require("bluebird");

// make node_redis promise compatible
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

// connect to Redis
const client = redis.createClient();
client.on('connect', () => {
    console.log(`connected to redis`);
});
client.on('error', err => {
    console.log(`Error: ${err}`);
});

app.post('/{productId}', function (req, res) {

  // assume the details is returned from the Amazon Product API call
  res.data.productDetails = {'category': 'electric', 'rate': ''};

  // save to redis
  client.hmsetAsync(productId, res.data.productDetails)
                    .catch(e => console.log(e));

  // display
  return res.json(res.data.productDetails);

});
app.listen(3000, function () {
  console.log('App listening on port 3000!');
});
