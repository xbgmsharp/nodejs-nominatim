var util = require('util');

/****
** Nominatim reverse function
***/
var Nominatim = require('node-nominatim2');
var options = {
  useragent: 'NodeJS request',
  referer: 'https://github.com/xbgmsharp/nodejs-nominatim'
}
nominatim = new Nominatim(options);

exports.nominatim = function(req, res, callback) {

        var lat = req.params.lat,
            lon = req.params.lon,
            lang = req.params.lang;

	console.log('Calling Nominatim API for: ' + JSON.stringify(req.params));
	nominatim.reverse({ lat: lat, lon: lon, 'accept-language': lang}, function (err, result, data) {
		if (err) {
			//res.send({'error':'An error has occurred'});
			throw err;
		} else {
			//console.log('DEBUG : Nominatim data: ' + util.inspect(data));
			console.log('Nominatim API: Success: data: ' + util.inspect(data));
                        res.data = data;
                        callback(req, res);
		}
	});
};

/****
** MapQuest reverse function
***/
/*
var mapquest = require('mapquest');

exports.mapquest.api = function(req, res, callback) {

        var lat = req.params.lat,
            lon = req.params.lon;

	console.log('Calling MapQuest API for: ' + JSON.stringify(req.params));
	mapquest.reverse({ coordinates: { latitude: lat, longitude: lon} }, function (err, result) {
		if (err) {
			//res.send({'error':'An error has occurred'});
			throw err;
		} else {
			//console.log('DEBUG : MapQuest data: ' + util.inspect(data));
			console.log('MapQuest API: Success: data: ' + util.inspect(data));
                        res.data = data;
                        callback(req, res);
		}
	});
};
*/
