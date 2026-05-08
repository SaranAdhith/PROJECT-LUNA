"use client";

import StarField from "./StarField";
import Navbar from "./Navbar";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StarField />
      <Navbar />
      {children}
    </>
  );
}
