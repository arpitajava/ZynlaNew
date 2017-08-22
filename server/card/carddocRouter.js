'use strict';
const router = require('express').Router();
const cardCtrl = require('./carddocController');
// router to add answers to database
router.post('/add', cardCtrl.addAnswer);

module.exports = router;
