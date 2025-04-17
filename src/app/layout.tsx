// app/layout.tsx
import { ReactNode } from "react";
import "comptarial/src/app/globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head />
      <body className="bg-gray-100 text-gray-900">{children}</body>
    </html>
  );
}
