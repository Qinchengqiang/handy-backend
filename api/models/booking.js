const mongoose = require("mongoose");
const { Schema } = mongoose;

const BookingSchema = Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  proId: { type: Schema.Types.ObjectId, required: true, ref: "Pro" },
  bookingDate: { type: Date, required: true },
  startSession: { type: Number, required: true, min: 1, max: 29 },
  endSession: { type: Number, required: true, min: 1, max: 29 },
  status: { type: String, required: true, default: "upcoming" },
  timeCreated: { type: Date, required: true, default: Date.now },
  lastModified: { type: Date },
  notes: { type: String, trim: true },
  feedback: { type: String, trim: true },
  rating: { type: Number, min: 1, max: 5 },
});

module.exports = BookingSchema;
