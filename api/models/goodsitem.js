module.exports = {
  itemName: { type: String, required: true, lowercase: true },
  itemDetails: { type: String, required: true, trim: true },
  itemImgs: [
    {
      type: String,
      required: true,
    },
  ],
  stock: { type: Number, required: true, min: 1, max: 9999 },
};
