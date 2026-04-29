# Online Mobile Devices Selling System
A full-stack e-commerce web application built using the MERN stack for selling mobile devices, accessories online. 
The platform allows users to browse products, search and filter items, view detailed specifications, add products 
to the cart, place secure orders, and manage their accounts. 

## 🚀 Features

### Customer Features
- **User Authentication**: Register, Login, Forgot Password, JWT-based authentication
- **Product Browsing**: Browse mobile with categories, search, and filters
- **Product Customization**: Choose Storage capacity, Color selection
- **Shopping Cart**: Add/remove items, quantity management, promo codes
- **Checkout**: Multi-step checkout with delivery info and payment selection
- **Order Tracking**: Real-time order status tracking
- **User Dashboard**: Order history, profile management, favorites

### Admin Features
- **Dashboard**: Total revenue, Total orders, Top-selling products
- **Order Management**: Update order status, view order details
- **Product Management**: Add, edit, delete product with full customization
- **User Management**: View and manage users

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (Mongoose ODM)
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library
- **React Router DOM 6** - Routing
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Icons** - Icon library
- **React Toastify** - Notifications
- **Chart.js** - Analytics charts

### Installation

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```
2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```
3. **Configure Environment Variables**

   Create `.env` file in backend directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   ```
## 🔑 Demo Credentials

### Admin Account
- Email: admin@gmail.com
- Password: admin123

### User Account
- Email: sadeepa@example.com
- Password: test123

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Product
- `GET /api/products` - Get all product
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get users by ID

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status (admin)

### Reviews
- `GET /api/reviews/:productId` - Get reviews for product
- `POST /api/reviews` - Add review

## 📄 License

This project is for educational purposes.

# Screenshot of web application

## Image 1

![image alt](https://github.com/klsadeepas/Online-mobile-sell-application/blob/d40ebe96dd8d67ce24b1cc70b2a78df965d3771b/images/1.png)

## Image 2 

![image alt](https://github.com/klsadeepas/Online-mobile-sell-application/blob/d40ebe96dd8d67ce24b1cc70b2a78df965d3771b/images/2.png)

## Image 3

![image alt](https://github.com/klsadeepas/Online-mobile-sell-application/blob/d40ebe96dd8d67ce24b1cc70b2a78df965d3771b/images/3.png)

## Image 4

![image alt](https://github.com/klsadeepas/Online-mobile-sell-application/blob/d40ebe96dd8d67ce24b1cc70b2a78df965d3771b/images/4.png)

## Image 5

![image alt](https://github.com/klsadeepas/Online-mobile-sell-application/blob/d40ebe96dd8d67ce24b1cc70b2a78df965d3771b/images/5.png)

## Image 6

![image alt](https://github.com/klsadeepas/Online-mobile-sell-application/blob/d40ebe96dd8d67ce24b1cc70b2a78df965d3771b/images/6.png)

## Image 7

![image alt](https://github.com/klsadeepas/Online-mobile-sell-application/blob/d40ebe96dd8d67ce24b1cc70b2a78df965d3771b/images/7.png)

## Image 8

![image alt](https://github.com/klsadeepas/Online-mobile-sell-application/blob/d40ebe96dd8d67ce24b1cc70b2a78df965d3771b/images/8.png)

## Image 9

![image alt](https://github.com/klsadeepas/Online-mobile-sell-application/blob/d40ebe96dd8d67ce24b1cc70b2a78df965d3771b/images/9.png)

## Image 10

![image alt](https://github.com/klsadeepas/Online-mobile-sell-application/blob/d40ebe96dd8d67ce24b1cc70b2a78df965d3771b/images/10.png)

## Image 11

![image alt](https://github.com/klsadeepas/Online-mobile-sell-application/blob/d40ebe96dd8d67ce24b1cc70b2a78df965d3771b/images/11.png)
