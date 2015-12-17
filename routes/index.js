var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'nodejs-nominatim', desc: 'A NodeJs Proxy for OSM Nominatim', url: 'https://github.com/xbgmsharp/nodejs-nominatim' });
});

module.exports = router;
