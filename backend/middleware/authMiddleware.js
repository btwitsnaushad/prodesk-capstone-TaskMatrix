const jwt = require('jsonwebtoken');

// ==========================================
// MIDDLEWARE: The Security Guard for Protected Routes
// GOAL: Intercept incoming requests and verify if the user has a valid session token.
// ==========================================
const authMiddleware = (req, res, next) => {
  try {
    // Step 1: Look for the token in the request headers.
    const authHeader = req.header('Authorization');
    
    // If the header is missing altogether, stop them right here.
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No authentication token provided.' });
    }

    // Extract just the token string (remove the "Bearer " part)
    const token = authHeader.split(' ')[1];

    // Step 2: Verify the token's authenticity. 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Step 3: Attach the decoded user ID to the request object.
    // Now whichever route handles this request next will know EXACTLY which user is making the request.
    req.user = decoded.userId;
    
    // Step 4: Everything looks solid. Pass the baton to the actual route handler.
    next();
    
  } catch (error) {
    console.error('Authentication Error:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
  }
};

module.exports = authMiddleware;