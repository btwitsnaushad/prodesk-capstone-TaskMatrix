const jwt = require('jsonwebtoken');

// This middleware acts as a security guard for protected backend routes
const verifyToken = (req, res, next) => {
  // Step 1: Extract the authorization header from the incoming request
  const authHeader = req.header('Authorization');
  
  // If the header is missing or doesn't follow the "Bearer <token>" format, deny access
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access Denied. No token provided.' });
  }

  try {
    // Step 2: Extract the actual token string by removing the "Bearer " prefix
    const token = authHeader.split(' ')[1];
    
    // Step 3: Cryptographically verify the token using your environment's secret key
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // Step 4: If valid, attach the decoded user payload to the request object
    req.user = verified;
    
    // Step 5: Proceed to the next middleware or the actual route controller
    next();
  } catch (error) {
    // Catch tampered, malformed, or expired tokens and reject the request
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;