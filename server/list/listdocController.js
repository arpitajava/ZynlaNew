const List = require('./listdocEntity');
const userList = require('../users/userProfileEntity').userModel;
// const logger = require('./../../applogger');
const nodemailer = require('nodemailer');
// let host = 'localhost:8080';
let driver = require('../config/neo4j');
let session = driver.session();
let redis = require('redis');
let client = redis.createClient();
let listController = {
  getLikeStatus: function(req, res) {
  // console.log('router suggest ques');
  /* eslint-disable */
  console.log(req.body);
  // console.log('first',req.body.qids);
  // console.log('second check',req.body.qids);
    let queArray = req.body.qids;
    let mail = req.body.mail;
  let query = 'unwind '+queArray+' as idQues \
  match (n:User {name:"'+mail+'"})-[x:liked]->(q:Like)<-[:has]-(qu:Question) where id(qu)=idQues \
  return x,qu;';
  console.log(query);
  let likeQueIds = [];
  let unlikeQueIds = [];
  /* eslint-enable */
  session.run(query).then(function(result) {
      // console.log(result);
      let queObj = result.records;
      if (result.records.length !== 0) {
          for (let i = 0; i < queObj.length; i = i + 1) {
            /*eslint-disable*/
            likeQueIds.push(queObj[i]._fields[1].identity.low);
          }
          // res.send(likeQueIds);
      }
  }, function(err) {
      // console.log('error while connecting',err);
  });
  let query1 = 'unwind ' + queArray + ' as idQues \
  match (n:User {name:"'+mail+'"})-[x:unliked]->(q:Unlike)<-[:has]-(qu:Question) where id(qu)=idQues \
  return x,qu;';
  // console.log(query1);
  /* eslint-enable */
  session.run(query1).then(function(result) {
      // console.log(result);
      let queObj1 = result.records;
      if (result.records.length !== 0) {
          for (let i = 0; i < queObj1.length; i = i + 1) {
            /* eslint-disable */
            unlikeQueIds.push(queObj1[i]._fields[1].identity.low);
            /* eslint-enable */
          }
      }
      let a = {like: likeQueIds, unlike: unlikeQueIds};
      res.send(a);
  }, function() {
      // console.log('error while connecting',err);
  });
},
    addList: function(req, res) {
        // logger.debug('Inside list add post');
        let newList = new List({
            id: req.body.id,
            displayImage: req.body.displayImage,
            heading: req.body.heading,
            question: req.body.question,
            postedBy: req.body.postedBy,
            addedOn: req.body.addedOn,
            category: req.body.category,
            upVotes: req.body.upVotes,
            downVotes: req.body.downVotes,
            answerCounts: req.body.answerCounts,
            topCards: req.body.isAccepted,
            views: req.body.views,
            createdBy: req.body.topCards.createdBy,
            content: req.body.topCards.content,
            createdOn: req.body.topCards.createdOn,
            image: req.body.topCards.image,
            upVote: req.body.topCards.upVote,
            downVote: req.body.topCards.downVote,
            isAccepted: req.body.topCards.isAccepted
        });

        newList.save().then((doc) => {
            res.send(doc);
        }, (err) => {
            res.send(err);
        });
    },
    // written by Arun Mohan Raj
    // router function to display all questions
    viewList: function(req, res) {
        // logger.debug('Inside get');
        List.find().then((docs) => {
            res.send(docs);
        }, (err) => {
            res.send(err);
        });
    },
    // router for accepting the answer by user (by sumit on 14/3/2017 )
    UpdateAcceptans: function(req, res) {
        //  console.log('inside update accept', req.body);
        let id = req.body.id;
        let qid = req.body.questionId;
        let email = req.body.email;
        let query = '';
        /*eslint-disable*/
        query = 'match(n:Answer),\
                   (p:User {name:"' + email + '"}), \
                   (q:Question) \
                    where id(n)=' + id + ' and id(q)=' + qid + '\
                   create (n)-[:accepted_by]->(p), \
                   (q)-[:accept]->(n)';
        /*eslint-enable*/
        session.run(query).then(function(result) {
            if (result) {
                // console.log('id', id);
                List.update({
                    id: qid,
                    'topCards.id': id
                }, {
                    $set: {
                        'topCards.$.isAccepted': true
                    }
                }, function(err) {
                    if (err) {
                        // console.log("Something wrong when updating data!");
                    }
                    res.send('success');
                    // console.log(doc);
                });
            } else {
                // console.log("error in updating the like");
            }
        });
    },
    // Router for Getting question data from mongo db created by Aswini K
    getCardQuestion: function(req, res) {
        // console.log('Inside Ques get' + req.params.id);
        List.find({id: req.params.id}).then((docs) => {
            // console.log('inside route', JSON.stringify(docs));
            res.send(docs);
        }, (err) => {
            res.send('Cant get the docs', err);
        });
    },
    getIdWithQuestion: function(req, res) {
       let questionArray = [];
       List.find().then((docs) => {
           // console.log('inside route', JSON.stringify(docs));
           for(let i in docs) {
             /* eslint-disable */
             if(docs[i].heading !== undefined) {
               /* eslint-enable */
               questionArray.push({
                 qId: docs[i].id,
                 qName: docs[i].heading,
                 qDescription: docs[i].question,
                 qPostedBy: docs[i].postedBy,
                 qViews: docs[i].views
               });
             }
           }
           res.send(questionArray);
       }, (err) => {
           res.send('Cant get the docs', err);
       });
   },
    getQuestionIntent: function(req, res) {
      client.smembers('intents', function(error, reply) {
        if(error) {
          throw error;
     // console.log(error);
        }
        else {
          // console.log(reply);
          res.send(reply);
        }
      });
    },

    getconcepts: function(req, res) {
      client.smembers('concepts', function(error, reply) {
              if (error) {
                  throw error;
              //  console.log(error);
              }
              else {
                res.send(reply);
                // resCallback(reply);
              }
          });
    },
    // written by Arun Mohan Raj
    // function to display suggested questions
    suggestQues: function(req, res) {
        // console.log('router suggest ques');
        /* eslint-disable */
        let query = 'match(n:Question)-[r:question_of]-> (m:Concept) \
                       where id(n)=' + req.params.id + ' \
                      match (b:QuestionIntent{value:r.intent})-[z:same_as]->(a:QuestionIntent) \
                       -[:same_as]->(l:QuestionIntent) \
                      match (m)<-[:question_of {intent:a.value}]-(s:Question) \
                      match (m)<-[:question_of {intent:l.value}]-(u:Question) \
                      match q=(s)<-[:post]-(cv:User) \
                      return distinct q';
        /* eslint-enable */
        session.run(query).then(function(result) {
            // console.log(result);
            if (result) {
                // console.log('before result');
                res.send(result);
                // console.log('after result');
            }
        }, function() {
            // console.log('error while connecting',err);
        });
    },

    // router function to add a question
    addquestion: function(req, res) {
        req.body.heading = req.body.heading.charAt(0).toUpperCase() +
        req.body.heading.substring(1, req.body.heading.length);
        req.body.statement = req.body.statement.charAt(0).toUpperCase() +
        req.body.statement.substring(1, req.body.statement.length);
        let arr1 = JSON.parse(req.body.Concept);
        let arr = [];
        let c = 0;
        let max = 0;
        /*eslint-disable*/
        let imagesArray = [
            'http://www.phonefacts.co.uk/wp-content/uploads/2011/11/1-and-zeros.jpg',
            'http://maxpixel.freegreatpicture.com/static/photo/1x/Online-Digital-Mobile-Smartphone-Data-Computer-1231889.jpg',
            'http://maxpixel.freegreatpicture.com/static/photo/1x/Float-Hand-Keep-About-Ball-Binary-Ball-Binary-457334.jpg',
            'http://maxpixel.freegreatpicture.com/static/photo/1x/Gloomy-Cohesion-Watch-Dark-Responsibility-Darkness-1156942.jpg',
            'https://c1.staticflickr.com/9/8386/8493376660_8e17303a8d.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/IBM_Bluemix_logo.svg/1036px-IBM_Bluemix_logo.svg.png',
            'http://www.oppo.nl/files/2012/03/hd-abstracte-wallpaper-met-felle-kleuren-hd-abstracte-achtergrond.jpg',
            'https://c1.staticflickr.com/8/7570/15087405704_f571d14063_b.jpg',
            'http://maxpixel.freegreatpicture.com/static/photo/1x/Shape-Simple-Hex-Hexagonal-Abstract-Modern-675576.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Barnstar_-_technical_works.svg/2000px-Barnstar_-_technical_works.svg.png',
            'https://previews.123rf.com/images/dskdesign/dskdesign1204/dskdesign120400574/13241701-chemistry-teacher-writing-science-and-chemical-formula-on-whiteboard-Stock-Photo.jpg',
            'https://c1.staticflickr.com/9/8666/16203260320_3b7bc32962_b.jpg',
            'https://thumbs.dreamstime.com/x/abstract-technology-background-planet-white-backdrop-30605816.jpg',
            'https://c1.staticflickr.com/3/2080/2349225230_ef4e238caf.jpg',
            'https://c1.staticflickr.com/5/4078/4819055826_776b042f09_b.jpg',
            'http://theemon.com/wp-content/uploads/2015/11/Semantic.jpg',
            'https://react.semantic-ui.com/logo.png',
            'https://cdn.pixabay.com/photo/2015/06/28/09/36/email-824310_960_720.jpg'
        ];
        /*eslint-enable*/
        let randomNumber = Math.floor(Math.random() * imagesArray.length);
        // query to get all the concepts and find the base concept from the input provided
        let query1 = 'match (c:Concept) return c.name;';
        session.run(query1).then(function(result) {
            if (result) {
                for (let x in result.records) {
                    if (x !== null) {
                        /* eslint-disable */
                        arr.push(result.records[x]._fields[0]);
                        /* eslint-enable */
                    }
                    for (let i = 0; i < arr1.length; i = i + 1) {
                        /* eslint-disable */
                        for (let j = 0; j < arr.length; j = j + 1) {
                            if (arr1[i] === arr[j]) {
                                /* eslint-disable */
                                c = j;
                            }
                        }
                        if (max < c) {
                            max = c;
                        }
                    }
                }
                // query to post a question at a particular base tag
                /*eslint-disable*/
                console.log("-----------------------");
                console.log(req.body);
                let query = 'match (c:Concept), \
                            (u:User {name:"' + req.body.email + '"}) \
                            where c.name = "' + arr[max] + '" \
                            create (n:Question {Content:"' + req.body.statement + '",name:"' + req.body.heading + '"}), \
                            (n)-[:question_of{intent:"' + req.body.intent + '"}]->(c), \
                            (u)-[:post {on : timestamp()}]->(n), \
                            (l:Like {count:0}), \
                            (dl:Unlike {count:0}), \
                            (n)-[:has]->(l), \
                            (n)-[:has]->(dl) \
                            return n \
                            ';
                            console.log(query);
                /*eslint-enable*/
                session.run(query).then(function(result) {
                    console.log(result.records);
                    if (result) {
                        /*eslint-disable*/
                        let id = result.records[0]._fields[0].identity.low;
                        let date = new Date().getTime();
                        /*eslint-enable*/
                        let db = new List({
                            id: id,
                            category: req.body.Concept,
                            tags: req.body.Concept,
                            heading: req.body.heading,
                            question: req.body.statement,
                            displayImage: imagesArray[randomNumber],
                            profileImage: req.body.profilepicture,
                            addedOn: date,
                            upVotes: '0',
                            downVotes: '0',
                            answerCounts: '0',
                            postedBy: req.body.email,
                            status: {
                                open: true
                            },
                            topCards: [],
                            views: '0'
                        });
                        db.save(function(err) {
                            if (err) {
                                // res.send('Error:' + err);
                            } else {
                                // res.send('successfully posted');
                            }
                        });
                        userList.findOneAndUpdate({
                            emailId: req.body.email
                        }, {
                            $push: {
                                lists: {
                                    id: id,
                                    heading: req.body.heading,
                                    category: req.body.Concept,
                                    statement: req.body.statement,
                                    image: '',
                                    displayImage: imagesArray[randomNumber],
                                    addedOn: new Date().getTime(),
                                    upVote: '0',
                                    postedBy: req.body.email,
                                    acceptedCount: '0',
                                    downVote: '0'
                                }
                            }
                        }, {new: true}).then((doc) => {
                            res.send(doc);
                            // res.redirect('/#/home');
                        }, () => {
                            // res.send(err);
                        });
                    } else {
                        // logger.debug('error occurred');
                    }
                });
            }
        });
    },
    // Router for adding viwe count in mongo db created by Aswini K
    updateviews: function(req, res) {
        let id = req.body.id;
        // console.log("ID:" + id);
        List.findOneAndUpdate({
            id: id
        }, {
            $set: {
                views: req.body.views
            }
        }, {new: true}).then((doc) => {
            res.send(doc);
        }, (err) => {
            res.send(err);
        });
    },
    // Router for storing comments for question in mongo and neo4j created by Aswini K
    updatecomments: function(req, res) {
        let query = ' \
match (n:Question),\
(u:User {name:"' + req.body.mail + '" }) \
where id(n) = ' + req.body.questionId + ' \
create (m:Comment{name:"' + req.body.content + '"}), \
 (n)<-[:comment_of]-(m), \
(m)-[:commented_by{on : timestamp()}]->(u) \
return m';

        session.run(query).then(function(result) {
            // logger.debug(result);result.records[0]._fields[0].identity.low;
            console.log(result);
            if (result) {
                let id = result.records[0]._fields[0].identity.low;
                console.log("ID:" + id);
                List.findOneAndUpdate({
                    id: req.body.questionId
                }, {
                    $push: {
                        comment: {
                            id: id,
                            createdBy: req.body.createdBy,
                            content: req.body.content,
                            createdOn: new Date().getTime()
                        }
                    }
                }, {new: true}).then((doc) => {
                    console.log(doc);
                    res.send(doc);
                });
            } else {
                // logger.debug('error occurred');
                (err) => {
                    res.send(err);
                }
            }
        });
    },
    addanswerComment: function(req, res) {
      console.log('inside addanswer');
        let query = ' \
match (n:Answer),\
(u:User {name:"' + req.body.mail + '" }) \
where id(n) = ' + req.body.answerId + ' \
create (m:Comment{name:"' + req.body.content + '"}), \
(n)<-[:comment_of]-(m), \
(m)-[:commented_by{on : timestamp()}]->(u) \
return m';

        session.run(query).then(function(result) {
            // logger.debug(result);result.records[0]._fields[0].identity.low;
            console.log(result);
            res.send(result);
        });
    },
    inviteFrnds: function(req, res) {
        // router.post('/send', function handleSayHello(req, res) {
        // logger.debug(req.body.data);
        let transporter = nodemailer.createTransport({
            /*eslint-disable */
            service: 'Gmail',
            secure: false,
            auth: {
                user: 'geniegenie0001@gmail.com', // Your email id
                pass: 'genie123' // Your password
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        host = req.get('host');
        /*eslint-disable */
        //  // let hashVID = bcrypt.hashSync(profile[0].local.verificationID, 10);
        //  let VID = profile[0].generateHashVID(profile[0].local.verificationID);
        //  /*eslint-enable */
        //  VIDcheck = VID;
        //  // let linkEmail = profile[0].generateHashEmail(profile[0].local.email);
        //  logger.debug(VID + ' is the VID');
        //  link = 'http://' + req.get('host') + '/users/verify?id=' + VID + '&email=' + profile[0].local.email;
        let link = 'http://' + req.get('host') + '/users/invited?email=' + req.body.mail;
        let text = 'Hello from \n\n' + req.body.data;
        let mailOptions = {
            from: 'geniegenie0001@gmail.com', // sender address
            to: req.body.mail, // list of receivers
            subject: 'Invitation from Zynla', // Subject line
            text: text,
            html: '<center><h1>Welcome to Zynla</h1></center><br><br><br>' + 'Hi,<br><br>This is the invitation to join in zynla.' + '<br><br><br><a href=' + link + ' style=background-color:#44c767 ;' + '-moz-border-radius:28px;-webkit-border-radius:28px;border-radius:28px;' + 'border:1px solid #18ab29 ;display:inline-block;padding:16px 31px;' + 'color:#ffffff ;text-shadow:0px 1px 0px #2f6627 ;' + 'text-decoration:none;> Join </a><br><br>'
        };
        // logger.debug(mailOptions + host);
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                // logger.debug(error);
                // logger.debug('Error')
            } else {
                // logger.debug('Message sent: ' + info.response);
                res.json({yo: info.response});
            }
        });
    },
    //router for updating likes and dislikes for question by sumit(5/3/2017)
    likeStatus: function(req, res) {
        var id = req.body.id;
        var email = req.body.email;
        var data = {
            'like': false,
            'unlike': false
        };
        let query = 'match (n:Question)-[:has]->(l)<-[:liked]-(x:User) where id(n)=' + id + ' and x.name="' + email + '" return x;';
        session.run(query).then(function(result) {
            if (result) {
                if (result.records.length > 0) {
                    data.like = true;
                }
                query = 'match (n:Question)-[:has]->(l)<-[:unliked]-(x:User) where id(n)=' + id + ' and x.name="' + email + '" return x;';
                session.run(query).then(function(result1) {
                    if (result1) {
                        if (result1.records.length > 0) {
                            data.unlike = true;
                        }
                        res.send(data);
                    }
                });
            } else {
                console.log("error in updating the like");
            }
        });
    },
    //router of updating like for question by sumit(3/3/2017)
    updateLike: function(req, res) {
      console.log('inside update like', req.body);
      var id = req.body.id;
      var email = req.body.email;
      let query = "";
      if (req.body.type == 'add') {
          query = 'match(n:Question)-[:has]->(m:Like), \
                  (p:User {name:"' + email + '"})\
                  where id(n)=' + req.body.id + ' \
                  set m.count=' + req.body.upVotes + ' \
                  create (p)-[:liked]->(m) \
                  return m;';
      } else {
          query = 'match(n:Question)-[:has]->(m:Like)<-[x:liked]- \
                  (p:User {name:"' + email + '"})\
                  where id(n)=' + req.body.id + ' \
                  set m.count=' + req.body.upVotes + ' \
                  delete x \
                  return m;';
      }
      session.run(query).then(function(result) {
          if (result) {
              console.log('id', id);
              List.update(
                {
                  'id': id},{$set:{
                  'upVotes': req.body.upVotes
                  }
                }
          , function(docs) {
                  res.send("success");
              });
            } else {
              console.log("error in updating the like");
          }
      });
  },
  //router of updating unlike for question by sumit(4/3/2017)
  updateunlike: function(req, res) {
      var id = req.body.id;
      var email = req.body.email;
      let query = "";
      if (req.body.type == 'add') {
          query = 'match(n:Question)-[:has]->(m:Unlike), \
                  (p:User {name:"' + email + '"})\
                  where id(n)=' + req.body.id + ' \
                  set m.count=' + req.body.downVotes + ' \
                  create (p)-[:unliked]->(m) \
                  return m;';
      } else {
          query = 'match(n:Question)-[:has]->(m:Unlike)<-[x:unliked]- \
                  (p:User {name:"' + email + '"})\
                  where id(n)=' + req.body.id + ' \
                  set m.count=' + req.body.downVotes + ' \
                  delete x \
                  return m;';
      }
      session.run(query).then(function(result) {
          if (result) {
              // console.log('id', id);
              List.update({
                  'id': id},{$set:{
                  'downVotes': req.body.downVotes
                }
              }, function(docs) {
                  res.send("success");
              });
          } else {
              // console.log("error in updating the like");
          }
      });
  },
    getImages: function(req, res) {
        let query = 'match(n:Domain) return n.name';
        let arr = [];
        session.run(query).then(function(result) {
            console.log("result:" + result);
            for (let i in result.records) {
                if (i !== null) {
                    arr.push(result.records[i]._fields[0]);
                }
            }
            res.send(arr);
        }, function() {
            // console.log('error while connecting',err);
        });
    },
    // router for creating report created by Soundar
      createReport:function(req, res){
        let session = driver.session();
  let id = req.body.id;
  let email = req.body.email;
  let type = req.body.type;
  let query1 = 'match (n:User {name:"'+email+'"}),\
(q:Question),\
(n)-[x:report]->(q) where id(q)=' + id + ' \
return x;';
//         let query = 'match (n:User {name:"'+email+'"}), \
// (q:Question) where id(q)=' + id + ' \
// create (n)-[:reports {type:"'+type+'",on:timestamp()}]->(q) \
// return q;';

session.run(query1).then(function(result) {
   // logger.debug(result);result.records[0]._fields[0].identity.low;
   if(result.records.length > 0)
   {
     session.close();
     res.send("Already Reported");
   }
   else {
     let query = 'match (n:User {name:"'+email+'"}), \
     (q:Question) where id(q)=' + id + ' \
     create (n)-[:report {type:"'+type+'",on:timestamp()}]->(q) \
     return q;';
          session.run(query).then(function(result) {
            session.close();
            res.send("Reported...");
          });
   }

});
},
// router for checking whether the report is done created by Soundar
changePopup: function(req, res){
  let session = driver.session();
let id = req.body.id;
let email = req.body.email;
let query1 = 'match (n:User {name:"'+email+'"}),\
(q:Question),\
(n)-[x:report]->(q) where id(q)=' + id + ' \
return x;';
//         let query = 'match (n:User {name:"'+email+'"}), \
// (q:Question) where id(q)=' + id + ' \
// create (n)-[:reports {type:"'+type+'",on:timestamp()}]->(q) \
// return q;';

session.run(query1).then(function(result) {
// logger.debug(result);result.records[0]._fields[0].identity.low;
if(result.records.length > 0)
{
session.close();
res.send(result.records[0]._fields[0].properties.type);
}
else {
  {
    res.send("First Report");
  }
}
});
}
};
module.exports = listController;
