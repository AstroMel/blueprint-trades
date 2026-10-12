import { Consult, DigitalApp } from "./consult";
import { useState } from "react";
import { CartProvider, useCart } from "./cart";
import { Nav, TrustStrip, ScrollAids, Backdrop, Hero, Photos, Letter, Inside, Channel, Shop, Voice, Faq, Footer, MobileBuyBar } from "./sections";
import { CartSheet, Checkout } from "./checkout";
import { LiveTicker } from "./ticker";
import { RiskCalc } from "./riskcalc";
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
