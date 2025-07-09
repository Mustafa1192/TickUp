// const jwt = require('jsonwebtoken');
// const User = require('../models/user');

// module.exports = async function(req, res, next) {
//   // Get token from header
//   let token;
//   const authHeader = req.header('Authorization');
  
//   if (authHeader && authHeader.startsWith('Bearer ')) {
//     token = authHeader.split(' ')[1];
//   } else {
//     token = req.header('x-auth-token');
//   }

//   if (!token) {
//     return res.status(401).json({ msg: 'No token, authorization denied' });
//   }

//   try {
//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     // Handle different token payload structures
//     const userId = decoded.user?.id || decoded.userId || decoded.id;
    
//     if (!userId) {
//       return res.status(401).json({ msg: 'Invalid token structure' });
//     }

//     // Verify user exists
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(401).json({ msg: 'User no longer exists' });
//     }

//     // Attach user to request
//     req.user = user;
//     req.userId = user._id;
    
//     next();
//   } catch (err) {
//     console.error('Token verification error:', err);
    
//     if (err.name === 'TokenExpiredError') {
//       return res.status(401).json({ msg: 'Token has expired' });
//     }
    
//     res.status(401).json({ msg: 'Token is not valid' });
//   }
// };
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async function(req, res, next) {
  // Get token from header
  let token;
  const authHeader = req.header('Authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    token = req.header('x-auth-token');
  }

  if (!token) {
    return res.status(401).json({ 
      success: false,  // Consistent with your other responses
      message: 'No token, authorization denied' 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user ID from token
    const userId = decoded.userId; // Assuming your token always has userId
    
    // Verify user exists
    const user = await User.findById(userId).select('+password');;
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'User no longer exists' 
      });
    }

    // Attach the full user object to request
    req.user = user;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token has expired' 
      });
    }
    
    res.status(401).json({ 
      success: false,
      message: 'Token is not valid' 
    });
  }
};