const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());
app.use(cors());

const OTP_STORE = {};

app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
  OTP_STORE[email] = otp;
  try {
    let transporter = nodemailer.createTransport({
      host: 'smtpout.secureserver.net',
      port: 465,
      secure: true,
      auth: {
        user: 'sagar@sunidhiagrotech.com',
        pass: process.env.EMAIL_PASS  // password env variable se lo (security!)
      }
    });
    await transporter.sendMail({
      from: '"SAT Kanban" <sagar@sunidhiagrotech.com>',
      to: email,
      subject: 'SAT Kanban OTP for Deletion',
      text: `Your OTP for card deletion is: ${otp}`,
      html: `<div style="font-size:18px;">Your OTP for card deletion is: <b>${otp}</b></div>`
    });
    res.json({ success: true, otp }); // prod me otp nahi bhejna, dev ke liye hai!
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});
app.listen(4444, () => console.log('OTP Server running on port 4444'));
