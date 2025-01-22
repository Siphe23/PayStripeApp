import { StripeProvider } from "@stripe/stripe-react-native";
import StripeApp from "./StripeApp";
import { PUBLISHABLE_KEY } from "@env";  // Ensure the .env file is correctly configured

export default function App() {
  return (
    <StripeProvider publishableKey={PUBLISHABLE_KEY}>
      <StripeApp />
    </StripeProvider>
  );
}