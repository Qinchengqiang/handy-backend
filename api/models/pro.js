const mongoose = require("mongoose");
const { Schema } = mongoose;

const availabilitySchema = Schema({
  startDate: { type: Date, required: true },
  startSession: { type: Number, required: true, min: 1, max: 29 },
  endDate: { type: Date, required: true },
  endSession: { type: Number, required: true, min: 1, max: 29 },
});

const ProSchema = Schema({
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
  bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
  orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
});

module.exports = ProSchema;
