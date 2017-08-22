const UserModel = require('../users/userProfileEntity').userModel;
// const // logger = require('./../../app// logger');
let driver = require('../config/neo4j');

let userDocController = {
  getuserAnsId: function(req, res) {
    let session = driver.session();
    /* eslint-disable */
    let query = 'match(n:User)-[r:post]->(a:Answer)-[:answer_of]->(q:Question) where n.name="' + req.body.email + '" return q';
    session.run(query).then(function(result) {
        let recordObj = result.records;
        // console.log(recordObj);
        let queArr = [];
        for (let i = 0; i < recordObj.length; i = i + 1) {
          queArr.push(recordObj[i]._fields[0].identity.low);
        }
        // console.log(queArr);
        res.send(queArr);
        /* eslint-enable */
    });
  },
    addUser: function(req, res) {
        // logger.debug('Inside user post');
        let newUser = new UserModel(req.body);
        newUser.save().then(() => {
            // console.log('Insertion success', doc);
            res.send('insertion success');
        }, (err) => {
            // console.logeg(err);
            res.send(err, 'not saved');
        });
    },
    updateEducation: function(req, res) {
        UserModel.update({
            emailId: req.body.emailId
        }, {
            $set: {
                'profile.education.primary': req.body.primary,
                'profile.education.highSchool': req.body.highSchool,
                'profile.education.university': req.body.university
            }
        }, function(err) {
            if (err) {
                res.send('Error:' + err);
            }
            else{
            res.send('Updated education successfully');
          }
        });
    },
    updateLocation: function(req, res) {
        UserModel.update({
            emailId: req.body.email
        }, {
            $set: {
                'profile.address.Line1': req.body.Line1,
                'profile.address.Line2': req.body.Line2,
                'profile.address.country': req.body.country,
                'profile.address.region': req.body.region,
                'profile.address.city': req.body.city,
                'profile.address.postalCode': req.body.postalCode
            }
        }, function(err) {
            if (err) {
                res.send('Error:' + err);
            }
            else{
            res.send('Updated location successfully');
          }
        });
    },
    updateProfile: function(req, res) {
        UserModel.update({
            emailId: req.body.email
        }, {
            $set: {
                'profile.picture': req.body.picture,
                'profile.description': req.body.description,
                'profile.dob': req.body.dob,
                'profile.gender': req.body.gender,
                'profile.phone': req.body.phone
            }
        }, function(err) {
            if (err) {
                res.send('Error:' + err);
            }else {
            res.send('Updated userinfo successfully');
          }
        });
    },
    updatePicture: function(req, res) {
        UserModel.update({
            emailId: req.body.email
        }, {
            $set: {
                'profile.picture': req.body.picture
            }
        }, function(err) {
            if (err) {
              // console.log('error');
                res.send('Error:' + err);
            }else {
              // console.log('success');
            res.send('Updated userinfo successfully');
          }
        });
    },
    getUserprofile: function(req, res) {
        UserModel.findOne({
            emailId: req.body.email
        }, function() {
            // console.log('comes');
        }).then((docs) => {
            res.send(docs);
        }, (err) => {
            res.send('Cant get the docs', err);
        });
    },
    getallusers: function(req, res) {
        UserModel.find(function(err, docs) {
            if (err) {
                res.send('Error:' + err);
            } else if (docs !== null) {
                res.send(docs);
                // res.send('Fetched restaurant successfully')
            } else {
                res.send('Read Users successfully');
            }
        });
    },
    getQuestions: function(req, res) {
        // console.log('Inside get');
        UserModel.findOne({
            emailId: req.body.email
        }, function() {
            //  // console.log('comes');
        }).then((docs) => {
          if(docs.lists.length === 0)
          {
            res.send('No Questions');
          }
          else{
            res.send(docs.lists);
          }
        }, (err) => {
            res.send('No Questions', err);
        });
    },
    getAnswers: function(req, res) {
        // console.log('Inside get');
        UserModel.findOne({
            emailId: req.body.email
        }, function() {
            // console.log('comes');
        }).then((docs) => {
          if(docs.answers.length === 0) {
            res.send('No Answers');
          }
          else{
            res.send(docs.answers);
          }
        }, (err) => {
            res.send('No Answers', err);
        });
    },
    getInterestedTopics: function(req, res) {
        UserModel.findOne({
            emailId: req.body.email
        }, function() {
            // console.log('comes');
        }).then((docs) => {
            res.send(docs.interestCategory);
        }, (err) => {
            res.send('Cant get the docs', err);
        });
    },
    getFollowers: function(req, res) {
      let session = driver.session();
      /*eslint-disable*/
            let query = 'match (n:User {name:"' + req.body.email + '"})<-[:follow]-(m:User) return m skip ' + req.body.skip + ' limit ' + req.body.limit;
            /*eslint-enable*/
            session.run(query).then(function(result) {
                // let id = result.records[0]._fields[0].identity.low;
                let foll = [];
                let temp = 0;
                let folldet = [];
                let len = result.records.length;
                if (len === 0) {
                  res.send(result.records);
                }
                  else{
                for (let i = 0; i < len; i = i + 1) {
                  /*eslint-disable*/
                    foll.push({'name': result.records[i]._fields[0].properties.name, 'id': result.records[i]._fields[0].identity.low});
                    /*eslint-enable*/
                }
                for (let j = 0; j < len; j = j + 1) {
                    let k = foll[j].name;
                    // let k = 'ragesh.1995@gmail.com';
                    // console.log(k);
                    UserModel.findOne({
                        emailId: k
                        /*eslint-disable*/
                    }, function(err,result1) {/*eslint-enable*/
                        // console.log(result);
                        folldet.push(result1);
                        temp = temp + 1;
                        if (temp === len) {
                          session.close();
                            res.send(folldet);
                        }
                    });
                }
            }
            });
        },
          getFollowings: function(req, res) {
        UserModel.findOne({
            emailId: req.body.email
        }, function(err, data) {
            if (err) {
                res.send('Error');
            } else {
                let followings = [];
                let temp = 0;
                let len = data.followingUser.length;
                if(len === 0) {
                  res.send('No Followings');
                }
                else{
                // console.log(data.followingUser);
                for (let i = 0; i < len; i = i + 1) {
                    // console.log(data.followingUser[i]);
                    UserModel.findOne({
                        emailId: data.followingUser[i]
                        //   id: 2
                        /*eslint-disable*/
                    }, function(err,result) {/*eslint-enable*/
                        // console.log(result);
                        followings.push(result);
                        temp = temp + 1;
                        if (temp === len) {
                            res.send(followings);
                        }
                    });
                }
              }
            }
        });
    },
    addProfile: function(req, res) {
      let p = JSON.parse(req.body.userProfile);
        UserModel.update({
            emailId: req.body.emailId
        }, {
            $set: {
                'profile.education.primary': p.education.primary,
                'profile.education.highSchool': p.education.highSchool,
                'profile.education.university': p.education.university,
                'profile.address.country': p.address.country,
                'profile.address.region': p.address.region,
                'profile.address.city': p.address.city,
                'profile.description': p.description,
                'profile.dob': p.dob,
                'profile.gender': p.gender,
                'profile.phone': p.phone,
                'profile.name': p.name
            }
        }, function(err) {
            if (err) {
                res.send('Error:' + err);
            }
            res.send('Updated Profile successfully');
        });
    },
    getWatchingTopics: function(req, res) {
      let session = driver.session();
      /*eslint-disable*/
      console.log(req.body);
            let query = 'match (n:User {name:"' + req.body.email + '"})-[:follow]->(u:Concept) return u;';
            /*eslint-enable*/
            let watch = [];
            session.run(query).then(function(result) {
                // let id = result.records[0]._fields[0].identity.low;
                  // console.log(result.records);
                  let len = result.records.length;
                  for (let i = 0; i < len; i = i + 1) {
                    /*eslint-disable*/
                      watch.push(result.records[i]._fields[0].properties.name);
                      console.log(watch[i]);
                      /*eslint-enable*/
                  }
                  session.close();
                  res.send(watch);
            });
        }
};

module.exports = userDocController;
