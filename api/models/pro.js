const mongoose = require("mongoose");
const { Schema } = mongoose;

const availabilitySchema = new Schema({
  startDate: { type: String, required: true },
  startSession: { type: Number, required: true, min: 1, max: 29 },
  endDate: { type: String, required: true },
  endSession: { type: Number, required: true, min: 1, max: 29 },
});

const ProSchema = new Schema({
  firstName: { type: String, required: true, lowercase: true },
  lastName: { type: String, required: true, lowercase: true },
  stAddress: { type: String, required: true },
  city: { type: String, required: true, lowercase: true },
  postCode: { type: String, required: true, minlength: 4, maxlength: 4 },
  email: { type: String, required: true, lowercase: true },
  contactNum: { type: String, required: true },
  serviceType: { type: String, required: true, lowercase: true },
  availability: [availabilitySchema],
  pwd: { type: String, required: true },
  bookings: [Schema.Types.ObjectId],
  orders: [Schema.Types.ObjectId],
});

module.exports = mongoose.model("Pro", ProSchema);
