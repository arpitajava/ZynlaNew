'use strict';
// const logger = require('./../../applogger');
const router = require('express').Router();
const userDocController = require('./userdocController');
// route for adding user
router.post('/add', userDocController.addUser);
// route for Update Education of user
router.post('/updateEdu', userDocController.updateEducation);
// route for Update Location of user
router.post('/updateLoc', userDocController.updateLocation);
// route for Update Profile of user
router.post('/updatePro', userDocController.updateProfile);
// route to get profile of user
router.post('/getuserprofile', userDocController.getUserprofile);
// route for getting all details of user
router.get('/getallusers', userDocController.getallusers);
// route for retrieving Questions posted by user
router.post('/getQuestions', userDocController.getQuestions);
// route for retrieving Answers posted by user
router.post('/getAnswers', userDocController.getAnswers);
// route for retrieving interestCategory of user
router.post('/getInterestedTopics', userDocController.getInterestedTopics);
// route for retrieving followers of user
router.post('/getFollowers', userDocController.getFollowers);
// route for retrieving followings of user
router.post('/getFollowing', userDocController.getFollowings);
router.post('/addProfile', userDocController.addProfile);
router.post('/getWatching', userDocController.getWatchingTopics);
// to get user answer Ids
router.post('/getuserAnsId', userDocController.getuserAnsId);

module.exports = router;
