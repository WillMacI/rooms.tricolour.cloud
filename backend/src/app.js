const express = require('express');
const cors = require('cors'); // Import cors
const { connectDB } = require('./config/db');
const User = require('./models/User');
const Room = require('./models/Room');
const Booking = require('./models/Booking');
const Organization = require('./models/Organization');
const OTP = require('./models/OTP');

const app = express();
app.use(express.json()); // Middleware to parse JSON
app.use(cors()); // Use cors middleware

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
        await OTP.sync(); // Sync OTP
        console.log('Database tables created successfully.');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
})();

// Routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const orgRoutes = require('./routes/orgRoutes');

app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/organizations', orgRoutes);
// Example route
app.get('/', (req, res) => {
    res.send('Room Booking API is running...');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
