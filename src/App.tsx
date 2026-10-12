import { Consult, DigitalApp } from "./consult";
import { useState } from "react";
import { CartProvider, useCart } from "./cart";
import { Nav, TrustStrip, ScrollAids, Backdrop, Hero, Photos, Letter, Inside, Channel, RiskCalc, Shop, Voice, Faq, Footer, MobileBuyBar } from "./sections";
import { CartSheet, Checkout } from "./checkout";
import { LiveTicker } from "./ticker";
import { LegalDialog } from "./legal";

function Store() {
  const { dispatch } = useCart();
  const [checkout, setCheckout] = useState(false);
  return (
    <>
      <Backdrop />
      <ScrollAids />
      <LiveTicker />
      <Nav />
      <main>
        <Hero />
        <TrustStrip />
        <Photos />
        <Letter />
        <Inside />
        <Channel />
        <RiskCalc />
        <Shop />
        <DigitalApp />
        <Consult />
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
      <LegalDialog />
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
