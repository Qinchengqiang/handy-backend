const mongoose = require("mongoose");
const { Schema } = mongoose;
const detailsSchema = Schema({
  item: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "GoodsItem",
  },
  quantity: { type: Number, required: true, min: 1, max: 10 },
});

const OrderSchema = Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  created: { type: Date, required: true },
  edited: { type: Date },
  details: [detailsSchema],
  status: { type: String, required: true },
});

module.exports = OrderSchema;
