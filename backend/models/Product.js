const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    avatar: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    photos: [{ type: String }], // 📸 Review photos (URLs)
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name required'], trim: true },
    description: { type: String, required: [true, 'Description required'] },
    price: { type: Number, required: [true, 'Price required'], min: 0 },
    oldPrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    images: [{ public_id: { type: String, default: '' }, url: { type: String, required: true } }],
    category: {
      type: String,
      required: [true, 'Category required'],
      enum: ['electronics', 'fashion', 'home', 'appliances', 'beauty', 'sports', 'grocery', 'toys', 'books'],
    },
    brand: { type: String, default: '' },
    stock: { type: Number, required: true, default: 0 },
    sold: { type: Number, default: 0 },
    specifications: { type: Map, of: String, default: {} },
    reviews: [reviewSchema],
    numReviews: { type: Number, default: 0 },
    ratings: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    dealOfDay: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.methods.calculateRating = function () {
  if (this.reviews.length === 0) {
    this.ratings = 0;
    this.numReviews = 0;
  } else {
    const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
    this.ratings = (total / this.reviews.length).toFixed(1);
    this.numReviews = this.reviews.length;
  }
};

productSchema.index({ name: 'text', description: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);