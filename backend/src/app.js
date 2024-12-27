const express = require('express');
const { connectDB } = require('./config/db');
const User = require('./models/User');
const Room = require('./models/Room');
const Booking = require('./models/Booking');
const Organization = require('./models/Organization');

const app = express();
app.use(express.json()); // Middleware to parse JSON

// Connect to database
connectDB();

require('dotenv').config({ path: './config/.env' });

// Sync Sequelize models with database
(async () => {
    try {
        await Organization.sync(); // Sync Organization model
        await User.sync(); // Sync User model
        await Room.sync(); // Sync Room model
        await Booking.sync(); // Sync Booking model
        console.log('Database tables created successfully.');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
})();

// Routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/users', userRoutes);
app.use('/auth', authRoutes);

// Example route
app.get('/', (req, res) => {
    res.send('Room Booking API is running...');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
