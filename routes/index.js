const express = require('express'),
  router = express.Router(),
  authUser = require('./authUser.routes');

router.use('/auth', authUser);
module.exports = router;
