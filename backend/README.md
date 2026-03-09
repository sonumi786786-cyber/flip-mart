# FlipMart Backend

The Express.js backend API for FlipMart e-commerce platform. Provides RESTful endpoints for user authentication, product management, shopping cart, orders, and more.

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Server will start on `http://localhost:5000` (configurable via PORT env variable)

### Production

```bash
npm start
```

## 📦 Dependencies

- **Express.js** - Web framework
- **MongoDB & Mongoose** - Database and ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Cloudinary** - Image hosting
- **Nodemailer** - Email service
- **Twilio** - SMS service
- **Express Validator** - Input validation
- **Multer** - File upload handling
- **Morgan** - HTTP request logging
- **Express Rate Limit** - Rate limiting
- **CORS** - Cross-Origin Resource Sharing
- **Dotenv** - Environment variable management

## ⚙️ Environment Configuration

Create a `.env` file in the backend directory with the following variables:

```env
# Database
MONGO_URI=mongodb://localhost:27017/flipmart
# or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/flipmart

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Twilio Configuration (Optional)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Server Configuration
PORT=5000
NODE_ENV=development
# For production: NODE_ENV=production
```

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js              # Database connection setup
├── controllers/           # Route handler functions
│   ├── authController.js
│   ├── cartController.js
│   ├── orderController.js
│   ├── productController.js
│   └── ...
├── middleware/
│   └── auth.js            # Authentication middleware
├── models/                # MongoDB models/schemas
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   ├── Order.js
│   ├── Coupon.js
│   └── ...
├── routes/                # Express route definitions
│   ├── auth.js
│   ├── products.js
│   ├── cart.js
│   ├── orders.js
│   ├── coupons.js
│   └── ...
├── server.js              # Express app setup
├── seed.js                # Database seeding script
└── package.json
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Authenticate user and get JWT token
- `POST /logout` - Logout user

### Products Routes (`/api/products`)
- `GET /` - Get all products with pagination
- `GET /:id` - Get single product details
- `GET /search` - Search products
- `POST /` - Create new product (admin only)
- `PUT /:id` - Update product (admin only)
- `DELETE /:id` - Delete product (admin only)

### Cart Routes (`/api/cart`)
- `GET /` - Get user's cart
- `POST /` - Add item to cart
- `PUT /:itemId` - Update cart item quantity
- `DELETE /:itemId` - Remove item from cart
- `DELETE /` - Clear entire cart

### Orders Routes (`/api/orders`)
- `GET /` - Get all user orders
- `GET /:id` - Get order details
- `POST /` - Create new order
- `PUT /:id/status` - Update order status (admin)
- `DELETE /:id` - Cancel order

### Coupons Routes (`/api/coupons`)
- `GET /` - Get all available coupons
- `POST /` - Create coupon (admin only)
- `DELETE /:id` - Delete coupon (admin only)

## 🔐 Authentication

The API uses JWT (JSON Web Token) for secure authentication:

1. User registers or logs in
2. Server returns a JWT token
3. Client includes token in `Authorization: Bearer <token>` header
4. Server validates token with `auth` middleware

Protected routes require a valid JWT token.

## 📦 Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: String,
  createdAt: Date
}
```

### Product
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String (Cloudinary URL),
  stock: Number,
  createdAt: Date
}
```

### Cart
```javascript
{
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    quantity: Number
  }],
  createdAt: Date
}
```

### Order
```javascript
{
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: String,
  shippingAddress: String,
  createdAt: Date
}
```

### Coupon
```javascript
{
  code: String (unique),
  discountType: String (percentage/fixed),
  discountValue: Number,
  expiryDate: Date,
  maxUses: Number,
  usedCount: Number
}
```

## 🛡️ Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Tokens**: Stateless authentication
- **Rate Limiting**: Protection against brute-force attacks
- **Input Validation**: Express-validator for data validation
- **CORS**: Configured cross-origin requests
- **HTTP Logging**: Morgan for request tracking

## 📧 Email Integration

Configured with Nodemailer for:
- Order confirmations
- Password reset emails
- Account notifications

## 📱 SMS Integration

Optional Twilio integration for:
- Order status notifications
- SMS alerts

## 🌱 Database Seeding

To populate the database with sample data:

```bash
node seed.js
```

This script will create sample products and users for testing.

## 📝 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload (uses Nodemon)

## 🚀 Deployment

### Prerequisites for Deployment
- MongoDB Atlas account or MongoDB server
- Cloudinary account for image hosting
- Heroku, AWS, or other hosting service

### Steps
1. Set environment variables on hosting platform
2. Push code to repository
3. Configure hosting to run `npm start`
4. Set `NODE_ENV=production`

## 🔍 Monitoring & Logging

- **Morgan**: HTTP request logging
- **Console Logs**: Development debugging
- **Error Handling**: Centralized error middleware

## 🤝 Contributing

1. Create feature branches
2. Follow REST API conventions
3. Write clear commit messages
4. Test endpoints thoroughly
5. Submit pull requests

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Mongoose Documentation](https://mongoosejs.com)
- [JWT Documentation](https://jwt.io)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

---

**API Ready! 🚀**
