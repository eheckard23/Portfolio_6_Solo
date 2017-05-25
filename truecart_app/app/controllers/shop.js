let express = require('express');
let router = express.Router();
let path = require('path');
let mongoose = require('mongoose');
let passport = require('passport');
let csrf = require('csurf');

let csrfProtection = csrf();

module.exports = (app) => {
	app.use('/', router);
	app.use(csrfProtection);
}

router.get('/', (req,res,next) => {

	let Product = mongoose.model('Product');
	let User = mongoose.model('User');
	User.find({}, (err, user) => {
		if(err) throw err;
		console.log(user);
	});

	Product.find({}, (err, products) => {
		if(err) throw err;
		let productChunks = [];
		let chunkSize = 3;
		for(let i=0;i<products.length;i+=chunkSize){
			productChunks.push(products.slice(i, i+chunkSize));
		}
		res.render(path.join( __dirname, '/../views/index'), { title: 'TrueCart', products: productChunks });
	});

});

router.get('/user/signup', (req,res,next) => {
	let messages = req.flash('error');
	res.render(path.join( __dirname, '/../views/signup'), { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/user/signup', passport.authenticate('local.signup', {
	successRedirect: '/user/profile',
	failureRedirect: '/user/signup',
	failureFlash: true
}));

router.get('/user/signin', (req,res,next) => {
	let messages = req.flash('error');
	res.render(path.join( __dirname, '/../views/signin'), { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/user/signin', passport.authenticate('local.signin', {
	successRedirect: '/user/profile',
	failureRedirect: '/user/signin',
	failureFlash: true
}));

router.get('/user/profile', (req,res,next) => {
	res.render(path.join( __dirname, '/../views/profile'));
});
