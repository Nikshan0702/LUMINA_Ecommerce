const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description']
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: ['Skincare', 'Haircare', 'Makeup', 'Body Care', 'Fragrance', 'Personal Care']
    },
    brand: {
      type: String,
      required: [true, 'Please provide a brand name'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price must be a positive number']
    },
    image: {
      type: String,
      required: [true, 'Please provide a product image URL']
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
