const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = Schema({
	firstName: { type: String, required: false, lowercase: true },
	lastName: { type: String, required: false, lowercase: true },
	stAddress: { type: String, required: false },
	city: { type: String, required: false, lowercase: true },
	postCode: { type: String, required: false, minlength: 4, maxlength: 4 },
	email: { type: String, required: true },
	number: { type: String, required: true },
	password: { type: String, required: true },
	bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
	wishlist:[],
	orderHistory:[],
	orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
	nickname: { type: String, required: false },
});

UserSchema.statics.setwishlist = function(_id,wishlist){
	return this.model("User")
			.findByIdAndUpdate(_id,{$set:{wishlist}})
			.exec()
}

UserSchema.statics.setOrderHistory = function(_id,orderHistory){
// 	var friend = {"firstName": req.body.fName, "lastName": req.body.lName};
// Users.findOneAndUpdate({name: req.user.name}, {$push: {friends: friend}});
	return this.model("User")
			.findByIdAndUpdate(_id,{$push: {orderHistory: orderHistory}})
			.exec()
}



module.exports = UserSchema;
