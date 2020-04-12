const mongoose = require("mongoose");
const { Schema } = mongoose;
const UserSchema = new Schema({
  firstName: { type: String, required: true, lowercase: true },
  lastName: { type: String, required: true, lowercase: true },
  stAddress: { type: String, required: true },
  city: { type: String, required: true, lowercase: true },
  postCode: { type: String, required: true, minlength: 4, maxlength: 4 },
  email: { type: String, required: true },
  contactNum: { type: String, required: true },
  pwd: { type: String, required: true },
  bookings: [Schema.Types.ObjectId],
  orders: [Schema.Types.ObjectId],
});

module.exports = mongoose.model("User", UserSchema);
