"use client";

import Nav from "@/components/layout/Nav";
import Hero from "@/components/sections/Hero";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh", color: "#fff", position: "relative" }}>
      {/* Radial glow background */}
      <div style={{
        position: "fixed", inset: 0,
        background: "radial-gradient(circle at 50% 40%, rgba(63,131,248,0.12) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <Nav />
        <Hero />
        <Footer />
      </div>
    </div>
  );
}
