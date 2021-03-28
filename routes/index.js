const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');
const indexController = require('../controllers/indexController')
/* GET home page. */
router.get('/index', indexController.index);


module.exports = router;
