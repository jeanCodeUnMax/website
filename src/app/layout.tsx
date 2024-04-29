import { Component } from "@/lib/components/utils/component";
import { PropsWithChildren } from "react";
import "./globals.css";

const RootLayout: Component<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
    <body className="bg-[#1A1A1A]">
      {children}
    </body>
    </html>
  );
}

export default RootLayout;