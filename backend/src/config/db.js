const { Sequelize } = require('sequelize');
require('dotenv').config({ path: './config/.env' });

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: true, // Disable SQL query logs (optional)
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL connected successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
