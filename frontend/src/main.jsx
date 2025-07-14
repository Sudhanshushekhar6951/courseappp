import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe(
  "pk_test_51RhSscFVrMcLl79yBf1Bj34kUvl49KoMzMUFwLj9vAbBbE9XTb5LjoGMAgq8eMFjKQkJCR9Ptdz4YK8OJGOOUrof00GN64MotW"
);

createRoot(document.getElementById("root")).render(
  <Elements stripe={stripePromise}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Elements>
);