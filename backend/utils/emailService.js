const nodemailer = require('nodemailer');
require('dotenv').config();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});
const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    };
    let info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${info.response}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
module.exports = sendEmail ;

