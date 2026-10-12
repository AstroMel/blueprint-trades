import { useState } from "react";
import { CartProvider, useCart } from "./cart";
import { Ticker, Nav, Hero, Inside, RiskCalc, Shop, Voice, Faq, Footer, MobileBuyBar } from "./sections";
import { CartSheet, Checkout } from "./checkout";

function Store() {
  const { dispatch } = useCart();
  const [checkout, setCheckout] = useState(false);
  return (
    <>
      <Ticker />
      <Nav />
      <main>
        <Hero />
        <Inside />
        <RiskCalc />
        <Shop />
        <Voice />
        <Faq />
      </main>
      <Footer />
      <MobileBuyBar />
      <CartSheet
        onCheckout={() => {
          dispatch({ type: "open", open: false });
          setCheckout(true);
        }}
      />
      <Checkout open={checkout} onOpenChange={setCheckout} />
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Store />
    </CartProvider>
  );
}
