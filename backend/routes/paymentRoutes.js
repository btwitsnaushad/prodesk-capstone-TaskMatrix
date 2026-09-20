const express = require('express');
const router = express.Router();

// Required to ensure this file can securely read environment variables from .env
require('dotenv').config(); 

// Initialize Stripe with your Secret Key from .env
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const authMiddleware = require('../middleware/authMiddleware');

// ==========================================
// ROUTE: POST /api/payment/create-checkout-session
// GOAL: Generate a secure Stripe payment URL for the "Upgrade to Pro" feature
// ==========================================
router.post('/create-checkout-session', authMiddleware, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'TaskMatrix Pro Upgrade',
              description: 'Unlock premium task management features.',
            },
            // Amount is in cents ($9.99 = 999 cents)
            unit_amount: 999, 
          },
          quantity: 1,
        },
      ],
      // Redirect paths after Stripe finishes the transaction
      success_url: 'http://localhost:5173/dashboard?success=true',
      cancel_url: 'http://localhost:5173/dashboard?canceled=true',
    });

    // Send the generated Stripe URL back to the React frontend
    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Error:', error.message);
    res.status(500).json({ error: 'Failed to create Stripe checkout session.' });
  }
});

module.exports = router;