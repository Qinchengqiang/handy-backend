const mongoose = require("mongoose");
const { Schema } = mongoose;
const OrderSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, required: true },
  created: { type: Date, required: true },
  edited: { type: Date },
  details: [
    {
      item: { type: Schema.Types.ObjectId, required: true },
      quantity: { type: Number, required: true, min: 1, max: 10 },
    },
  ],
  status: { type: String, required: true },
});

module.exports = mongoose.model("Order", OrderSchema);
