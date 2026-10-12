import { useState } from "react";
import { CartProvider, useCart } from "./cart";
import { Nav, Hero, Letter, Inside, Channel, RiskCalc, Shop, Voice, Faq, Footer, MobileBuyBar } from "./sections";
import { CartSheet, Checkout } from "./checkout";
import { LiveTicker } from "./ticker";

function Store() {
  const { dispatch } = useCart();
  const [checkout, setCheckout] = useState(false);
  return (
    <>
      <LiveTicker />
      <Nav />
      <main>
        <Hero />
        <Letter />
        <Inside />
        <Channel />
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
