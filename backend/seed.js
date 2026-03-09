require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  { name: 'Samsung Galaxy S24 Ultra', description: 'Latest Samsung flagship with 200MP camera', price: 89999, oldPrice: 109999, discount: 18, category: 'electronics', brand: 'Samsung', stock: 50, ratings: 4.5, numReviews: 1200, featured: true, dealOfDay: true, images: [{ url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80' }] },
  { name: 'Apple MacBook Air M2', description: 'Superfast MacBook with M2 chip, 8GB RAM, 256GB SSD', price: 94999, oldPrice: 114900, discount: 17, category: 'electronics', brand: 'Apple', stock: 30, ratings: 4.8, numReviews: 890, featured: true, dealOfDay: true, images: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80' }] },
  { name: 'Sony WH-1000XM5 Headphones', description: 'Industry leading noise cancellation headphones', price: 24999, oldPrice: 34990, discount: 29, category: 'electronics', brand: 'Sony', stock: 100, ratings: 4.7, numReviews: 2300, dealOfDay: true, images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80' }] },
  { name: 'boAt Rockerz 450 Headphones', description: 'Wireless bluetooth headphones with 15hr battery life', price: 1299, oldPrice: 2999, discount: 57, category: 'electronics', brand: 'boAt', stock: 150, ratings: 4.3, numReviews: 5600, dealOfDay: true, images: [{ url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80' }] },
  { name: 'Boldfit Yoga Mat', description: 'Anti-slip yoga mat with carry bag', price: 499, oldPrice: 999, discount: 50, category: 'sports', brand: 'Boldfit', stock: 200, ratings: 4.4, numReviews: 780, dealOfDay: true, images: [{ url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&q=80' }] },
  { name: 'Nike Air Max 270', description: 'Comfortable running shoes with air cushion', price: 5499, oldPrice: 7999, discount: 31, category: 'fashion', brand: 'Nike', stock: 200, ratings: 4.3, numReviews: 560, images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80' }] },
  { name: 'Mens Formal Suit', description: 'Premium quality formal suit for men', price: 3499, oldPrice: 5999, discount: 42, category: 'fashion', brand: 'Raymond', stock: 80, ratings: 4.1, numReviews: 230, images: [{ url: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4fef?w=400&q=80' }] },
  { name: 'Whirlpool 1.5 Ton AC', description: '3 star split AC with inverter technology', price: 28999, oldPrice: 35999, discount: 19, category: 'appliances', brand: 'Whirlpool', stock: 40, ratings: 4.2, numReviews: 445, images: [{ url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80' }] },
  { name: 'LG 28L Microwave Oven', description: 'Convection microwave with auto cook menu', price: 8999, oldPrice: 12999, discount: 31, category: 'appliances', brand: 'LG', stock: 60, ratings: 4.4, numReviews: 670, images: [{ url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&q=80' }] },
  { name: 'Wooden King Size Bed', description: 'Solid wood bed with storage', price: 12999, oldPrice: 19999, discount: 35, category: 'home', brand: 'HomeTown', stock: 25, ratings: 4.0, numReviews: 180, images: [{ url: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&q=80' }] },
  { name: 'Prestige Induction Cooktop', description: '1600W induction cooktop with push button', price: 1899, oldPrice: 2999, discount: 37, category: 'home', brand: 'Prestige', stock: 150, ratings: 4.3, numReviews: 890, images: [{ url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80' }] },
  { name: 'Lakme Lipstick Set', description: 'Pack of 6 lipsticks in trending shades', price: 599, oldPrice: 999, discount: 40, category: 'beauty', brand: 'Lakme', stock: 300, ratings: 4.5, numReviews: 1500, images: [{ url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80' }] },
  { name: 'Nivea Face Wash', description: 'Deep cleansing face wash for all skin types', price: 349, oldPrice: 499, discount: 30, category: 'beauty', brand: 'Nivea', stock: 500, ratings: 4.2, numReviews: 2100, images: [{ url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80' }] },
  { name: 'Cosco Badminton Set', description: 'Complete badminton set with 2 rackets and shuttles', price: 1299, oldPrice: 1999, discount: 35, category: 'sports', brand: 'Cosco', stock: 120, ratings: 4.1, numReviews: 340, images: [{ url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80' }] },
  { name: 'Cadbury Chocolates Gift Pack', description: 'Assorted chocolates gift pack', price: 599, oldPrice: 799, discount: 25, category: 'grocery', brand: 'Cadbury', stock: 400, ratings: 4.6, numReviews: 3200, images: [{ url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&q=80' }] },
  { name: 'LEGO Classic Set', description: 'Creative building blocks for kids', price: 2999, oldPrice: 3999, discount: 25, category: 'toys', brand: 'LEGO', stock: 90, ratings: 4.8, numReviews: 450, images: [{ url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80' }] },
  { name: 'Atomic Habits', description: 'An Easy & Proven Way to Build Good Habits by James Clear', price: 299, oldPrice: 499, discount: 40, category: 'books', brand: 'Penguin', stock: 500, ratings: 4.9, numReviews: 8900, featured: true, images: [{ url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80' }] },
  { name: 'Samsung 55 inch 4K TV', description: 'Crystal 4K UHD Smart TV with HDR', price: 39999, oldPrice: 54999, discount: 27, category: 'electronics', brand: 'Samsung', stock: 35, ratings: 4.5, numReviews: 670, featured: true, images: [{ url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=400&q=80' }] },
  { name: 'JBL Go 3 Speaker', description: 'Portable waterproof bluetooth speaker', price: 2499, oldPrice: 3499, discount: 29, category: 'electronics', brand: 'JBL', stock: 180, ratings: 4.4, numReviews: 1100, images: [{ url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80' }] },
  { name: 'Women Kurti Set', description: 'Beautiful cotton kurti with palazzo', price: 799, oldPrice: 1499, discount: 47, category: 'fashion', brand: 'Biba', stock: 250, ratings: 4.2, numReviews: 890, images: [{ url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=400&q=80' }] },
  { name: 'Banarasi Silk Saree', description: 'Pure banarasi silk saree with golden border', price: 2199, oldPrice: 3999, discount: 45, category: 'fashion', brand: 'Craftsvilla', stock: 60, ratings: 4.6, numReviews: 320, images: [{ url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80' }] },
  { name: 'Apple iPhone 17 Pro Max', description: 'Latest Apple iPhone 17 Pro Max with A19 Bionic chip, 48MP camera system, titanium design and all-day battery life', price: 134999, oldPrice: 149999, discount: 10, category: 'electronics', brand: 'Apple', stock: 25, ratings: 4.9, numReviews: 3200, featured: true, dealOfDay: true, images: [{ url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80' }] },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
    await Product.deleteMany({});
    console.log('🗑️ Old products deleted');
    await Product.insertMany(products);
    console.log('✅ 21 Products added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedDB();