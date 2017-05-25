let express = require('express');
let path = require('path');
let glob = require('glob');
let bodyParser = require('body-parser');
let expressHbs = require('express-handlebars');
let db = require('./db');
let mongoose = require('mongoose');
let session = require('express-session');
let passport = require('passport');
let flash = require('connect-flash');
let validator = require('express-validator');
let MongoStore = require('connect-mongo')(session);

module.exports = (app) => {

	require('./config/passport');
	
	app.engine('.hbs', expressHbs({ defaultLayout: __dirname + '/views/layouts/layout', partialsDir: __dirname + '/views/partials', extname: '.hbs' }));
	app.set('view engine', '.hbs');

	// middleware
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(validator());
	app.use(session({
		secret: 'truecartsecret', 
		resave: false, 
		saveUninitialized: false,
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
		cookie: { maxAge: 180 * 60 * 1000 } 
	}));
	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());
	console.log(path.join(__dirname, 'public'));
	app.use(express.static(path.join(__dirname, 'public')));

	app.use((req,res,next) => {
		res.locals.login = req.isAuthenticated();
		res.locals.session = req.session;
		next();
	});

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