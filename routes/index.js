var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.end("<h1>(url)/set?con=(con)&cpu=(cpu)&ip=(ip)&port=(port) </h1>");
});

module.exports = router;
