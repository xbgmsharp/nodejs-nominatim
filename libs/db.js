/***
** MongoDB functions
***/

/* Calculate value in range of 0.01 Degres
 * 1 Degres Latitude = 111 KM
 */
function Calc_Max_Min(value) {

        max = parseFloat(value)+0.01;
        min = parseFloat(value)-0.01;

        return [ parseFloat(min.toFixed(4)), parseFloat(max.toFixed(4)) ];
}

/* Search in DB for previous result */
exports.db_search = function(req, res, callback) {

        var lat = req.params.lat,
            lon = req.params.lon,
            lang = req.params.lang,
            db = req.db;

	console.log('Searching in DB for: ' + JSON.stringify(req.params));
        /* Generate MongoDB Query parameters */
        /* { lat : { $gte: 51.6 , $lte : 52.1 } , lon : { $gte: 51.6 , $lte : 52.1 } } */
        var query = {};
        mylat = Calc_Max_Min(lat);
        query["lat"] = {$gte: mylat[0] , $lte: mylat[1] };
        mylon = Calc_Max_Min(lon);
        query["lon"] = {$gte: mylon[0] , $lte: mylon[1] };
	// Set language
        query["lang"] = lang;
        console.log('Search query:'+ JSON.stringify(query));

	/* Make Query to DB */
	var collection = db.get('reversedata');
	collection.find(query, {limit:1}, function(err, data){
		if (err) {
			//res.send({'error':'An error has occurred'});
			throw err;
		} else {
			console.log('DB Search: Success: ' + JSON.stringify(data));
			res.data = data;
			callback(req, res);
		}
	});
};

/* Insert in DB new result */
exports.db_insert = function(req, res, callback) {

        var lat = req.params.lat,
            lon = req.params.lon,
            lang = req.params.lang,
            db = req.db,
	    result = res.data;

	console.log('Adding in DB for: ' + JSON.stringify(req.params));
	var collection = db.get('reversedata');
	collection.insert({"lat": parseFloat(lat), "lon": parseFloat(lon), "lang": lang, "result": result}, {safe:true}, function(err, data){
		if (err) {
			//res.send({'error':'An error has occurred'});
			throw err;
		} else {
			console.log('DB Insert: Success: ' + JSON.stringify(data));
			res.data = data;
			callback(req, res);
		}
	});
};
