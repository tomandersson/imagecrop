
var mongodb = require('mongodb');

var exports = module.exports;

var client,
    collectionName = 'images';

/**
 * Initialise the database 'imageHandler'.
 */
exports.init = function() {
	client = new mongodb.Db('imageHandler', new mongodb.Server("127.0.0.1", 27017, {}));
	console.log("\nConnected to MongoDB");
};

/**
 * Get the bounding box for the image with id 'id'.
 * @param id {String}
 */
exports.get = function(id, callback) {
	return findId(id, callback);
};

/**
 * Update the bounding box data for the the image with id 'id'.
 * @param id {String}
 * @param box {Object}
 */
exports.update = function(id, box, callback) {
	// Get the existing object, if it exists
	findId(id, function(err, item) {
		updateBox(item, box, callback);
	});
};

function findId(id, callback) {
	client.open(function(err, p_client) {
		client.collection(collectionName, function(err, collection) {
			collection.findOne({ id: id }, function(err, item) {
				console.log("Found item '" + item.image + "'");
				client.close();
				callback(err, item);
			});
		});
	});
}

function updateBox(item, box, callback) {
	item.variants[box.w + 'x' + box.h] = {x: box.x, y: box.y};
	client.open(function(err, p_client) {
		client.collection(collectionName, function(err, collection) {
			collection.update({'id': item.id}, item, function(err, res) {
				callback(err, item);
				return client.close();
			});
		});
	});
}

