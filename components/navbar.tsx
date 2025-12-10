"use client";

import { useEffect, useState } from "react";
import NavbarServer from "./NavbarServer";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b border-b-foreground/10 h-16 transition-colors duration-300 ${
        scrolled ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <NavbarServer />
    </nav>
  );
}
