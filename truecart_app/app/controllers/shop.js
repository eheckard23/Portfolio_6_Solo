let express = require('express');
let router = express.Router();
let path = require('path');
let mongoose = require('mongoose');
let passport = require('passport');
let csrf = require('csurf');
let Cart = require('../models/cart');
let Order = require('../models/order');

let csrfProtection = csrf();

module.exports = (app) => {
	app.use('/', router);
}

router.get('/user/profile', isLoggedIn, (req,res,next) => {

	// get all orders
	Order.find({user: req.user}, (err, orders) => {
		if(err){
			return res.write('Error!');
		}
		let cart;
		orders.forEach(order => {
			cart = new Cart(order.cart);
			order.items = cart.generateArray();
		});
		res.render(path.join( __dirname, '/../views/user/profile'), { orders: orders });
	});
	
});

router.get('/user/logout', (req,res,next) => {
	req.logout();
	req.session.cart = null;
	res.redirect('/');
});

router.use('/', function(req,res,next){
	next();
});

router.get('/', (req,res,next) => {

	let Product = mongoose.model('Product');
	let successMsg = req.flash('success')[0];
	let cartMsg = req.flash('cart')[0];
	Product.find({}, (err, products) => {
		if(err) throw err;
		let productChunks = [];
		let chunkSize = 3;
		for(let i=0;i<products.length;i+=chunkSize){
			productChunks.push(products.slice(i, i+chunkSize));
		}
		res.render(path.join( __dirname, '/../views/shop/index'), { title: 'TrueCart', products: productChunks, successMsg: successMsg, noMessages: !successMsg, cartMsg: cartMsg, noCartMsg: !cartMsg });
	});

});

router.get('/add-to-cart/:id', (req,res,next) => {
	let Product = mongoose.model('Product');
	// push item to cart
	let productId = req.params.id;
	let cart = new Cart(req.session.cart ? req.session.cart : {});

	Product.findById(productId, (err, product) => {
		if(err){
			return res.redirect('/');
		}
		cart.add(product, product.id);
		req.flash('cart', 'Cart item added!');
		req.session.cart = cart;
		res.redirect('/');
	});
});

router.get('/reduce/:id', (req,res,next) => {
	let productId = req.params.id;
	let cart = new Cart(req.session.cart ? req.session.cart : {});

	cart.reduceByOne(productId);
	req.session.cart = cart;
	res.redirect('/shopping-cart');
});

router.get('/remove/:id', (req,res,next) => {
	let productId = req.params.id;
	let cart = new Cart(req.session.cart ? req.session.cart : {});

	cart.removeItem(productId);
	req.session.cart = cart;
	res.redirect('/shopping-cart');
});

router.get('/shopping-cart', (req,res,next) => {
	if(!req.session.cart){
		return res.render(path.join(__dirname, '/../views/shop/cart'), { products: null });
	}
	let cart = new Cart(req.session.cart);
	res.render(path.join(__dirname, '/../views/shop/cart'), { products: cart.generateArray(), totalPrice: cart.totalPrice });
});

router.get('/checkout', isLoggedIn, (req,res,next) => {
	if(!req.session.cart){
		return res.redirect('/shopping-cart');
	}
	let cart = new Cart(req.session.cart);
	let errMsg = req.flash('error')[0];
	res.render(path.join( __dirname, '/../views/shop/checkout'), { total: cart.totalPrice, errMsg: errMsg, noError: !errMsg })
});

router.post('/checkout', isLoggedIn, (req,res,next) => {
	if(!req.session.cart){
		return res.redirect('/shopping-cart');
	}
	let cart = new Cart(req.session.cart);
	let stripe = require("stripe")("sk_test_C5CxQ2Ea3dJby8vVZNuIO6iz");

	stripe.charges.create({
	  amount: cart.totalPrice * 100,
	  currency: "usd",
	  description: "Example charge",
	  source: req.body.stripeToken,
	}, function(err, charge) {
	  // asynchronously called
	  if(err){
	  	req.flash('error', err.message);
	  	return res.redirect('/checkout');
	  }
	  let order = new Order({
	  	user: req.user,
	  	cart: cart,
	  	address: req.body.address,
	  	name: req.body.name,
	  	paymentId: charge.id
	  });
	  order.save((err, result) => {
	  		req.flash('success', 'Successfully purchased item');
		  	req.session.cart = null;
		  	res.redirect('/');
	  });
	});
});

router.use(csrfProtection);

router.get('/user/signup', (req,res,next) => {
	let messages = req.flash('error');
	res.render(path.join( __dirname, '/../views/user/signup'), { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/user/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});

router.get('/user/signin', (req,res,next) => {
	let messages = req.flash('error');
	res.render(path.join( __dirname, '/../views/user/signin'), { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/user/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.session.oldUrl = req.url;
	res.redirect('/user/signin');
}

function notLoggedIn(req,res,next){
	if(!req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
}
