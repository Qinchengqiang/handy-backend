module.exports = {
  schema: {
    customerId: { type: Schema.Types.ObjectId, required: true },
    proId: { type: Schema.Types.ObjectId, required: true },
    bookingDate: { type: Date, required: true },
    startSession: { type: Number, required: true, min: 1, max: 29 },
    endSession: { type: Number, required: true, min: 1, max: 29 },
    notes: { type: String, trim: true },
    feedback: { type: String, trim: true },
  },
};
