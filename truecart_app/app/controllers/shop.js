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
		let productChunks = [];
		let chunkSize = 3;
		for(let i=0;i<products.length;i+=chunkSize){
			productChunks.push(products.slice(i, i+chunkSize));
		}
		res.render(path.join( __dirname, '/../views/index'), { title: 'TrueCart', products: productChunks });
	});

});
