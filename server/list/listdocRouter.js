'use strict';
const router = require('express').Router();
const listCtrl = require('./listdocController');

router.post('/add', listCtrl.addList);
router.get('/', listCtrl.viewList);
router.post('/invite', listCtrl.inviteFrnds);
router.post('/addquestion', listCtrl.addquestion);
router.put('/updateviews', listCtrl.updateviews);
router.get('/answer/:id', listCtrl.getCardQuestion);
router.get('/getIdWithQuestion', listCtrl.getIdWithQuestion);
router.get('/getQuestionIntent', listCtrl.getQuestionIntent);
router.get('/getconcepts', listCtrl.getconcepts);
router.get('/suggestQues/:id', listCtrl.suggestQues);
router.post('/updateLike', listCtrl.updateLike);
router.post('/updateunlike', listCtrl.updateunlike);
router.post('/likestatus', listCtrl.likeStatus);
router.get('/getImages', listCtrl.getImages);
router.put('/updatecomment', listCtrl.updatecomments);
router.post('/UpdateAcceptans', listCtrl.UpdateAcceptans);
router.put('/addanswerComment', listCtrl.addanswerComment);
router.post('/createReport', listCtrl.createReport);
router.post('/changePopup', listCtrl.changePopup);
router.post('/getLikeStatus', listCtrl.getLikeStatus);

module.exports = router;
