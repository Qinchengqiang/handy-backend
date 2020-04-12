const mongoose = require("mongoose");
const { Schema } = mongoose;
/* const imgUrlSchema = new Schema({
  type: String,
  required: true,
}); */

const GoodsItemSchema = Schema({
  itemName: { type: String, required: true, lowercase: true },
  itemDetails: { type: String, required: true, trim: true },
  itemImgs: [String],
  stock: { type: Number, required: true, min: 1, max: 9999 },
});

module.exports = GoodsItemSchema;
