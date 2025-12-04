// app/layout.tsx
import "../styles/globals.css";
import RootLayoutClient from "./RootLayoutClient";

export const metadata = {
  title: "Delicias con Humo",
  description: "Productos ahumados premium",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <RootLayoutClient>{children}</RootLayoutClient>;
}
