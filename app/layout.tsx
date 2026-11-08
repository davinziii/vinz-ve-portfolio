import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://vinz-ve-portfolio.vercel.app"),
  title: "Vinz de Leon — Every Frame Tells a Story",
  description:
    "Explore video edits, character animation, motion and graphic design by Vinz de Leon.",
  icons: { icon: "/media/vinz-avatar.webp" },
  openGraph: {
    title: "Vinz de Leon — Every Frame Tells a Story",
    description:
      "Video editing, animation and graphic design. Explore the collection.",
    images: ["/media/redbull2.webp"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
