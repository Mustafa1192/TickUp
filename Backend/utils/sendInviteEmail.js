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

export default async function sendInviteEmail(to, taskTitle, description, dueDate, inviter, signupLink) {
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
        max-width: 650px;
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
        padding: 35px 30px;
      }
      .body h2 {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 10px;
        text-align: center;
      }
      .task-details {
        background: #E6EDFF;
        padding: 20px;
        border-radius: 15px;
        margin: 20px 0;
        box-shadow: 0 5px 15px rgba(59,130,246,0.15);
      }
      .task-details p {
        margin: 5px 0;
        font-size: 16px;
        color: #1e293b;
      }
      .join-button {
        display: block;
        width: max-content;
        margin: 25px auto;
        padding: 12px 30px;
        background: #3b82f6;
        color: #ffffff !important; /* Make text white */
        text-decoration: none !important;
        border-radius: 8px;
        font-weight: 600;
        text-align: center;
}

      .body p.description {
        font-size: 16px;
        color: #475569;
        line-height: 1.6;
        text-align: center;
      }
      .spam-warning {
        margin-top: 25px;
        font-size: 14px;
        color: #b91c1c;
        background: #fee2e2;
        padding: 12px 15px;
        border-radius: 12px;
        line-height: 1.5;
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
        <h1>TickUp Task Invitation</h1>
      </div>
      <div class="body">
        <h2>You've been invited to a task!</h2>
        <div class="task-details">
          <p><strong>Task Title:</strong> ${taskTitle}</p>
          <p><strong>Description:</strong> ${description}</p>
          <p><strong>Due Date:</strong> ${dueDate}</p>
          <p><strong>Invited By:</strong> ${inviter}</p>
        </div>
        <p class="description">Click the button below to join this task and collaborate with your team efficiently.</p>
        <a href="${signupLink}" class="join-button">Join Task</a>
        <div class="spam-warning">
          ⚠ Security Notice: This email is intended for the recipient only. Do not share your login credentials or links. If you did not expect this email, please ignore it or contact support immediately.
        </div>
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
      subject: `Invitation to join task "${taskTitle}"`,
      html: htmlContent
    });
    console.log(`Invite email sent to ${to}`);
  } catch (err) {
    console.error(`Error sending invite email to ${to}:`, err);
    throw err;
  }
}
