const express=require('express');
const { conversationController, messageController, getConversation, getMessage } = require('../controllers/chatControllers');

const router=express.Router()


router.post('/create-conversation',conversationController)

router.post('/create-message',messageController)

router.get('/get-conversation',getConversation)

router.get('/get-message/:conversationId',getMessage)

module.exports={router};