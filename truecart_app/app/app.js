let glob = require('glob');
let bodyParser = require('body-parser');
let hbs = require('express-handlebars');
let db = require('./db');

module.exports = (app) => {

	app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts' }));
	app.set('view engine', 'hbs');

	// middleware
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	// setup models
	let models = glob.sync( __dirname + '/models/*.js');
	models.forEach(controller => {
		require(controller);
	});

	// setup controller
	let controllers = glob.sync( __dirname + '/controllers/*.js');
	controllers.forEach(controller => {
		require(controller)(app);
	});

}