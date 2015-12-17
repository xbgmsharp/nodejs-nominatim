var express = require('express');
var router = express.Router();
var util = require('util');
var db = require('../libs/db');
var geocode = require('../libs/geocode');

/* GET data API */
router.get('/', function(req, res, next) {
	res.json({ 'error': 'Missing params' });
});

router.get('/:lat/:lon/:lang?', function(req, res, next) {

	if (!req.params.lat || !req.params.lon)
	{
		res.json({ 'error': 'Missing params' });
	}

	/* TODO Check valid params, lenght, etc... */

	/* Search in DB for result */
	db.db_search(req, res, function (req, res){
		console.log('DEBUG: Back from db_search');
		console.log('DEBUG: ' + JSON.stringify(res.data));

		//console.log(res.data[0].result);

		/* If "result" is not empty then return it */
		if (res.data[0] && res.data[0].result && res.data[0].result.length != 0) {
			console.log('HIT: ' + JSON.stringify(res.data));
			res.append('Cache-Control', 'public, max-age=2592000000'); // 30 Days = 86400000*30
			res.append('X-Cache', 'HIT');
			res.json({ 'success': res.data});
		} else {

			/* else Nominatim API */
			geocode.nominatim(req, res, function (req, res){
				console.log('DEBUG: Back from nominatim.api');
				console.log('DEBUG: ' + util.inspect(res.data));

				/* If "result" is not empty then insert and return */
				if (res.data && res.data) {

					/* Insert result in DB for cache */
					db.db_insert(req, res, function (req, res){
						console.log('DEBUG: Back from db_insert');
						console.log('MISS: ' + JSON.stringify(res.data));

						res.append('Cache-Control', 'public, max-age=2592000000'); // 30 Days = 86400000*30
						res.append('X-Cache', 'MISS');
						res.json({ 'success': [res.data]});
					});

				} else {
					/* else send error */
					res.json({ 'error': 'no result' });
				} /* END no result from Nominatim API */

			}); /* END Nominatim API */

		} /* END no result from DB search */

	}); /* END DB search */

}); /* END Call to API */

module.exports = router;
