import User from '../models/user.js';
import sendEmail from '../utils/sendEmail.js';
import generateOTP from '../utils/generateOTP.js';
import bcrypt from 'bcrypt';

let otpStore = {};  // In-memory for dev; replace with DB for production

// Auto clean expired OTPs every 30s (optional)
setInterval(() => {
  const now = Date.now();
  for (const email in otpStore) {
    if (otpStore[email].expires < now) {
      delete otpStore[email];
    }
  }
}, 30 * 1000); // 30 secs

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOTP();
    otpStore[email] = { otp, expires: Date.now() + 59 * 1000 }; // 59 sec expiry

    await sendEmail(email, `Your OTP : ${otp}`);

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error("Error in requestPasswordReset:", err);
    res.status(500).json({ message: 'Error sending OTP', error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

   const storedOtp = otpStore[email];

if (!storedOtp || storedOtp.otp !== otp || Date.now() >= storedOtp.expires) {
  return res.status(400).json({ message: 'Invalid or expired OTP' });
}

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email }, { password: hashedPassword });

    delete otpStore[email]; // Remove OTP after successful reset
    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    res.status(500).json({ message: 'Error resetting password', error: err.message });
  }
};
