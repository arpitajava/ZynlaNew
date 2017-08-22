'use strict';
const UserProfile = require('../users/userProfileEntity').userModel;
const ListDoc = require('../list/listdocEntity');
const sentInviteMail = require('../function/sentInviteMail');
const sentTopicInviteMail = require('../function/sentTopicInviteMail');
let driver = require('../config/neo4j');
let host;

let inviteCtrl = {
sendInviteEmail: function (req, res) {
        // console.log(req.body.data);
        // console.log(req.body.questionId);
        // console.log(req.body.emailId);
        // console.log(req.body.senderName);
        let questionName;
        ListDoc.find({
            id: req.body.id
        }, function(err, docs) {
            if (err) {
                res.send(err);
              //  console.log('error ocuured');
            } else {
                // console.log(docs);
                questionName = docs[0].heading;
                host = req.get('host');
        sentInviteMail(host, req.body.id, req.body.type,
            req.body.emailId, req.body.sender, req.body.lStatus, questionName);
        res.send('Invite send successfully');
            }
        });
    },
followQuestion: function(req, res) {
        let questionId = req.query.id;
        let email = req.query.email;
        let lStatus = req.query.lstatus;
        // console.log('emaillllllll',email);
        // console.log('questionIdddddd',questionId);
        UserProfile.find({
            emailId: req.query.email
        }, function(err) {
            if (err) {
                res.send(err);
                // console.log('error occured');
            } else {
                // console.log(req.protocol + ':/' + req.get('host') + ':' + ('http://' + host));
                    // console.log('Domain is matched. Information is from Authentic email');
                    // console.log('Question Id', parseInt(questionId, 10));
                    let qId = parseInt(questionId, 10);
                    ListDoc.findOne({id: qId}, function(error, question)
                    {
                        // console.log(question);
                        // let isQuesPresent = false;
                        // UserProfile.findOne({emailId: email}, function(error1, user)
                        // {
                        // // console.log('user',user);
                        // user.watchingList.map(function(item)
                        // {
                        //     // console.log('type of question id   ',typeof(questionId));
                        //     // console.log('type of item.id   ',typeof(item.id));
                        //     if(item.id === qId)
                        //     {
                        //         isQuesPresent = true;
                        //     }
                        // });
                         let session = driver.session();
                        /* eslint-disable */
                        console.log('in ques');
                        let query = 'match (n:User {name:"' + email + '"})-[r:follow]->(m:Question) where id(m)='+qId+' return r';
                        // console.log(query);
                        /* eslint-enable */
                        session.run(query).then(function(result) {
            //  console.log(result.records.length);
            if(result.records.length === 0)
            {
                //  console.log('Question is not present');

            /* eslint-disable */
            let query = 'match (n:User {name:"' + email + '"}), (q:Question) where id(q)=' + qId + ' create (n)-[:follow]->(q);';
            // console.log(query);
            /* eslint-enable */
            session.run(query).then(function() {
// console.log('updated to neo4j');
});
            session.close();
            // console.log(question);
            UserProfile.findOneAndUpdate({
                    emailId: req.query.email
                }, {
                    $push: {
                        watchingList: {
                            id: question.id,
                            displayImage: question.displayImage,
                            heading: question.heading,
                            statement: question.question,
                            postedBy: question.postedBy,
                            profileImage: question.profileImage,
                            addedOn: question.addedOn,
                            category: question.category,
                            upVotes: question.upVotes,
                            downVotes: question.downVotes,
                            noofans: question.answerCounts
                        }
                    }
                }, {new: true}).then(() => {
                    //  console.log(docs);
                }, (error2) => {
                    res.send(error2);
                });
            }
            else
            {
                // console.log('question is already present');
            }
        });
                  });
                    // });
                        // console.log('Logged in status',lStatus);
                        if(lStatus === 'true')
                          {
                               res.redirect('/#/answerPage?id=' + qId);
                          }
                          else
                          {
                          res.cookie('quesId', qId);
                          res.redirect('/#/');
                          }
            }
        });
    },
    sendInviteTopicEmail: function (req, res) {
                  host = req.get('host');
                    sentTopicInviteMail(host, req.body.Topic, req.body.type,
                req.body.emailId, req.body.sender, req.body.lStatus);
            res.send('Invited Successfully');
        },
        followTopic: function (req, res) {
          // console.log("In followTopic")
          /* eslint-disable */
          let query = 'match (n:User {name:"' + req.query.email + '"})-[r:follow]->(m:Concept {name:"' + req.query.topic + '"}) return r';
          /* eslint-enable */
          let follow = '';

          let lStatus1 = req.query.lstatus;
          let topic = req.query.topic;
            // console.log(typeof lStatus1);
          let session = driver.session();
          session.run(query).then(function(result) {
              session.close();
              if(result.records.length > 0) {
                follow = 't';
              }
              else {
                follow = 'f';
              }
              if(follow === 'f')
              {
                // console.log('in f');
              let sessionTemp = driver.session();
              /* eslint-disable */
              let query ='match(n:User {name:"' + req.query.email + '"}),(m:Concept {name:"' + req.query.topic + '"}) create (n)-[:follow]->(m) return n,m'
              console.log(query);
              /* eslint-enable */
              sessionTemp.run(query).then(function() {
                    // console.log("created relation")
                     sessionTemp.close();
                });
              }
          });

          if(lStatus1 === 'true')
          {
            // console.log('true');
               res.redirect('/#/search?question=' + topic);
          }
          else
          {
            // console.log('in false');
          // res.cookie('quesId');
          res.redirect('/#/');
          }
        }

};

module.exports = inviteCtrl;
