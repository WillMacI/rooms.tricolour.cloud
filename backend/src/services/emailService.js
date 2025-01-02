// backend/services/emailService.js
const postmark = require('postmark');
require('dotenv').config({ path: '../config/.env' });

// Initialize the Postmark client with your server API token
const client = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN);

const sendEmail = async (to, from, templateAlias, templateModel) => {
    try {
        const response = await client.sendEmailWithTemplate({
            From: from,
            To: to,
            TemplateAlias: templateAlias,
            TemplateModel: templateModel,
        });
        console.log('Email sent successfully:', response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendEmail };