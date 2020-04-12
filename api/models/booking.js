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
  notes: { type: String, trim: true },
  feedback: { type: String, trim: true },
});

module.exports = BookingSchema;
