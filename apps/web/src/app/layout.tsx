import type { Metadata } from "next";
import { Shell } from "@/components/shell";
import { PrototypeProgress } from "@/prototype/progress";
import "./globals.css";
export const metadata: Metadata = {
  title: "BountyLab — Field notes for web security",
  description: "An evidence-led HTTP learning prototype.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <PrototypeProgress>
          <Shell>{children}</Shell>
        </PrototypeProgress>
      </body>
    </html>
  );
}
