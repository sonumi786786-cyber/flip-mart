# FlipMart - E-Commerce Platform

A full-stack e-commerce application built with React, Node.js/Express, and MongoDB. FlipMart provides a complete shopping experience with product browsing, cart management, checkout, and order processing.

## 🚀 Features

### Frontend
- **Product Catalog**: Browse products by category with search functionality
- **Product Details**: View detailed product information with images
- **Shopping Cart**: Add/remove items, manage quantities
- **Checkout**: Secure order checkout with coupon support
- **User Authentication**: Sign up and login functionality
- **Order History**: View past orders
- **User Profile**: Manage profile information
- **Recently Viewed**: Track recently viewed products
- **Chat Widget**: Customer support chat integration
- **Responsive Design**: Mobile-friendly interface

### Backend
- **RESTful API**: Complete API for all operations
- **User Management**: Authentication, registration, profile management
- **Product Management**: Product catalog with image uploads via Cloudinary
- **Shopping Cart**: Cart management and operations
- **Orders**: Order creation and tracking
- **Coupons**: Discount code management
- **Authentication**: JWT-based secure authentication
- **Security**: Rate limiting, input validation, password hashing
- **Notifications**: Email and SMS notifications via Nodemailer and Twilio

## 📁 Project Structure

```
flipmart/
├── backend/                 # Node.js/Express server
│   ├── config/             # Database and environment configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Authentication and other middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── server.js          # Express server setup
│   ├── seed.js            # Database seeding
│   └── package.json
│
├── frontend/              # React/Vite application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Auth/     # Authentication modal
│   │   │   ├── Cart/     # Shopping cart panel
│   │   │   ├── Chat/     # Chat widget
│   │   │   ├── Common/   # Shared components
│   │   │   ├── Navbar/   # Navigation bar
│   │   │   └── Product/  # Product components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── store/        # State management (Zustand)
│   │   ├── styles/       # CSS styles
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   ├── public/           # Static assets
│   ├── index.html        # HTML template
│   ├── vite.config.js    # Vite configuration
│   └── package.json
│
└── README.md            # This file
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **ESLint** - Code linting

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Cloudinary** - Image hosting
- **Nodemailer** - Email service
- **Twilio** - SMS service
- **Express Validator** - Input validation
- **Express Rate Limit** - Rate limiting
- **Morgan** - HTTP logging
- **Multer** - File upload handling
- **Nodemon** - Development server auto-reload

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Cloudinary account
- Nodemailer configuration (Gmail/other provider)
- Twilio account (optional, for SMS)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file with the following variables**
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   # Email Configuration (Nodemailer)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   
   # Twilio Configuration (Optional)
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   TWILIO_PHONE_NUMBER=your_twilio_phone
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

4. **Seed the database (optional)**
   ```bash
   node seed.js
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env.local file (if needed for API configuration)**
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   Application will run on `http://localhost:5173`

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `GET /api/products/search` - Search products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status (admin)

### Coupons
- `GET /api/coupons` - Get all coupons
- `POST /api/coupons` - Create coupon (admin)
- `DELETE /api/coupons/:id` - Delete coupon (admin)

## 📝 Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for secure authentication:
- Tokens are stored in cookies/localStorage
- Routes are protected with middleware authentication
- Passwords are hashed using bcryptjs

## 🎨 Styling

The frontend uses custom CSS with responsive design principles:
- Mobile-first approach
- CSS modules and global styles
- Responsive grid and flexbox layouts

## 📧 Email & SMS

- **Email**: Configured via Nodemailer (Gmail recommended)
- **SMS**: Optional Twilio integration for SMS notifications

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 📞 Support

For issues or questions, please create an issue in the repository or contact support through the chat widget.

---

**Happy Shopping! 🛒**
