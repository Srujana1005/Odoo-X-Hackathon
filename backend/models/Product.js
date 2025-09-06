import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  img: String,
  category: String,
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

export default mongoose.model("Product", productSchema);
