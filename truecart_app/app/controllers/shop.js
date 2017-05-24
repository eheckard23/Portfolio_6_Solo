let express = require('express');
let router = express.Router();
let path = require('path');
let mongoose = require('mongoose');

module.exports = (app) => {
	app.use('/', router);
}

router.get('/', (req,res,next) => {

	let Product = mongoose.model('Product');

	Product.find({}, (err, products) => {
		if(err) throw err;
		console.log(products);
		res.render(path.join(__dirname, '/../views/shop.hbs'), { products: products, title: 'TrueCart' });
	});

});
