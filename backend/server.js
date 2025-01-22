const express = require("express");
const dotenv = require("dotenv");
const Stripe = require("stripe");
const cors = require("cors");

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Check if SECRET_KEY is loaded correctly
if (!process.env.SECRET_KEY) {
  console.error("Stripe secret key is missing. Check your .env file.");
  process.exit(1);
}

// Initialize Stripe with the correct key
const stripe = new Stripe(process.env.SECRET_KEY, { apiVersion: "2020-08-27" });

app.use(express.json());
app.use(cors());

app.post("/create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099, // Amount in the smallest unit (cents)
      currency: "usd",
      payment_method_types: ["card"],
    });

    console.log(paymentIntent); // Log the payment intent for debugging

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});


app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
