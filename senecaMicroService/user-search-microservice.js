const userAddMicroservice = require('seneca')({timeout: 99999});
const List = require('../server/list/listdocEntity');
const userList = require('../server/users/userEntity');
const userProfileList = require('../server/users/userProfileEntity').userModel;
let driver = require('./config/neo4j');
var mongoose= require('mongoose');

const masterMongoDBName = process.env.APP_DB || 'zynla';

const mongo = {
  host: process.env.MONGO_HOST || '127.0.0.1',
  port: process.env.MONGO_PORT || 27017
};

const mongoURL = ('mongodb://' + mongo.host + ':' + mongo.port + '/' +
  masterMongoDBName);

mongoose.connect(mongoURL,function (error){
if(error){
   console.log(error);
}
});
var db=mongoose.connection;
db.on('error',console.error.bind(console,'Conection Error..!!!!!!'));
db.once('open',function(){
    console.log("Connection eatablished to MongoDB Successfully"+mongoURL);
});
userAddMicroservice.add({role:'search',cmd:'searchuser'},
	function(msg, done) {

 console.log("Inside Microservice"+msg.question);
/*Neo4j COde */
let session = driver.session();
let query = 'match (n:Concept {name:"' + msg.question + '"})<-[:follow]-(u:User) return u';
session.run(query).then(function(result) {
		let arr = [];
		for (let x = 0; x < result.records.length; x = x + 1) {
				/* eslint-disable */
				let y = result.records[x]._fields[0].properties.name;
				/* eslint-enable */
				arr.push(y);
		}
		session.close();
		console.log()
		done(arr);
}).catch(function() {
		done(['abc', 'def', 'xyz']);
});
  })
	userAddMicroservice.add({role:'get',cmd:'getuserprofile'},
		function(msg, done) {

	 console.log("Inside Microservice"+msg.question);
        let session = driver.session();
        let query = 'match (n:Concept {name:"' + msg.question + '"})<-[:follow]-(u:User) return u';
        session.run(query).then(function(result) {
            console.log('connected');
            let arr = [];
            for (let x = 0; x < result.records.length; x = x + 1) {
                /* eslint-disable */
                let y = result.records[x]._fields[0].properties.name;
                /* eslint-enable */
                arr.push(y);
            }
            console.log(arr);
           userList.find({
                email: {
                    $in: arr
                }
            }).then((docs) => {
               done(docs);
                session.close();
            });
        }).catch(function(err) {
						console.log(err);
            userList.find().then((docs) => {
                done(docs);
                session.close();
            });
        });
 })
 userAddMicroservice.add({role:'get',cmd:'getConcepts'},
	 function(msg, done) {

	console.log("Inside Microservice"+msg.concept);

 let query = 'match (n)<-[r]-(m:Concept) where n.name="' + msg.concept + '" return m';
 let session = driver.session();
 session.run(query).then(function(result) {
		 let json = [];
		 for (let x = 0; x < result.records.length; x = x + 1) {
				 /* eslint-disable */
				 let y = result.records[x]._fields[0].properties.name;
				 let i = result.records[x]._fields[0].Image;
				 /* eslint-enable */
				 json.push({name: y, image: i});
		 }
		 done(json);
		 session.close();
 });
})
userAddMicroservice.add({role:'get',cmd:'followUser'},
	function(msg, done) {

 console.log("Inside Microservice"+msg.id);


 let session = driver.session();
 /* eslint-disable */
 let query = 'match(n:User {name:"' + msg.id + '"}),\
          (m:User {name:"' + msg.emailId + '"})\
          create (n)-[:follow]->(m)\
          return n,m;';
 /* eslint-enable */
 session.run(query).then(function() {
     userProfileList.findOneAndUpdate({
     emailId: msg.id
 }, {
     $push: {
         followingUser: msg.emailId
     }
 }, {new: true}).then(() => {
  //   res.send('following user added');
 }, (err) => {
  //   res.send(err);
 });
 userProfileList.findOneAndUpdate({
 emailId: msg.emailId
}, {
 $inc: {
     followerCount: 1
 }
}, {new: true}).then(() => {
 // res.send('followerCount Incremented');
}, (err) => {
 // res.send(err);
});
     session.close();
     let result = {'result':'success'}
     done(result);
 });
})
userAddMicroservice.add({role:'get',cmd:'isFollow'},
	function(msg, done) {

 console.log("Inside Microservice"+msg.name);
let query = 'match (n:User {name:"' + msg.name + '"})-[:follow]->(m:User) return m';
let session = driver.session();
session.run(query).then(function(result) {
		let namearr = [];
		for (let x = 0; x < result.records.length; x = x + 1) {
				/* eslint-disable */
				console.log(result.records[x]._fields[0].properties.name);
				let name = result.records[x]._fields[0].properties.name;
				/* eslint-enable */
				namearr.push(name);
		}
		let array = msg.emailArray;
		let follow = [];
		for (let received of array) {
			let temp = false;
			for(let mail of namearr) {
				if(received === mail) {
					temp = true;
				}
			}
			if(temp) {
				follow.push({emailId: received, follow: true});
			}
			else {
				follow.push({emailId: received, follow: false});
			}
		}
		session.close();
		done(follow);
});
})
userAddMicroservice.add({role:'get',cmd:'getQuestions'},
	function(msg, done) {

 console.log("Inside Microservice"+msg.q);
let session1 = driver.session();
let query = 'match (n:Concept)<-[r:question_of]-(m:Question) where n.name=~"(?i)' + msg.q + '" return m';
console.log('Neo4j Query:'+query);
session1.run(query).then(function(result) {
		let arr = [];
		for (let x = 0; x < result.records.length; x = x + 1) {
				/* eslint-disable */
				let y = result.records[x]._fields[0].identity.low;
				/* eslint-enable */
				arr.push(y);
		}
		const arrobj = [];
		console.log(arr);
		List.find({
				id: {
						$in: arr
				}
		}).then((docs) => {
				arrobj.push(docs);
				console.log("userAddMicroservice"+docs);
				done(docs);
				session1.close();
		});
}).catch(function(err) {
	console.log(err);
		List.find().then((docs) => {
			arrobj.push(docs);
			console.log("userAddMicroservice"+docs);
			done(docs);
			session1.close();
	});
});
session1.close();
})
userAddMicroservice.add({role:'get',cmd:'isFollowTopic'},
	function(msg, done) {

 console.log("Inside Microservice"+msg.q);
 let arr = [];
let query = 'match (n:User {name:"' + msg.name + '"})-[r:follow]->(m:Concept {name:"' + msg.q + '"}) return r';
/* eslint-enable */
let session = driver.session();
session.run(query).then(function(result) {
		session.close();
		if(result.records.length > 0) {
			done({follow: true});
		}
		else {
			done({follow: false});
		}
});
})
userAddMicroservice.add({role:'do',cmd:'followTopic'},
	function(msg, done) {

 console.log("Inside Microservice"+msg.id);
let session = driver.session();
/* eslint-disable */
let query ='match(n:User {name:"' + msg.id + '"}),(m:Concept {name:"' + msg.concept + '"}) create (n)-[:follow]->(m) return n,m'
/* eslint-enable */
session.run(query).then(function() {
			 session.close();
			done({'result':'success'});
	});
	})
/*ToDO: Move IP and Port to config*/
userAddMicroservice.listen({host: '127.0.0.1', port: '3000'});
