const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  name: { type: String, required: true },  
  items: [
    {
      foodItem: { type: String, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  totalPrice: { type: Number, required: true },
  tokenNumber: { type: Number, unique: true },
  status: { type: String, default: "Pending" } 
}, { timestamps: true });

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
