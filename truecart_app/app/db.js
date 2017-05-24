// database setup
let mongoose = require('mongoose');

// connect
//  mongodb://username:password@hostname:port/database
mongoose.connect(`mongodb://${process.env.MONGO_HOST}/${process.env.MONGO_DATABASE}`);

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
	console.log('DATABASE CONNECTION');
});

mongoose.Promise = global.Promise;

module.exports = db;