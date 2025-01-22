import React, { useState } from "react";
import { View, Button, Alert, ActivityIndicator } from "react-native";
import { useConfirmPayment, StripeProvider, CardField } from "@stripe/stripe-react-native";
import { API_URL, PUBLISHABLE_KEY } from "@env";  // Import API_URL and PUBLISHABLE_KEY from .env

const StripeApp = () => {
  const [loading, setLoading] = useState(false);
  const { confirmPayment } = useConfirmPayment();
  const [cardDetails, setCardDetails] = useState();

  // Fetch client secret from backend
  const fetchPaymentIntentClientSecret = async () => {
    try {
      const response = await fetch(`${API_URL}/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch client secret");
      }

      const { clientSecret } = await response.json();
      return { clientSecret };
    } catch (error) {
      console.error("Error fetching client secret:", error);
      Alert.alert("Error", error.message || "An unknown error occurred");
    }
  };

  // Handle payment button press
  const handlePayPress = async () => {
    // Check if card details are complete
    if (!cardDetails?.complete) {
      Alert.alert("Please complete your card details");
      return;
    }

    setLoading(true);

    const { clientSecret } = await fetchPaymentIntentClientSecret();

    if (!clientSecret) {
      setLoading(false);
      return;
    }

    // Confirm payment with the obtained client secret
    const { paymentIntent, confirmError } = await confirmPayment(clientSecret, {
      type: "Card",
      paymentMethod: {
        card: cardDetails,
      },
    });

    setLoading(false);

    // Handle confirmation result
    if (confirmError) {
      Alert.alert("Payment failed", confirmError.message);
    } else {
      Alert.alert("Payment successful!", `Payment ID: ${paymentIntent.id}`);
    }
  };

  return (
    <StripeProvider publishableKey={PUBLISHABLE_KEY}>
      <View style={{ padding: 20 }}>
        {/* CardField: Collecting card information */}
        <CardField
          postalCodeEnabled={false}  // Optionally disable postal code
          placeholder={{
            number: "4242 4242 4242 4242",  // Test card number
          }}
          onCardChange={(cardDetails) => setCardDetails(cardDetails)}  // Update card details on change
          style={{
            height: 50,
            marginVertical: 30,
          }}
        />

        {/* Display loading indicator or Pay button */}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button onPress={handlePayPress} title="Pay" />
        )}
      </View>
    </StripeProvider>
  );
};

export default StripeApp;