import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import { CardField, useConfirmPayment } from "@stripe/stripe-react-native";
import { API_URL } from "@env";  // Import the API_URL from .env

const StripeApp = () => {
  const [email, setEmail] = useState("");
  const [cardDetails, setCardDetails] = useState({});
  const { confirmPayment, loading } = useConfirmPayment();

  const fetchPaymentIntentClientSecret = async () => {
    try {
      const response = await fetch(`${API_URL}/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const { clientSecret, error } = await response.json();
      return { clientSecret, error };
    } catch (error) {
      console.error("Error fetching client secret:", error);
    }
  };

  const handlePayPress = async () => {
    if (!cardDetails?.complete || !email) {
      Alert.alert("Please enter valid card details and email");
      return;
    }

    const billingDetails = { email };
    const { clientSecret, error } = await fetchPaymentIntentClientSecret();

    if (error) {
      Alert.alert("Payment failed", error);
      return;
    }

    const { paymentIntent, confirmError } = await confirmPayment(clientSecret, {
      type: "Card",
      billingDetails,
    });

    if (confirmError) {
      Alert.alert("Payment failed", confirmError.message);
    } else {
      Alert.alert("Payment successful!");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="E-mail"
        keyboardType="email-address"
        onChangeText={setEmail}
        style={styles.input}
      />
      <CardField
        postalCodeEnabled={false}
        placeholder={{ number: "4242 4242 4242 4242" }}
        cardStyle={styles.card}
        style={styles.cardContainer}
        onCardChange={setCardDetails}
      />
      <Button onPress={handlePayPress} title="Pay" disabled={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  input: { backgroundColor: "#f1f1f1", padding: 10, marginBottom: 10 },
  cardContainer: { height: 50, marginVertical: 30 },
  card: { backgroundColor: "#fff" },
});

export default StripeApp;
