require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// Connect to Database
connectDB();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Gramzo API running');
});


const categoryRoutes = require('./routes/categoryRoutes');
const agentRoutes = require('./routes/agentRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const productRoutes = require('./routes/productRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const agentDashboardRoutes = require('./routes/agentDashboardRoutes');
const userRoutes = require('./routes/userRoutes');
const marketRoutes = require('./routes/marketRoutes');

app.use('/api/categories', categoryRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/products', productRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/agent', agentDashboardRoutes);
app.use('/api/user', userRoutes);
// Removed redundant /api/market route

// Serve Static Frontend (after API routes)
const frontendPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(frontendPath));

// Catch-all route to serve index.html for React Router
// Using a regex literal (/.*/) to avoid PathError in Express 5.2.x+
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
