'use strict';
const router = require('express').Router();
const inviteCtrl = require('./inviteController');

router.post('/sendInviteEmail', inviteCtrl.sendInviteEmail);

router.get('/followQuestion', inviteCtrl.followQuestion);

module.exports = router;
