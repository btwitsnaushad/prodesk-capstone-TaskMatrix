const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// ==========================================
// ROUTE: POST /api/auth/register
// GOAL: Take new user details, secure the password, and create an account.
// ==========================================
router.post('/register', async (req, res) => {
  try {
    // FIX: Added 'username' to the destructured variables to receive it from the frontend payload
    const { name, username, email, password } = req.body;

    // Step 1: Basic validation. We shouldn't bother the database if the user forgot a field.
    if (!name || !username || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields (name, username, email, password).' });
    }

    // Step 2: Check for existing users. Nobody likes duplicate account bugs.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    // Step 3: Security first! Never store plain-text passwords. We salt and hash it here.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Step 4: Build the user profile and save it to MongoDB.
    const newUser = new User({
      name,
      username, // FIX: Passed the username to the database model to satisfy the unique index requirement
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Step 5: Create a session token so the user doesn't have to log in immediately after signing up.
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // A 7-day session gives a good balance of User Experience and Security
    );

    // Step 6: Success! Send back the token and user data (but keep the password hidden).
    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
      },
    });

  } catch (error) {
    // Log the messy error for us to debug in the terminal, but give the user a friendly apology.
    console.error('Registration Error:', error.message);
    res.status(500).json({ error: 'Our servers hit a snag while creating your account. Please try again later.' });
  }
});

// ==========================================
// ROUTE: POST /api/auth/login
// GOAL: Verify credentials and log the user in with a fresh token.
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1: Quick check to ensure they actually typed something in both boxes.
    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both your email and password.' });
    }

    // Step 2: Look up the user in the database. 
    const user = await User.findOne({ email });
    
    // Note: We use the exact same generic error message for both wrong email and wrong password.
    // This is a standard security practice so hackers can't "guess" which emails are registered in our app.
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Step 3: Check if the typed password matches our scrambled (hashed) password in the database.
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' }); 
    }

    // Step 4: Everything looks good! Let's mint a new JWT for this login session.
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } 
    );

    // Step 5: Send the welcome back response.
    res.status(200).json({
      message: 'Login successful! Welcome back.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ error: 'An unexpected server error occurred during login. Please try again.' });
  }
});

module.exports = router;