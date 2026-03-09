const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 20, rating, dealOfDay } = req.query;
    let query = {};
    if (search && search.trim() !== '') query.$text = { $search: search };
    if (category && category !== 'all' && category !== '') query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (rating) query.ratings = { $gte: Number(rating) };
    if (dealOfDay === 'true') query.dealOfDay = true;
    let sortOption = {};
    switch (sort) {
      case 'price_asc': sortOption = { price: 1 }; break;
      case 'price_desc': sortOption = { price: -1 }; break;
      case 'rating': sortOption = { ratings: -1 }; break;
      case 'newest': sortOption = { createdAt: -1 }; break;
      case 'popular': sortOption = { sold: -1 }; break;
      default: sortOption = { createdAt: -1 };
    }
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sortOption).skip(skip).limit(Number(limit));
    res.status(200).json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name avatar');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, oldPrice, category, brand, stock, featured, dealOfDay } = req.body;
    const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
    let images = [];
    if (req.body.images) {
      const urls = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
      images = urls.map((url) => ({ public_id: '', url }));
    }
    const product = await Product.create({ name, description, price, oldPrice, discount, images, category, brand, stock, featured, dealOfDay });
    res.status(201).json({ success: true, message: 'Product created!', product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    if (req.body.price && req.body.oldPrice) {
      req.body.discount = Math.round(((req.body.oldPrice - req.body.price) / req.body.oldPrice) * 100);
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: 'Product updated!', product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    await product.deleteOne();
    res.status(200).json({ success: true, message: 'Product deleted!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📸 REVIEW WITH PHOTOS
exports.addReview = async (req, res) => {
  try {
    const { rating, comment, photos } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());

    if (alreadyReviewed) {
      alreadyReviewed.rating = rating;
      alreadyReviewed.comment = comment;
      alreadyReviewed.photos = photos || [];
    } else {
      product.reviews.push({
        user: req.user._id,
        name: req.user.name,
        avatar: req.user.avatar?.url,
        rating,
        comment,
        photos: photos || [],
      });
    }

    product.calculateRating();
    await product.save();
    res.status(200).json({ success: true, message: 'Review added!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};