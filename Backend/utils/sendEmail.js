import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export default async function sendEmail(to, otp) {
  const htmlContent = `
    <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
        padding: 0;
        background: #f0f4ff;
        color: #1e293b;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        border: 1px solid #e2e8f0;
      }
      .header {
        background: linear-gradient(135deg, #3b82f6, #6366f1);
        padding: 30px;
        text-align: center;
        color: white;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 700;
        letter-spacing: 1px;
      }
      .body {
        padding: 40px 35px;
        text-align: center;
      }
      .body h2 {
        font-size: 24px;
        margin-bottom: 15px;
        font-weight: 600;
      }
      .otp-box {
        display: inline-block;
        padding: 25px 40px;
        margin: 25px 0;
        border-radius: 16px;
        font-size: 38px;
        font-weight: 700;
        color: #333333;
        background: #E6EDFF;
        background-size: 600% 600%;
        animation: gradientAnimation 8s ease infinite;
        box-shadow: 0 8px 20px rgba(59,130,246,0.4);
        letter-spacing: 5px;
      }
      @keyframes gradientAnimation {
        0%{background-position:0% 50%}
        50%{background-position:100% 50%}
        100%{background-position:0% 50%}
      }
      .body p {
        font-size: 16px;
        color: #475569;
        line-height: 1.6;
        margin-bottom: 15px;
      } .spam-warning {
        margin-top: 25px;
        font-size: 14px;
        color: #b91c1c;
        background: #fee2e2;
        padding: 12px 15px;
        border-radius: 12px;
        line-height: 1.5;
      }
      .support {
        margin-top: 25px;
        font-size: 14px;
        color: #64748b;
      }
      .body .countdown {
        font-weight: bold;
        color: #ef4444;
        margin-top: 10px;
      }
      .support {
        margin-top: 30px;
        font-size: 14px;
        color: #64748b;
      }
      .footer {
        background: #f0f4ff;
        padding: 20px;
        text-align: center;
        font-size: 14px;
        color: #94a3b8;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>TickUp Password Reset</h1>
      </div>
      <div class="body">
        <h2>Your One-Time Password (OTP)</h2>
        <p>Use the following OTP to reset your TickUp password. It will expire in <span class="countdown">59 seconds</span>.</p>
        <div class="otp-box">${otp}</div>
<div class="spam-warning">
  ⚠ <strong>Security Notice:</strong> Do not share your OTP with anyone. TickUp will never ask for it. If you did not request a password reset, please ignore this email and contact support immediately.
</div>
        <p>If you did not request a password reset, please ignore this email or contact support.</p>
        <p class="support">Need help? Contact us at: <strong>support@example.com</strong></p>
      </div>
      <div class="footer">
        &copy; 2025 TickUp. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;

  try {
    await transporter.sendMail({
      from: `"TickUp" <${process.env.SMTP_USER}>`,
      to,
      subject: "Your TickUp Password Reset OTP",
      html: htmlContent
    });
  } catch (err) {
    console.error(`Email sending failed to ${to}:`, err);
    throw err;
  }
}
