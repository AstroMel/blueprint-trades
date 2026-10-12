import { Consult, DigitalApp } from "./consult";
import { useState } from "react";
import { CartProvider, useCart } from "./cart";
import { Nav, TrustStrip, ScrollAids, Backdrop, Hero, Photos, Letter, Inside, Channel, Shop, Voice, Faq, Footer, MobileBuyBar } from "./sections";
import { CartSheet, Checkout } from "./checkout";
import { LiveTicker } from "./ticker";
import { RiskCalc } from "./riskcalc";
import { Stage } from "./stage";
import { LegalDialog } from "./legal";

function Store() {
  const { dispatch } = useCart();
  const [checkout, setCheckout] = useState(false);
  return (
    <>
      <Backdrop />
      <ScrollAids />
      {/* Quote bar and navigation stay pinned together at the top while scrolling. */}
      <div className="sticky top-[env(safe-area-inset-top,0px)] z-40">
        <LiveTicker />
        <Nav />
      </div>
      <main>
        <Hero />
        <TrustStrip />
        <Stage n={2} />
        <Photos />
        <Stage n={3} />
        <Letter />
        <Stage n={4} />
        <Inside />
        <Stage n={5} />
        <Channel />
        <Stage n={6} />
        <RiskCalc />
        <Stage n={7} />
        <Shop />
        <Stage n={8} />
        <DigitalApp />
        <Stage n={9} />
        <Consult />
        <Voice />
        <Stage n={10} />
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
