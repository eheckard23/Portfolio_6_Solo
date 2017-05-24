let express = require('express');
let router = express.Router();
let path = require('path');
let mongoose = require('mongoose');

module.exports = (app) => {
	app.use('/', router);
}

router.get('/', (req,res,next) => {

	res.render(path.join( __dirname, '/../views/shop'), { title: 'TrueCart' });

});
