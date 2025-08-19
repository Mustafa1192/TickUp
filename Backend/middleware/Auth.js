import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const auth = async (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '') || 
                req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'No token, authorization denied' 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user ID - prioritize userId, then user.id, then id
    const userId = decoded.userId || decoded.user?.id || decoded.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token structure' 
      });
    }

    // Verify user exists and select password for auth routes
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'User no longer exists' 
      });
    }

    // Attach consistent user references to request
    req.user = user;
    req.userId = user._id; // Always use _id for consistency
    
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    
    const message = err.name === 'TokenExpiredError' 
      ? 'Token has expired' 
      : 'Token is not valid';
    
    res.status(401).json({ 
      success: false,
      message 
    });
  }
};

export default auth;
