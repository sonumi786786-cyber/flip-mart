# FlipMart Frontend

The React frontend application for FlipMart e-commerce platform. Built with React 19, Vite, and modern web technologies.

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will start on `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Code Linting

```bash
npm lint
```

## 📦 Dependencies

- **React 19** - UI library
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Auth/           # Authentication modal
│   ├── Cart/           # Shopping cart components
│   ├── Chat/           # Chat widget
│   ├── Common/         # Shared components (Footer, etc)
│   ├── Navbar/         # Navigation bar
│   └── Product/        # Product display components
├── pages/              # Full page components
│   ├── HomePage.jsx
│   ├── CategoryPage.jsx
│   ├── ProductDetailPage.jsx
│   ├── CartPage.jsx
│   ├── CheckoutPage.jsx
│   ├── OrdersPage.jsx
│   ├── ProfilePage.jsx
│   ├── SearchPage.jsx
│   └── SupportPage.jsx
├── services/           # API service layer
│   └── api.js         # Axios instance and API calls
├── store/             # Zustand store
│   └── index.js       # Global state management
├── styles/            # Global styles
├── App.jsx            # Root app component
└── main.jsx           # Application entry point
```

## 🎯 Pages

- **HomePage** - Product listing and featured products
- **CategoryPage** - Browse products by category
- **ProductDetailPage** - Detailed product information
- **SearchPage** - Search results
- **CartPage** - Shopping cart management
- **CheckoutPage** - Order checkout process
- **OrdersPage** - User order history
- **ProfilePage** - User profile management
- **SupportPage** - Customer support

## 🔧 Configuration

The application expects a backend API running on `http://localhost:5000` by default. You can configure the API URL in the `.env.local` file:

```
VITE_API_URL=http://localhost:5000/api
```

## 🎨 Styling

The application uses custom CSS with a responsive design:
- Global styles in `src/styles/main.css`
- Component-specific styles in `src/index.css`
- Mobile-first responsive approach

## 📡 API Integration

All API calls are made through the axios instance in `services/api.js`. The store in `store/index.js` manages global application state using Zustand.

## 🔐 Features

- User authentication and registration
- Product browsing and search
- Shopping cart management
- Checkout with coupon support
- Order history
- User profile management
- Real-time notifications with toast
- Responsive mobile design

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [React Router Documentation](https://reactrouter.com)
- [Zustand Documentation](https://zustand-demo.vercel.app)

## 🤝 Contributing

Feel free to contribute by:
1. Creating feature branches
2. Making your improvements
3. Testing thoroughly
4. Submitting pull requests
