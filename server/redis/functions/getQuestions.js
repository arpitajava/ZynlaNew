let redis = require('redis');
let client = redis.createClient();

module.exports = function (resCallback) {
  client.hgetall('questions', function(error, reply) {
    if(error) {
      throw error;
      // console.log(error);
    }
  else{
   // console.log(reply)
    resCallback(reply);
  }
  });
};
