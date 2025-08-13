import User from '../models/user.js';
import sendEmail from '../utils/sendEmail.js';
import generateOTP from '../utils/generateOTP.js';
import bcrypt from 'bcrypt';

let otpStore = {}; // In-memory for dev; replace with DB for production

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log("Password reset requested for:", email);

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOTP();
    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // 5 min expiry
    // console.log("Generated OTP:", otp);

    await sendEmail(email, `Your password reset OTP is: ${otp}`);

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
    if (!storedOtp || storedOtp.otp !== otp || storedOtp.expires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email }, { password: hashedPassword });

    delete otpStore[email]; // Remove used OTP
    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    res.status(500).json({ message: 'Error resetting password', error: err.message });
  }
};
