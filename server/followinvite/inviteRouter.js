'use strict';
const router = require('express').Router();
const inviteCtrl = require('./inviteController');

router.post('/sendInviteEmail', inviteCtrl.sendInviteEmail);

router.get('/followQuestion', inviteCtrl.followQuestion);

router.post('/sendInviteTopicEmail', inviteCtrl.sendInviteTopicEmail);

router.get('/followTopic', inviteCtrl.followTopic);

module.exports = router;
