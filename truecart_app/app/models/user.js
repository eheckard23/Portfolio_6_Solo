let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');

let userSchema = mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true }
});

userSchema.methods.encryptPassword = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
}

userSchema.methods.encryptCardAddress = function(card){
	return bcrypt.hashSync(card.cardAddress, bcrypt.genSaltSync(5), null);
}

userSchema.methods.encryptCardNumber = function(card){
	return bcrypt.hashSync(card.cardNumber, bcrypt.genSaltSync(5), null);
}

userSchema.methods.encryptCardMonth = function(card){
	return bcrypt.hashSync(card.cardMonth, bcrypt.genSaltSync(5), null);
}

userSchema.methods.encryptCardYear = function(card){
	return bcrypt.hashSync(card.cardYear, bcrypt.genSaltSync(5), null);
}

userSchema.methods.encryptCardCvc = function(card){
	return bcrypt.hashSync(card.cardCvc, bcrypt.genSaltSync(5), null);
}

userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);