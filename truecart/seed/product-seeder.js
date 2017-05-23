let Product = require('../models/product.js');

let mongoose = require('mongoose');

// mongoose connection
mongoose.connect('localhost:27017/shopping');

let products = [
	new Product({
		img: 'http://images.gibson.com.s3.amazonaws.com/Products/Electric-Guitars/2016/Custom/CC35-Vic-DaPra-1959-LP-Gruhn-Burst/LP59CC35TSBNH1_ELECTRONICS_GLAM.jpg',
		title: 'Gison Les Paul',
		description: 'Precise replica, handcrafted, Double-carved top/neck',
		price: 10,499
	}),
	new Product({
		img: 'http://images.gibson.com.s3.amazonaws.com/Products/Electric-Guitars/2016/Custom/SG-Standard-VOS/SGSR4VOFCNH1_ELECTRONICS_GLAM.jpg',
		title: 'Gison SG Standard',
		description: 'The 1961 "Les Paul" That Wasnt to Be',
		price: 4,499
	}),
	new Product({
		img: 'http://images.gibson.com.s3.amazonaws.com/Products/Electric-Guitars/2016/Custom/Flying-V-Standard/CSFVSITNH1_ELECTRONICS_GLAM.jpg',
		title: 'Gison Flying V Standard',
		description: 'Figured Maple Top, Solid Mahogany Body',
		price: 5,299
	}),
	new Product({
		img: 'https://reverb-res.cloudinary.com/image/upload/s--_dhidtpN--/a_exif,c_limit,e_unsharp_mask:80,f_auto,fl_progressive,g_south,h_620,q_90,w_620/v1472510878/g7e1xukgkphzqwta5bvu.jpg',
		title: 'Tama 4-Piece Superstar Classic Jazz Shell Kit (Midnight Gold Sparkle)',
		description: 'Midnight Gold Sparkle',
		price: 649
	}),
	new Product({
		img: 'https://static1.squarespace.com/static/57cebe2c03596e075fca5f24/580a66771b631b3a17b6b1bc/583a1e07e4fcb5b7cf393393/1480203787192/Palisades.jpg?format=500w',
		title: 'Earthquaker Palisades Overdrive',
		description: 'Mega Ultimate Overdrive',
		price: 249
	}),
	new Product({
		img: 'https://reverb-res.cloudinary.com/image/upload/s--THlRfdZE--/a_exif,c_limit,e_unsharp_mask:80,f_auto,fl_progressive,g_south,h_620,q_90,w_620/v1495533956/azpl7pbc7vrcm8scvohg.jpg',
		title: 'Martin D28 1965',
		description: '1965 Model',
		price: 8730
	}),
	new Product({
		img: 'https://reverb-res.cloudinary.com/image/upload/s--kTApAsfF--/a_exif,c_limit,e_unsharp_mask:80,f_auto,fl_progressive,g_south,h_1600,q_80,w_1600/v1448060640/j3am6ty9oeeikiuxd1aa.jpg',
		title: 'Kala Guitarlele Koa 6-String',
		description: 'Solid Spruce Top',
		price: 300
	}),
	new Product({
		img: 'https://reverb-res.cloudinary.com/image/upload/s--H_YfozfY--/a_exif,c_limit,e_unsharp_mask:80,f_auto,fl_progressive,g_south,h_620,q_90,w_620/v1471113039/oqvqlnez5gjgvo8axf1j.jpg',
		title: 'Moog MiniMoog Model D',
		description: 'Natural Wood Analog Synth',
		price: 4495
	}),
	new Product({
		img: 'https://reverb-res.cloudinary.com/image/upload/s--utLyUzp1--/c_crop,h_1.000,w_0.693,x_0.149,y_0.000/a_exif,c_limit,e_unsharp_mask:80,f_auto,fl_progressive,g_south,h_620,q_90,w_620/v1488339130/zzzrjmg8qwibtosh6jrh.jpg',
		title: 'Fender Rhodes Mark II Stage 73 Keyboard 1980',
		description: 'Black Tolex',
		price: 2300
	}),
	new Product({
		img: 'https://reverb-res.cloudinary.com/image/upload/s--UiD5lJfv--/a_exif,c_limit,e_unsharp_mask:80,f_auto,fl_progressive,g_south,h_620,q_90,w_620/v1449611037/rf8ofcgue6jufldbwg00.jpg',
		title: 'Korg MicroKEY249 49-Mini Key USB MIDI Keyboard',
		description: 'USB MIDI keyboard – thin, lightweight, and USB-powered',
		price: 120
	})
]

var done = 0;

for(var i=0;i<products.length;i++){
	products[i].save(function(err, results) => {
		done++;
		if(done === products.length){
			exit();
		}
	});
}

function exit(){
	mongoose.disconnect();
}
