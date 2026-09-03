import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Doxter | Consulta empresarial RUES",
  description:
    "Consulta masiva de información empresarial en el RUES de Colombia. Carga tu Excel y descarga resultados listos para usar.",
  applicationName: "Doxter",
  keywords: ["RUES", "consulta empresarial", "NIT", "Colombia", "Excel"],
  icons: {
    icon: "/doxter-icon.svg",
    shortcut: "/doxter-icon.svg",
    apple: "/doxter-icon.svg",
  },
  openGraph: {
    title: "Doxter | Consulta empresarial RUES",
    description:
      "Convierte tu Excel de NITs en información empresarial lista para usar.",
    type: "website",
    locale: "es_CO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
