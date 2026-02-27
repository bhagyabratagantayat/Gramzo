# Gramzo
### Smart Local Marketplace & Service Platform with Real-Time Price Updates 🚀

Gramzo is a comprehensive full-stack platform designed to bridge the gap between local service providers, sellers, and community members. It serves as a centralized hub for discovering neighborhood services, participating in a verified marketplace, and staying updated with live local market commodity prices.

---

## 🌟 Key Features

### 👤 User Features
- **Discover & Book**: Browse a wide range of local services (repairs, beauty, health) and book them instantly.
- **Marketplace**: Explore local products for sale in your neighborhood.
- **Market Prices**: View real-time pricing for local commodities and mandis.
- **Stay Notified**: Receive important community and system updates via the notification system.

### 💼 Agent Features
- **Inventory Management**: Add, update, or remove products in the local marketplace.
- **Service Control**: Manage listed services and availability.
- **Booking Workflow**: Review, accept, or reject incoming service requests.
- **Price Governance**: Contribute to community accuracy by updating market prices.

### 🛡️ Admin Features
- **Agent Management**: Onboard and monitor local agents and service providers.
- **System Communications**: Post system-wide notifications and urgent notices.
- **Business Intelligence**: Access the admin dashboard to view platform analytics and trends.
- **Quality Control**: Monitor overall system listings and user interactions.

---

## 🛠️ Tech Stack

**Frontend:**
- **React.js**: Modern component-based UI.
- **CSS / Vanilla CSS**: Custom premium styling with Glassmorphism effects.
- **Vite**: Ultra-fast build tool for development.

**Backend:**
- **Node.js**: Scalable runtime environment.
- **Express.js**: Robust backend API framework.

**Database:**
- **MongoDB**: Flexible NoSQL document database via Mongoose ORM.

**Tools & Others:**
- **Axios**: Promised-based HTTP client for API requests.
- **React Context API**: Global state management (Auth, Theme).
- **Vercel / Render**: Optimized hosting platforms.

---

## 📂 Project Structure

```bash
Gramzo/
├── backend/            # Express server and backend logic
│   ├── config/         # Database and environment configurations
│   ├── controllers/    # Route handlers & business logic
│   ├── middleware/     # Auth and validation middleware
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express API endpoints
│   └── server.js       # Entry point for backend
├── frontend/           # React application (Vite-powered)
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # Global state (AuthContext)
│   │   ├── pages/      # View components (Home, Marketplace, etc.)
│   │   ├── services/   # API interaction layer
│   │   └── utils/      # Helper functions (Image formatting, etc.)
│   └── index.html      # Desktop/Mobile template
```

---

## 🚀 Installation & Setup

Follow these steps to get your local development environment running:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bhagyabratagantayat/Gramzo.git
   cd Gramzo
   ```

2. **Setup Backend:**
   ```bash
   # Install dependencies
   npm install
   
   # Setup .env file
   # Create a .env file in the root and add:
   # MONGO_URI=your_mongodb_connection_string
   # JWT_SECRET=your_secret_key
   # PORT=5000
   
   # Start server
   npm run dev
   ```

3. **Setup Frontend:**
   ```bash
   cd frontend
   npm install
   
   # Start frontend
   npm run dev
   ```

---

## 🔗 Deployment

The platform is designed for seamless deployment on **Render** (Backend) and **Vite-compatible** hosts.
- **Frontend**: [Gramzo Web App](https://gramzo.vercel.app) *(Link Placeholder)*
- **API**: [Gramzo Backend API](https://gramzo.onrender.com) *(Link Placeholder)*

---

## 📷 Screenshots (Placeholders)

| ![Homepage](https://via.placeholder.com/400x250?text=Homepage+UI) | ![Marketplace](https://via.placeholder.com/400x250?text=Marketplace+UI) |
|:---:|:---:|
| **Homepage** | **Marketplace** |
| ![Dashboard](https://via.placeholder.com/400x250?text=Dashboard+UI) | ![Notifications](https://via.placeholder.com/400x250?text=Notification+UI) |
| **Agent Dashboard** | **Notifications System** |

---

## 🔮 Future Features
- ⚡ **Real-time Engine**: Live updates for bookings and alerts via Socket.io.
- 💳 **Payments**: Integration with Razorpay/Stripe for service bookings.
- 💬 **Direct Chat**: Built-in messaging between users and agents.
- 📈 **Price AI**: Predictive analytics for future market price trends.

---

## ✍️ Author
**Bhagyabrata Gantayat**  
*Full Stack Developer*  
[GitHub Profile](https://github.com/bhagyabratagantayat) | [LinkedIn](https://linkedin.com/in/bhagyabrata)

---

## 📄 License
This project is licensed under the **MIT License**. You are free to use, modify, and distribute this software for personal or commercial use.
