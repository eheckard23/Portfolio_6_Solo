let glob = require('glob');
let bodyParser = require('body-parser');
let expressHbs = require('express-handlebars');
let db = require('./db');
let session = require('express-session');
let passport = require('passport');
let flash = require('connect-flash');

module.exports = (app) => {

	require('./config/passport');
	
	app.engine('.hbs', expressHbs({ defaultLayout: __dirname + '/views/layouts/layout', partialsDir: __dirname + '/views/partials', extname: '.hbs' }));
	app.set('view engine', '.hbs');

	// middleware
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(session({secret: 'truecartsecret', resave: false, saveUninitialized: false }));
	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());

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