var express = require('express');
const router = express.Router();

const messageController = require('../controllers/message.controller')

router.post('/',function(req, res){
    return messageController.sendMessage(req, res)
})

module.exports = router;