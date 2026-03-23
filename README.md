# 🛒 Full-Stack React Native E-Commerce App

A complete, cross-platform e-commerce mobile application for **iOS and Android**, accompanied by a robust **Node.js/Express** backend. This project features a fully functional user-facing shopping app alongside an integrated admin dashboard for managing products, orders, and users.

---

## 🚀 Project Overview

This application provides a seamless online shopping experience. Users can authenticate securely, browse categories, search and filter products, manage their cart and wishlist, and complete secure checkouts. The integrated Admin Panel allows store owners to track revenue, manage inventory (CRUD operations), and update order statuses in real-time.

---

## 💻 Tech Stack & Architecture

### Frontend (Mobile App)
| Layer | Technology |
|-------|-----------|
| Framework | React Native & Expo |
| Styling | Tailwind CSS (via NativeWind v4) |
| Navigation | Expo Router (File-based routing) |
| State Management | React Context API (Cart & Wishlist) |
| Authentication | Clerk Expo |

### Backend (Server & API)
| Layer | Technology |
|-------|-----------|
| Runtime / Framework | Node.js, Express.js (TypeScript) |
| Database | MongoDB Atlas & Mongoose |
| Image Storage | Cloudinary & Multer |
| Deployment | Vercel |

### DevOps & Tooling
| Tool | Purpose |
|------|---------|
| CodeRabbit | AI-automated pull request reviews |
| EAS | Expo Application Services (Build & Deploy) |

---

## ✨ Key Features

### 🛍️ User Application

- **Secure Authentication** — Sign up, sign in, and user management synced via Clerk Webhooks.
- **Dynamic Screens** — Home screen with promotional sliders, category navigation, and popular product grids.
- **Shop & Search** — Complete product catalogs with search functionality and infinite scrolling (pagination).
- **Product Details** — Interactive image carousels, ratings, prices, sizes, and descriptions.
- **Shopping Cart** — Add/remove products, manage quantities, and calculate subtotals, shipping, and taxes.
- **Checkout Flow** — Manage shipping addresses and choose payment methods (Cash on Delivery / Card).
- **User Profile** — Track order history, view saved wishlist items, and manage account settings.

### 🛠️ Admin Dashboard

- **Analytics Overview** — Track total revenue, total orders, total products, and user count.
- **Order Management** — View recent orders and dynamically update order statuses (`Placed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
- **Inventory Control** — Add new products (with multi-image upload), edit existing product details, and delete items from the database.

---

## 🛠️ Installation & Setup Guide

### 1. Prerequisites

Ensure you have the following installed and configured:

- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas)
- [Clerk Account](https://clerk.com/)
- [Cloudinary Account](https://cloudinary.com/)

### 2. Clone the Repository

```bash
git clone <your-repository-url>
cd e-commerce-app
```

---

### 3. Backend Setup (`/server`)

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

#### Environment Variables — `server/.env`

Create a `.env` file in the `/server` root and add the following:

```env
MONGODB_URI=your_mongodb_connection_string
CLERK_WEBHOOK_SIGNING_SECRET=your_clerk_webhook_secret
ADMIN_EMAIL=your_admin_email@example.com
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### Start the Server

```bash
npm run server
```

> **Note:** The server runs on `http://localhost:3000` by default.

---

### 4. Frontend Setup (`/client`)

Navigate to the client directory and install dependencies:

```bash
cd ../client
npm install
```

#### Environment Variables — `client/.env`

Create a `.env` file in the `/client` root and add your Clerk publishable key:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

#### Configure API URL — `client/constants/api.ts`

Ensure your Axios instance points to your local machine's IP address (development) or your deployed backend URL (production):

```typescript
const LOCAL_API_URL = Platform.select({
  ios: 'http://<YOUR_LOCAL_IP>:3000/api',
  android: 'http://<YOUR_LOCAL_IP>:3000/api',
  default: 'http://localhost:3000/api'
});
```

#### Start the App

```bash
npm run start
```

> Scan the QR code with the **Expo Go** app on your physical device, or press `a` for Android Emulator / `i` for iOS Simulator.

---

## 🏗️ Building for Production

Create a standalone APK (Android) or IPA (iOS) for testing or distribution using **Expo Application Services (EAS)**.

### Step 1 — Log in to your Expo account

```bash
eas login
```

### Step 2 — Configure the project

```bash
eas build:configure
```

### Step 3 — Build for Android (APK)

Ensure your `eas.json` is configured for APK generation, then run:

```bash
eas build --platform android --profile preview
```

---

## 📁 Project Structure

```
e-commerce-app/
├── client/               # React Native Expo frontend
│   ├── app/              # Expo Router file-based routes
│   ├── components/       # Reusable UI components
│   ├── constants/        # API config, theme, etc.
│   └── context/          # Cart & Wishlist context providers
└── server/               # Node.js / Express backend
    ├── src/
    │   ├── routes/        # API route handlers
    │   ├── models/        # Mongoose data models
    │   └── middleware/    # Auth, upload, error handling
    └── .env               # Environment variables
```

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
