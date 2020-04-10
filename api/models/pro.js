module.exports = {
  schema: {
    firstName: { type: String, required: true, lowercase: true },
    lastName: { type: String, required: true, lowercase: true },
    stAddress: { type: String, required: true },
    city: { type: String, required: true, lowercase: true },
    postCode: { type: String, required: true, minlength: 4, maxlength: 4 },
    email: { type: String, required: true, lowercase: true },
    contactNum: { type: String, required: true },
    availability: [
      {
        startDate: { type: Date, required: true, default: Date.now },
        startSession: { type: Number, required: true, min: 1, max: 29 },
        endDate: { type: Date, required: true },
        endSession: { type: Number, required: true, min: 1, max: 29 },
      },
    ],
    pwd: { type: String, required: true },
    bookings: [Schema.Types.ObjectId],
    orders: [Schema.Types.ObjectId],
  },
};
