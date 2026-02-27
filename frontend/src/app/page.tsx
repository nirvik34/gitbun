"use client";

import { useState } from "react";
import { C } from "@/styles/palette";
import GrainOverlay      from "@/components/ui/GrainOverlay";
import Nav               from "@/components/layout/Nav";
import Footer            from "@/components/layout/Footer";
import Hero              from "@/components/sections/Hero";
import Playground        from "@/components/sections/Playground";
import Features          from "@/components/sections/Features";
import Docs              from "@/components/sections/Docs";
import GitHubSection     from "@/components/sections/GitHubSection";

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");

  return (
    <div style={{ background: C.cream, minHeight: "100vh", color: C.ink }}>
      <GrainOverlay />
      <Nav activeSection={activeSection} setActiveSection={setActiveSection} />
      <Hero />
      <Playground />
      <Features />
      <Docs />
      <GitHubSection />
      <Footer />
    </div>
  );
}
