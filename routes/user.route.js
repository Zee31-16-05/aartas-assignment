var express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');

router.post('/',function(req, res){
    return userController.signup(req, res)
})

router.get('/',function(req, res){
    return userController.login(req, res)
})

module.exports = router;