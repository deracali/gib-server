import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const paymentRoutes = express.Router();

// ✅ Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Create Stripe Checkout Session (expects URL params)
paymentRoutes.get("/create-intent", async (req, res) => {
  const { name, email, course, amount } = req.query;

  try {
    // ✅ Validate required parameters
    if (!name || !email || !course || !amount) {
      return res.status(400).json({ error: "Missing required parameters." });
    }

    // ✅ Convert amount to cents (Stripe requires integer)
    const stripeAmount = Math.round(Number(amount) * 100);

    // ✅ Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Enrollment for ${course}`,
              description: `Payment for application`,
            },
            unit_amount: stripeAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3001/payment/success", // ✅ change to your success page
      cancel_url: "https://gitb.lt/cancel",   // ✅ change to your cancel page
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("❌ Stripe session error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default paymentRoutes;
