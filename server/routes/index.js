const path = require("path");
var express = require('express');
var router = express.Router();

/* GET React frontend. Finally serve the frontend */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '..', "public", "index.html"));
});

module.exports = router;
