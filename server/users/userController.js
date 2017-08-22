'use strict';
const logger = require('./../../applogger');

const User = require('./userEntity');
const UserProfile = require('./userProfileEntity').userModel;
const ListEntity = require('../list/listdocEntity');
const nodemailer = require('nodemailer');
let driver = require('../config/neo4j');
let session = driver.session();
/*eslint-disable */
var rand,
    mailOptions,
    host,
    link,
    VIDcheck;
/*eslint-enable */

let userCtrl = {

    // Login
    logIn: function(req, res) {
        res.cookie('username', req.user.name);
        res.cookie('authType', req.user.authType);
        res.cookie('profilepicture', req.user.photos);
        res.cookie('email', req.user.email);
        res.send(req.user);
    },

    // SEND EMAIL
    sendEmail: function(req, res) {
        // console.log(req.body.data);
        // console.log(req.body.data);
        User.find({
            email: req.body.data
        }, function(err, profile) {
            if (err) {
                res.send(err);
                //  console.log('error ocuured');
            } else {
                /*eslint-disable */
                // Create a Nodemailer transport object
                var transporter = nodemailer.createTransport({
                    /*eslint-disable */
                    service: 'Gmail',
                    secure: true,
                    auth: {
                        user: 'zynla0001@gmail.com', // Your email id
                        pass: 'Zynla@123' // Your password
                    }
                });

                host = req.get('host');
                console.log(profile);
                /*eslint-disable */
                // var VID = User.generateHashVID(profile[0].verificationID);
                var VID = profile[0].verificationID
                /*eslint-enable */
                VIDcheck = VID;
                console.log(VID + ' is the VID');
                // link = 'http://' + req.get('host') + '/users/verify?id=' + VID + '&email=' + profile[0].email;
                var text = 'Hello from \n\n' + req.body.data;
                mailOptions = {
                    from: 'zynla0001@gmail.com', // sender address
                    to: profile[0].email, // reciever
                    subject: 'Verify your Email with Zynla', // Subject line
                    text: text,
                    html: '<p style="color: rgb(0, 0, 0); font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 11px;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;<img alt="" data-mce-src="logo" height="50" src="../../webclient/image/logo.png" width="50" /></p>'+

'<h2 style="color: rgb(0, 0, 0); font-family: Verdana, Arial, Helvetica, sans-serif;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Welcome To Zynla</h2>'+

'<h2 style="color: rgb(0, 0, 0); font-family: Verdana, Arial, Helvetica, sans-serif;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Please Enter the below code to to get Verified with Zynla&nbsp;</h2>'+

'<h3 style="color: rgb(0, 0, 0); font-family: Verdana, Arial, Helvetica, sans-serif;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;<span data-mce-style="text-decoration: underline; background-color: #00ffff;" style="text-decoration: underline; background-color: rgb(0, 255, 255);">&nbsp;'+VID+'</span></h3>'+

'<h3 style="color: rgb(0, 0, 0); font-family: Verdana, Arial, Helvetica, sans-serif;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<strong>&nbsp;Note</strong>: This is an auto generated mail Please do not respond to this Mail.</h3>'
                };
                console.log(mailOptions + host);
                // Sent mail to recipient
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                        console.log('Error')
                    } else {
                        console.log('Message sent: ' + info.response);
                        res.send({email: req.body.data});
                    }
                });
            }
        });

    },

    // LOCAL SIGN UP
    signUp: function(req, res) {
        let newUser = new User();
        let newUserProfile = new UserProfile();
        String.prototype.capitalizeFirstLetter = function() {
            return this.charAt(0).toUpperCase() + this.slice(1);
        }
        rand = Math.floor(Math.random() * 899999 + 100000);
        newUser.verificationID = rand;
        // newProfileUser.id = rand;
        newUserProfile.emailId = req.body.email;
        newUser.name = (req.body.firstName.toLowerCase().capitalizeFirstLetter() + ' ' + req.body.lastName.toLowerCase().capitalizeFirstLetter());
        newUser.email = req.body.email;
        // newProfileUser.emailId = req.body.email;
        newUser.password = User.generateHash(req.body.password);
        newUser.localType = 'User';
        newUser.authType = 'local';
        newUser.loggedinStatus = false;
        newUser.isEmailVerified = false;
        newUser.photos =
        'https://cdn.petri.com/forums/core/image.php?userid=8422&thumb=1&dateline=1180704063';
        newUser.isnew = 'Y';
        res.cookie('profilepicture', newUser.photos);
        res.cookie('username', newUser.name);
        newUser.save(function(err) {
            if (err) {
                res.send('Error in registration');
            } else {
                newUserProfile.save(function(err) {
            if (err) {
                res.send('Error in registration');
            } else {
                console.log('Profile saved');
            }
        });
                res.send({email: req.body.email});
            }
        });
    },

    // VIRIFY EMAIL ID
    verifyEmail: function(req, res) {
        let emailId = req.body.email;
        console.log(req.body.verifyId);
        let verId = JSON.parse(req.body.verifyId);
        console.log(typeof(verId));
        console.log(verId);
        User.find({
            'email': emailId
        }, function(err, profile) {

            if (err) {
                res.send(err);
                console.log('error occured');
            } else {
                console.log(req.protocol + ':/' + req.get('host') + ':' + ('http://' + host));
                if ((req.protocol + '://' + req.get('host')) == ('http://' + host)) {
                    console.log('Domain is matched. Information is from Authentic email');
                    console.log(typeof(profile[0].verificationID));
                    console.log(profile[0].verificationID);
                    if (verId === profile[0].verificationID) {
                        console.log('email is verified');
                        User.update({
                            'email': req.body.email
                        }, {
                            $set: {
                                'isEmailVerified': true,
                                'verificationID': 0
                            }
                        }, function(err) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('Account Verified and Changed to true');
                            }
                        });
                        res.cookie('email', req.body.email);
                        var query = 'create (n:User {name : "' + req.body.email + '"})';
                        session.run(query).then(function(result){
                          if(result)
                          {
                          res.send({isVerified: true});
                          }
                        });
                        // res.send({isVerified: true});
                    } else {
                        res.send({isVerified: false});
                    }
                } else {
                    console.log('email is not verified');
                    //res.end('<h1>Link expired</h1>');
                    res.redirect('/#/expiryLink');
                }
            }
        });
    },

    // Check whether user is already exist or not
    checkUser: function(req, res) {
        let authType;
        User.find({
            'email': req.body.email
        }, function(err, profile) {
            if (profile.length) {
                console.log(profile[0].authType);
                console.log(profile.length);
                authType = profile.authType;
                res.json({'userexists': true, 'authType': profile[0].authType});
            } else {
                console.log(req.body.email);
                console.log(profile.length);
                res.json({'userexists': false, 'authType': authType});
            }
            if (err) {
                res.send(err);
            }
        });
    },

    forgetPassword: function(req, res) {
            let emailId = req.body.email;
            User.find({
                email: req.body.data
            }, function(err, profile) {
                if (err) {
                    res.send('err occured');
                    //  console.log('error ocuured');
                } else {
                    if(!profile)
                    {
                        res.send('Profile is not present');
                    }
                    /*eslint-disable */
                    // Create a Nodemailer transport object
                    else
                    {
                    var transporter = nodemailer.createTransport({
                        /*eslint-disable */
                        service: 'Gmail',
                        secure: true,
                        auth: {
                            user: 'zynla0001@gmail.com', // Your email id
                            pass: 'Zynla@123' // Your password
                        }
                    });

                   host = req.get('host');
                    console.log(profile);
                    /*eslint-disable */
                    // var VID = User.generateHashVID(profile[0].verificationID);
                    /*eslint-enable */
                    link = 'http://' + req.get('host') + '/users/redirectForgetPassword?email=' + req.body.email;
                    var text = 'Hello from \n\n' + req.body.email;
                    mailOptions = {
                        from: 'zynla0001@gmail.com', // sender address
                        to: emailId, // reciever
                        subject: 'Change your Password with Zynla', // Subject line
                        text: text,
                        html: '<center><h1>Welcome to Zynla</h1></center><br><br><br>' + 'Hi,<br><br>To Reset password Click on the below button.' + '<br><br><br><a href=' + link + ' style=background-color:#44c767 ;' + '-moz-border-radius:28px;-webkit-border-radius:28px;border-radius:28px;' + 'border:1px solid #18ab29 ;display:inline-block;padding:16px 31px;' + 'color:#ffffff ;text-shadow:0px 1px 0px #2f6627 ;' + 'text-decoration:none;> Click Here </a><br><br>' + '<i>This link is valid for an hour.This is an Auto-generated mail,' + 'please do not reply</i></small>'
                    };
                    console.log(mailOptions + host);
                    // Sent mail to recipient
                    transporter.sendMail(mailOptions, function(error, info) {
                        if (error) {
                            console.log(error);
                            console.log('Error')
                        } else {
                            console.log('Message sent: ' + info.response);
                            res.json('Mail Sent Successfully');
                        }
                    });
                }
                }
            });
        },

       redirectForgetPassword: function(req, res) {
            let checkMail = req.query.email;
            if(checkMail)
            {
            res.redirect('/#/changePasswordPage?emailId=' + checkMail);
            }
            else
            {
                res.redirect('');
            }
        },
        changePassword: function(req, res) {
            let newPassword = req.body.newPass;
            User.findOne({'email': req.body.email}, function(err, docs)
            {
                docs.password = User.generateHash(newPassword);
                docs.save(function(err) {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        res.send('Password Changed Successfully');
                    }
                })
            });
        },
    logOut: function(req, res) {
        res.clearCookie('username');
        res.clearCookie('profilepicture');
        res.clearCookie('email');
        console.log(res.clearCookie('quesId'));
        User.update({
            'email': req.body.email
        }, {
            $set: {
                'loggedinStatus': false
            }
        }, function(err) {
            if (err) {
                console.log("status not updated");
            } else {
                res.send('Log out successfully');
            }
        });
    },

    // FACEBOOK AUTHENTICATION
    facebook: function(req, res) {
        res.json(req.user);
    },

    // handle the callback after facebook has authenticated the user
    facebookCallBack: function(req, res) {
        res.cookie('token', req.user.token);
        res.cookie('authType', req.user.authType);
        res.cookie('username', req.user.name);
        res.cookie('profilepicture', req.user.photos);
        res.cookie('email', req.user.email);
        if (req.user.isnew === 'N') {
            res.redirect('/#/home');
        } else {
            let newUserProfile = new UserProfile();
            newUserProfile.emailId = req.user.email;
            newUserProfile.save(function(err) {
            if (err) {
                res.send('Error in registration');
            } else {
                console.log('Profile saved');
            }
        });
            var query = 'create (n:User {name : "' + req.user.email + '"})';
            session.run(query).then(function() {
                console.log("comes");
            });
            console.log(query);
            res.redirect('/#/selectCategory');
        }
    },
    // Instagram AUTHENTICATION
    instagram: function(req, res) {
        res.json(req.user);
    },

    // handle the callback after instagram has authenticated the user
    instagramCallBack: function(req, res) {
        res.cookie('token', req.user.token);
        res.cookie('authType', req.user.authType);
        res.cookie('username', req.user.name);
        res.cookie('profilepicture', req.user.photos);
        res.cookie('email', req.user.email);
        if (req.user.isnew === 'N') {
            res.redirect('/#/home');
        } else {
            let newUserProfile = new UserProfile();
            newUserProfile.emailId = req.user.email;
            newUserProfile.save(function(err) {
            if (err) {
                res.send('Error in registration');
            } else {
                console.log('Profile saved');
            }
        });
            var query = 'create (n:User {name : "' + req.user.email + '"})';
            session.run(query).then(function() {
                console.log("comes");
            });
            console.log(query);
            res.redirect('/#/selectCategory');
        }
    },

    // GOOGLE AUTHENTICATION
    google: function(req, res) {
        res.json(req.user);
    },

    // the callback after google has authorized the user
    googleCallBack: function(req, res) {
        let user = new User();
        res.cookie('token', req.user.token);
        res.cookie('username', req.user.name);
        res.cookie('authType', req.user.authType);
        res.cookie('profilepicture', req.user.photos);
        res.cookie('email', req.user.email);
        if (req.user.isnew === 'N') {
            res.redirect('/#/home');
        } else {
            let newUserProfile = new UserProfile();
            newUserProfile.emailId = req.user.email;
            newUserProfile.save(function(err) {
            if (err) {
                res.send('Error in registration');
            } else {
                console.log('Profile saved');
            }
        });
            console.log(req.user.email);
            var query = 'create (n:User {name : "' + req.user.email + '"})';
            session.run(query).then(function() {
                console.log("comes");
            });
            console.log(query);
            res.redirect('/#/selectCategory');
        }
    },
    /* To save the following card in mongo db and neo4j*/
    saveToProfile: function(req, res) {
        logger.debug("inside saveToProfile");
        let id = req.body.id;
        let emailId = req.body.emailId;
        /*eslint-disable*/
        let query = "match (q:Question), (u:User) where id(q)=" + id + " and u.name='" + emailId + "' create (q)<-[:follow {on:timestamp()}]-(u) return q";
        /*eslint-enable*/
        session.run(query).then(function(result) {
            /*eslint-disable*/
            let id = result.records[0]._fields[0].identity.low;
            /*eslint-enable*/
            let emailId = req.body.emailId;
            logger.debug('Inside get');
            UserProfile.findOneAndUpdate({
                emailId: emailId
            }, {
                $push: {
                    watchingList: {
                        id: id,
                        displayImage: req.body.displayImage,
                        heading: req.body.heading,
                        statement: req.body.statement,
                        postedBy: req.body.postedBy,
                        profileImage: req.body.profileImage,
                        addedOn: req.body.addedOn,
                        category: req.body.category,
                        upVotes: req.body.upVotes,
                        downVotes: req.body.downVotes,
                        noofans: req.body.noofans
                    }
                }
            }, {new: true}).then((doc) => {
                res.send(doc);
            }, (err) => {
                res.send(err);
            });
        });
    },
    /* To view the following card*/
    viewFollowCard: function(req, res) {
        let emailId = req.params.emailId;
        console.log(emailId);
        UserProfile.find({"emailId": emailId}).then((docs) => {
            res.send(docs);
        }, (err) => {
            res.send(err);
        });
    },
    /* Getting all the following category cards*/
    viewFav: function(req, res) {
        UserProfile.find().then((docs) => {
            res.send(docs);
        }, (err) => {
            res.send(err);
        });
    },
    /* get all cards for landing page */
    getAllCards: function(req, res) {
        let emailId = req.params.emailId;
        console.log('coming'+emailId);
        let arr = [];
        let qid = [];
        UserProfile.find({"emailId": emailId}).then((docs) => {
            if(docs[0].preferenceList) {
              for(let pref of docs[0].preferenceList) {
                qid.push(pref.id);
                arr.push(storeTag(pref, 'You preferred'));
              }
            }
            for (let i = 0; i < docs[0].watchingList.length; i = i + 1) {
                if(distinctFunc(arr, docs[0].watchingList[i])) {
                  qid.push(docs[0].watchingList[i].id);
                  arr.push(storeTag(docs[0].watchingList[i], 'Following'));
                }
                if (i == 4) {
                    break;
                }
            }
            for (let i = 0; i < docs[0].lists.length; i = i + 1) {
                if(arr, docs[0].lists[i]) {
                  qid.push(docs[0].lists[i].id);
                  arr.push(storeTag(docs[0].lists[i], 'Posted by you'));
                }
                if (i == 4) {
                    break;
                }
            }
            let topicQuery = 'match (n:User {name:"' + emailId + '"}) - \
            [:follow]->(m:Concept)<-[:question_of]-(q:Question) return distinct q';
            session.run(topicQuery).then(function(resultTopic){
              let mongoQues = [];
              for(let quesRec of resultTopic.records) {
                mongoQues.push({id: quesRec._fields[0].identity.low});
              }
              if(mongoQues.length > 0) {
                ListEntity.find({$or: mongoQues}).then(function(quesDocs) {
                  for(let quesDocsTemp of quesDocs) {
                    arr.push(storeTag(quesDocsTemp, 'Preferred Topic'));
                  }
                });
              }
              let query = 'match (n:User {name:"' + emailId + '"}) - \
              [:follow]->(m:User)-[:follow]->(o:Question) return distinct m,o';
              console.log(query);
              session.run(query).then(function(result) {
                  let mongoMail = [];
                  let following = [];
                  for (let record of result.records) {
                      following.push(record._fields[0].properties.name);
                      mongoMail.push({"emailId": record._fields[0].properties.name});
                  }
                  if(following.length < 1) {
                    ListEntity.find().then(function(docsAll) {
                      let quesIdTemp = [];
                        for (let ques of docsAll) {
                            if (distinctFunc(arr, ques))
                                quesIdTemp.push(ques.id);
                                arr.push(storeTag(ques, 'Recommended'));
                            }
                        let mongoQuery = [];
                        for(let qTemp of quesIdTemp) {
                          mongoQuery.push({id: qTemp});
                        }
                        // console.log('coming without error');
                        ListEntity.find({$or: mongoQuery}).then(function(newDocs) {
                          for(let qTemp of newDocs) {
                            for(let qArr in arr) {
                              if(arr[qArr].id === qTemp.id) {
                                arr[qArr].upVotes = qTemp.upVotes;
                                arr[qArr].answerCounts = qTemp.answerCounts;
                                arr[qArr].views = qTemp.views;
                              }
                            }
                          }
                          // console.log('coming without error');
                          resSend(res, arr);
                          // res.send(arr);
                        });
                    });
                  }
                  else {
                    UserProfile.find({$or: mongoMail}).then(function(docs2) {
                        let tempArr = [];
                        docs2.map(function(doc){
                          doc.watchingList.map(function(watchingList) {
                            tempArr.push(watchingList);
                          });
                        });
                        tempArr = followCount(tempArr);
                        tempArr.map(function(watchingList) {
                          if(distinctFunc(arr, watchingList)) {
                            qid.push(watchingList.id);
                            for(let followRecord of result.records) {
                              if(watchingList.id === followRecord._fields[1].identity.low) {
                                watchingList = storeFollowedBy(watchingList, followRecord._fields[0].properties.name);
                              }
                            }
                            arr.push(storeTag(watchingList, 'Friend\'s following'));
                          }
                        });
                        docs2.map(function(doc) {
                            // doc.watchingList.map(function(watchingList) {
                            //       if (distinctFunc(arr, watchingList)) {
                            //         qid.push(watchingList.id);
                            //         for(let followRecord of result.records) {
                            //           if(watchingList.id === followRecord._fields[1].identity.low) {
                            //             watchingList = storeFollowedBy(watchingList, followRecord._fields[0].properties.name);
                            //           }
                            //         }
                            //         arr.push(storeTag(watchingList, 'Friend\'s following'));
                            //       }
                            //     }
                            // );
                            doc.lists.map(function(lists) {
                                if(distinctFunc(arr, lists)) {
                                  qid.push(lists.id);
                                  arr.push(storeTag(lists, 'Friend\'s posted'));
                                }
                                }
                            );
                        });
                        let queryfof = 'match (n:User),(n)-[:follow]->(m:User)-[x]->(o:Question) where n.name="' + following[0] + '"';
                        for (let qi = 1; qi < following.length; qi = qi + 1) {
                            queryfof = queryfof + ' or n.name="' + following[qi] + '"';
                        }
                        queryfof = queryfof + ' return distinct m,n,o';
                        // console.log(queryfof);
                        session.run(queryfof).then(function(result) {
                            let mongoMailFof = [];
                            for (let record of result.records) {
                                mongoMailFof.push({"emailId": record._fields[0].properties.name});
                            }
                            if(mongoMailFof.length < 1) {
                              ListEntity.find().then(function(docsAll) {
                                  for (let ques of docsAll) {
                                      if (distinctFunc(arr, ques))
                                          arr.push(storeTag(ques, 'Recommended'));
                                      }
                                      let mongoQuery = [];
                                      for(let qTemp of qid) {
                                        mongoQuery.push({id: qid});
                                      }
                                      ListEntity.find({$or: mongoQuery}).then(function(newDocs) {
                                        for(let qTemp of newDocs) {
                                          for(let qArr in arr) {
                                            if(arr[qArr].id === qTemp.id) {
                                              arr[qArr].upVotes = qTemp.upVotes;
                                              arr[qArr].answerCounts = qTemp.answerCounts;
                                              arr[qArr].views = qTemp.views;
                                            }
                                          }
                                        }
                                        resSend(res, arr);
                                        // res.send(arr);
                                      });
                              });
                            }
                            UserProfile.find({$or: mongoMailFof}).then(function(docsFof) {
                                docsFof.map(function(doc) {
                                    doc.watchingList.map(function(watchingList) {
                                        if (distinctFunc(arr, watchingList)){
                                            qid.push(watchingList.id);
                                            for(let followRecord of result.records) {
                                              if(watchingList.id === followRecord._fields[2].identity.low) {
                                                watchingList = storeFriendOf(watchingList, followRecord._fields[1].properties.name);
                                              }
                                            }
                                            arr.push(storeTag(watchingList, 'FoF follow'));
                                          }
                                        }
                                    );
                                    doc.lists.map(function(lists) {
                                        if (distinctFunc(arr, lists)){
                                            qid.push(lists.id);
                                            for(let followRecord of result.records) {
                                              if(lists.id === followRecord._fields[2].identity.low) {
                                                lists = storeFriendOf(lists, followRecord._fields[1].properties.name);
                                              }
                                            }
                                            arr.push(storeTag(lists, 'FoF posted'));
                                          }
                                        }
                                    );
                                });
                                ListEntity.find().then(function(docsAll) {
                                  console.log('coming to all');
                                    for (let ques of docsAll) {
                                        if (distinctFunc(arr, ques))
                                            arr.push(storeTag(ques, 'Recommended'));
                                        }
                                        let mongoQuery = [];
                                        for(let qTemp of qid) {
                                          mongoQuery.push({id: qid});
                                        }
                                        ListEntity.find({$or: mongoQuery}).then(function(newDocs) {
                                          for(let qTemp of newDocs) {
                                            for(let qArr in arr) {
                                              if(arr[qArr].id === qTemp.id) {
                                                arr[qArr].upVotes = qTemp.upVotes;
                                                arr[qArr].answerCounts = qTemp.answerCounts;
                                                arr[qArr].views = qTemp.views;
                                              }
                                            }
                                          }
                                          resSend(res, arr);
                                          // res.send(arr);
                                        });
                                });
                            });
                        });
                    });
                  }
              });
            });
        }, (err) => {
            res.send(err);
        });
    },
    /* display category image from neo4j */
    displayCatagory: function(req, res) {
        var result1 = [];
        logger.debug('Inside display catagory');
        var query = 'match (n:Domain) return n';
        session.run(query).then(function(result) {
            for (var x of result.records) {
                result1.push({
                    "name": (x._fields[0].properties.name),
                    "image": (x._fields[0].properties.Image)
                });
            }
            console.log(result1);
            res.send(result1);
        }).catch(function(error) {
            console.log('promise error: ', error);
        });
    },
    /* Add category to mongodb as well as in neo4j */
    fetchCatagory: function(req, res) {
    var result2 = [];
    logger.debug('Inside fetch catagory');
    UserProfile.find({'emailId': req.body.email}, function(err, docs) {
        if(err)
        {
            console.log(err);
        }
            if(docs[0].interestCategory.length === 0 || docs[0].interestCategory === null)
            {
                console.log('error message');
                res.send(result2)
            }
            else
            {
                console.log(docs[0].interestCategory);
                docs[0].interestCategory.map(function(doc)
                {
                    result2.push(doc);
                    // res.send(result2);
                });
                console.log(result2);
                res.send(result2);
            }
    });
},
/* Add category to mongodb as well as in neo4j */
addCategory: function(req, res) {
  console.log("dddddddddddddd");
  console.log(req.body);
  let arr1 = JSON.parse(req.body.catagory);
  console.log(typeof(arr1));
  console.log('got the         ', arr1);
  let arr = [];
  // rand = Math.floor((Math.random() * 100) + 54);
  for (let y of arr1) {
      arr.push(y);

  }
  UserProfile.findOne({emailId: req.body.email},function(err, newUser)
  {
  newUser.profile.picture = req.body.profilePicture;
  newUser.interestCategory = arr;
  // arr.map(function(item)
  // {
  //   newUser.interestCategory.push(item);
  // });
  newUser.profile.picture = req.body.profilePicture;
  newUser.profile.name = req.body.name;
  newUser.profile.dob = 'dob';
  newUser.profile.gender = 'gender';
  newUser.profile.address.country = 'Country';
  res.cookie('email', newUser.emailId);
  res.cookie('catagories', newUser.interestCategory);
  console.log(arr);
  let i = 1;
  newUser.save(function(err) {
      if (err) {
          res.send('Error in registration');
      } else {
          let id = req.body.email;
          console.log('email in addcategory', req.body.email);
          let query1 = 'match (:User {name: "'+id+'"})-[r:follows]-(:Domain) DELETE r'
                session.run(query1).then(function(){
                    let query = 'match (n:User {name:"' + id + '"})';
          for (var i = 0; i < arr.length; i++) {
              query += ',(d' + i + ': Domain {name:"' + arr[i] + '"}) ';
          }
          console.log('node 1', query);
          query += 'create (n)-[:follows]->(d0)';
          for (let i = 1; i < arr.length; i++) {
              query += ',(n)-[:follows]->(d' + i + ')';
          }
          console.log('node 2', query);
          session.run(query).then(function() {
              console.log('updated to neo4j');
          });
                })
          /* Add category to neo4j */
          res.send('Successfully updated');
      }
  });
  });
},
updateIsNew: function(req, res) {
        let isNew = req.body.isNew;
        console.log(typeof(isNew));
        console.log('email', req.params.emails);
        User.findOne({
            'email': req.params.emails
        }, function(err, users) {
            users.isnew = isNew;
            users.save(function() {
                if (err) {
                    console.log("error occured in update")
                }
                res.cookie('email', req.params.emails);
                res.send('Successfully registered');
                // console.log("updated successfully");
                // res.redirect('/#/userprofile');
            });
        });
    },
    /* Update basic information to profile*/
    updateProfile: function(req, res) {
        console.log(req.params.emails);
        // console.log(req.body.data1[dateofbirth]);
        let username = '';
        let data = JSON.parse(req.body.data1);
        console.log(JSON.parse(req.body.data1));
        User.findOne({
            email: req.params.emails
        }, function(err, user) {
            username = user.name;
        })
        UserProfile.findOne({
            'emailId': req.params.emails
        }, function(err, userProfile) {
            if (err) {
                res.send(err);
            } else {
                console.log(req.body.country);
                userProfile.profile.dob = data.dateofbirth;
                userProfile.profile.gender = data.gender;
                userProfile.profile.address.country = req.body.country;
                userProfile.profile.name = username;
                userProfile.save(function() {
                    if (err) {
                        console.log("error occured in update")
                    }
                    console.log(userProfile.profile.dob);
                    res.cookie('email', req.params.emails);
                    res.send('Profile updaed successfully');
                });
            }
        });
    },
    getAllUserName: function(req, res) {
        User.find(function(err, docs) {
            let names = [];
            let len = docs.length;
            if (err) {
                res.send('Error:' + err);
            } else {

                for (let i = 0; i < len; i = i + 1) {
                    names.push({name: docs[i].name, email: docs[i].email, lStatus: docs[i].loggedinStatus});
                }
                res.send(names);
            }
        });
    },
    // updates the user preference data inside mongo
    addPreference: function(req, res) {
        let emailId = req.body.emailId;
        UserProfile.find({emailId: emailId}).then(function(docs){
          let preference = docs[0].preferenceList;
          if(preference) {
            if(checkPreference(req.body.id, preference)) {
              UserProfile.update({emailId: emailId},{$pull: {preferenceList: {id: req.body.id}}}).then(function(obj){
                console.log(obj);
              });
            }
          }
          UserProfile.findOneAndUpdate({
              emailId: emailId
          }, {
              $push: {
                  preferenceList: {
                      id: req.body.id,
                      displayImage: req.body.displayImage,
                      profileImage: req.body.profileImage,
                      heading: req.body.heading,
                      postedBy: req.body.postedBy,
                      addedOn: req.body.addedOn,
                      answerCount: req.body.noofans,
                      upVotes: req.body.upVotes,
                      downVotes: req.body.downVotes,
                      views: req.body.views,
                      position: req.body.preferedPos
                  }
              }
          }).then((doc) => {
              res.send(req.body.heading);
          }, (err) => {
              res.send(err);
          });
        });
    }
}

function distinctFunc(arr, ques) {
    for (let q of arr) {
        if (q.id === ques.id) {
            return false;
        }
        if(!q.heading) {
          return false;
        }
    }
    return true;
}

function storeTag(obj, val) {
  let temp = JSON.stringify(obj);
  temp = temp.substring(0, temp.length-1);
  obj = JSON.parse(temp + ', "tag":"' + val + '"}');
  return obj;
}

function storeFollowedBy(obj, val) {
  let temp = JSON.stringify(obj);
  temp = temp.substring(0, temp.length-1);
  obj = JSON.parse(temp + ', "followedBy":"' + val + '"}');
  return obj;
}

function storeFriendOf(obj, val) {
  let temp = JSON.stringify(obj);
  temp = temp.substring(0, temp.length-1);
  obj = JSON.parse(temp + ', "friendOf":"' + val + '"}');
  return obj;
}

function storeFollowCount(obj, val) {
  let temp = JSON.stringify(obj);
  temp = temp.substring(0, temp.length-1);
  obj = JSON.parse(temp + ', "followCount":"' + val + '"}');
  return obj;
}

function checkPreference(id, arr) {
  for(let temp of arr) {
    if(temp.id == id) {
      console.log('comes:'+id);
      return true;
    }
  }
  return false;
}

function resSend(res, arr) {
  let emailId = [];
  for(let array of arr) {
    if(array.followedBy) {
      emailId.push({email:array.followedBy});
    }
    else if (array.friendOf) {
      emailId.push({email:array.friendOf});
    }
    emailId.push({email:array.postedBy});
  }
  User.find({$or:emailId}).then(function(docs){
    let data = [];
    docs.map(function(doc){
      if(doc.name) {
        data[doc.email] = doc.name;
      }
      else {
        data[doc.email] = doc.email;
      }
    });
    for(let i in arr) {
      arr[i].postedBy = data[arr[i].postedBy];
      if(arr[i].followedBy) {
        arr[i].followedBy = data[arr[i].followedBy];
      }
      else if (arr[i].friendOf) {
        arr[i].friendOf = data[arr[i].friendOf];
      }
    }
    res.send(arr);
  });
}

function followCount(arr) {
  for(let i in arr) {
    let count = -1;
    arr.map(function(data2){
      if(arr[i].id === data2.id) {
        count = count + 1;
      }
    });
    arr[i] = storeFollowCount(arr[i], count);
  }
  return arr;
}

module.exports = userCtrl;
