import "./globals.css";
import Header from "../components/Header";

export const metadata = {
  title: "AS Trading | Ali Sayour Trading",
  description: "Trucks, vans, pickups and buses for sale in Tripoli, Lebanon.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <div style={{ background: "#14294B", color: "#9AA1AC", padding: 20, textAlign: "center", fontSize: 12, marginTop: 40 }}>
          AS Trading
        </div>
      </body>
    </html>
  );
}
