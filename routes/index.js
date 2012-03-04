
var mongodb = require('../lib/mongoHandler'),
    magick = require('imagemagick'),
    fs = require('fs');
/*
 * GET home page.
 */

exports.index = function(req, res) {
	mongodb.get('1.23456', function(err, item) {
		res.render('index', { 
			images: [
				item
			]
		});
	});
};

exports.crop = function(req, res) {
	console.log("New dimensions: (" + req.body.box.x + ", " + req.body.box.y + ")");
	mongodb.update(req.body.id, req.body.box, function(err, item) {
		res.send({id: item.id, box: item.box});
	});
};

exports.getImage = function(req, res) {
	var id = req.params.id;
	var dimensions = req.params.dimensions;
	
	mongodb.get(id, function(err, item) {
		var variant = item.variants[dimensions];
		if (variant) {
			var filename = '/tmp/' + item.image + '-' + dimensions;
			console.log("Converting, tmp filename " + filename);
			magick.convert(
				[__dirname + '/../public/images/' + item.image, 
					'-resize', '640x480', 
					'-crop', dimensions + '+' + variant.x + '+' + variant.y, 
					'+repage', 
					filename
				], 
				function(err, data) {
					if (err) {
						res.statusCode = 503;
						res.writeHead(503, 'Unable to crop image');
						return res.end();
					}
					res.writeHead(200, {'Content-Type': 'image/jpg'});
					var read_stream = fs.createReadStream(filename);
					read_stream.on("data", function(data){
					  res.write(data);
					});
					read_stream.on("error", function(err){
					  console.error("An error occurred: %s", err);
					
					});
					read_stream.on("close", function(){
						console.log("File closed.");
						res.end();
					});
					
				return true;	
				}
			);	
		} else {
			res.statusCode = 404;
			res.writeHead(404, "No such variant.");
			res.end();
		}
		return true;
	});
};