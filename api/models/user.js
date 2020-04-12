const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = Schema({
  firstName: { type: String, required: true, lowercase: true },
  lastName: { type: String, required: true, lowercase: true },
  stAddress: { type: String, required: true },
  city: { type: String, required: true, lowercase: true },
  postCode: { type: String, required: true, minlength: 4, maxlength: 4 },
  email: { type: String, required: true },
  contactNum: { type: String, required: true },
  pwd: { type: String, required: true },
  bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
  orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
});

module.exports = UserSchema;
