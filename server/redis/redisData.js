let driver = require('../config/neo4j');
const redis = require('redis');
let session = driver.session();
const client = redis.createClient();
let getDataFromNeo4j = {
  getConceptFromNeo4j: function(req, res) {
//  console.log('inside get concept from neo4j');
   let query = 'MATCH (n:Concept) RETURN n.name';
   let conceptArray = [];

   session.run(query).then(function(result) {
     // console.log('inside session',result);
       result.records.map(function(item) {
         /*eslint-disable*/
           conceptArray.push(item._fields[0]);
           /*eslint-enable*/
       });

       for (let i = 0; i < conceptArray.length; i = i + 1) {
           client.sadd([
               'concepts', conceptArray[i]
               /*eslint-disable*/
           ], function(err) {
               if (err) {
                   res.send('Error:' + err);
               } else {
                   // res.send(concepts);
               }/*eslint-enable*/
           });
       }
      // session.close();
      //  driver.close();
   }, function() {
    //  console.log('couldnt connect to neo', err);
    //  session.close();
    //  driver.close();
   });
},
getIntentFromNeo4j: function(req, res) {
 // console.log('inside get intent from neo4j');
  // let session = driver.session();
  // const client = redis.createClient();
  let query = 'match (q:QuestionIntent) return q.value;';
  session.run(query).then(function(result) {
      if (result) {
        // console.log(result.records);
          let intentArray = [];
           result.records.map(function(item) {
             /*eslint-disable*/
              intentArray.push(item._fields[0]);
              /*eslint-enable*/
          });
          for (let i = 0; i < intentArray.length; i = i + 1) {
              client.sadd([
                  'intents', intentArray[i]
              ], function(err) {
                  if (err) {
                      res.send('Error:' + err);
                      // session.close();
                      // driver.close();
                  } else {
                      // res.send('saved successfully');
                      // session.close();
                      // driver.close();
                  }
              });
          }
      }
   });
 }
};
module.exports = getDataFromNeo4j;
