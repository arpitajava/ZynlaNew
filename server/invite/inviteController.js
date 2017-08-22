'use strict';
const User = require('../users/userEntity');
const UserProfile = require('../users/userProfileEntity').userModel;
const ListDoc = require('../list/listdocEntity');
const nodemailer = require('nodemailer');
let driver = require('../config/neo4j');
let host;

let checkTypeProfile = function(type, typeId, email)
{
    let typePresent = false;
    UserProfile.findOne({emailId: email}, function(err, user)
    {
        if(user)
        {
            user.type.map(function(item)
            {
                if(item.id === typeId)
                {
                    typePresent = true;
                }
            });
        }
    });
    return typePresent;
};

let inviteCtrl = {
sendInviteEmail: function (req, res) {
        // console.log(req.body.data);
        // console.log(req.body.questionId);
        // console.log(req.body.emailId);
        // console.log(req.body.senderName);
        User.find({
            email: req.body.emailId
        }, function(err) {
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
                console.log('host',host);
                let link = 'http://' + req.get('host') + '/invite/followQuestion?id='
                 + req.body.questionId + '&email='
                  + req.body.emailId;
                var text = 'Hello from \n\n' + req.body.senderName;
                let mailOptions = {
                    from: 'zynla0001@gmail.com', // sender address
                    to: req.body.emailId, // reciever
                    subject: req.body.senderName+'invite you to follow'+req.body.questionId, // Subject line
                    text: text,
                    html: '<center><h1>Welcome to Zynla</h1></center><br><br><br>'+
                    'Hi,<br><br>To complete Signup Click on the button to verify yourself.'+
                    '<br><br><br><a href=' + link + ' style=background-color:#44c767;'+
                    '-moz-border-radius:28px;-webkit-border-radius:28px;border-radius:28px;'+
                    'border:1px solid #18ab29;display:inline-block;padding:16px 31px;'+
                    'color:#ffffff;text-shadow:0px 1px 0px #2f6627;'+
                    'text-decoration:none;> Follow </a><br><br>'+
                    '<i>This link is valid for an hour.This is an Auto-generated mail,'+
                    'please do not reply</i></small>'
                };
                console.log(mailOptions + host);
                // Sent mail to recipient
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Message sent: ' + info.response);
                        // res.json({yo: info.response});
                    }
                });
            }
        });

    },
    followQuestion: function(req, res) {
        let questionId = req.query.id;
        let email = req.query.email;
        UserProfile.find({
            'emailId': req.query.email
        }, function(err, profile) {
            if (err) {
                res.send(err);
                console.log('error occured');
            } else {
                console.log(req.protocol + ':/' + req.get('host') + ':' + ('http://' + host));
                if ((req.protocol + '://' + req.get('host')) == ('http://' + host)) {
                    console.log('Domain is matched. Information is from Authentic email');
                    console.log('Question Id', parseInt(questionId, 10));
                    let qId = parseInt(questionId, 10);
                    ListDoc.findOne({id: qId},function(err, question)
                    {
                        if(checkTypeProfile(watchingList, qId, email))
                        {
                        let session = driver.session();
                        var query = 'match (n:User) where n.name='+email+''+
                                        +'match (q:Question) where id(q)='+qId+''+
                                        +'create (n)-[:follow]->(q)'+
                                        +'return n,q';
                        session.run(query);
                        session.end();
                        console.log(question);
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
                            }, {new: true}).then((doc) => {
                                // res.send(doc);
                            }, (err) => {
                                res.send(err);
                            });
                        }
                    });
                        res.cookie('email',req.query.email);
                        res.redirect('/#/successfullyregistered');

                } else {
                    console.log('error occured in email id');
                    //res.end('<h1>Link expired</h1>');
                    res.redirect('/#/expiryLink');
                }
            }
        });
    }
}

module.exports = inviteCtrl;
