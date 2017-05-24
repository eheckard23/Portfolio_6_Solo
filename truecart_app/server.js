// environment
// either our env is setting a variable called node env
// or default to development
let NODE_ENV = process.env.NODE_ENV || 'development';

if(NODE_ENV === 'development'){
	// dotenv looks for .env file
	// and loads whatever variables are inside it
	require('dotenv').load();
}

let express = require('express');
let app = express();

let port = 3000;

app.listen(port,() => {
	console.log(`Server running on port ${port}`);
});

let myApp = require('./app/app.js');
myApp(app);