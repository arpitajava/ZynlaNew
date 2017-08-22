const User = require('../users/userEntity');
const nodemailer = require('nodemailer');

let sentTopicInviteMail = function(host, topic, type, emailId, sender, lStatus)
{
            User.find({
            email: emailId
        }, function(err, docs) {
            if (err) {
              //  console.log('error ocuured');
            } else {
                /*eslint-disable */
                // Create a Nodemailer transport object
                console.log(docs);
                let name = docs[0].name;

                let transporter = nodemailer.createTransport({
                    /*eslint-disable */
                    service: 'Gmail',
                    secure: true,
                    auth: {
                        user: 'zynla0001@gmail.com', // Your email id
                        pass: 'Zynla@123' // Your password
                    }
                });

                console.log('host', host);
                let link = 'http://' + host + '/followinvite/followTopic?topic='
                     + topic + '&email='
                      + emailId + '&lstatus='+lStatus;
                let text = 'Hello from \n\n' + sender;
                let mailOptions = {
                    from: 'zynla0001@gmail.com', // sender address
                    to: emailId, // reciever
                    subject: sender + ' invite you to follow:-' + topic, // Subject line
                    text: text,
                    html: '<h3 style="color: #2e6c80;">Dear '+name+',</h3>'+
                    '<h3>This is an invitation mail from '+sender+' to follow '+
                    'the topic.Give your Response by clicking the follow link to follow the below mentioned topic:</h3>'+
                    '</blockquote>'+
                    '<p>&nbsp;</p>'+
                    '<h2>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;'+
                    '&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;'+
                    '&nbsp;<span style="text-decoration: underline;'+
                    'background-color: #003366; color: #ffffff;">'+
                    '<em><strong>'+ topic +'</strong></em></span></h2>'+
                    '<p>&nbsp;</p>'+
                    '<h2>Click &nbsp;<a href=' + link + '><span style="color: black;">'+
                    '<span>'+
                    '<strong>here</strong>'+
                    '</span></span></a>&nbsp; to follow the Topic.</h2>'+
                    '<p><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;'+
                    'Note: This is an auto generated mail.'+
                    'Please do not reply of this mail</strong></p>'+
                    '<p><strong>&nbsp;</strong></p>'
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
};

module.exports = sentTopicInviteMail;
