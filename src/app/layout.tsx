import { type ReactNode } from "react";
import type { Metadata } from "next";
import Header from "@/components/Header";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "NftMarketplace",
  description: "A non-custodial marketplace for NFTs",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/nft-marketplace.png" sizes="any" />
      </head>
      <body className="bg-zinc-50">
        <Providers>
          <Header />
          {props.children}
        </Providers>
      </body>
    </html>
  );
}
