import { SETTINGS } from "@/lib/constants";

export default function AboutPage() {
  return (
    <div className="container-narrow" style={{ padding: "44px 20px" }}>
      <div className="heading" style={{ fontSize: 28, marginBottom: 14 }}>About {SETTINGS.companyName}</div>
      <p style={{ fontSize: 15, color: "#3D4451", lineHeight: 1.7 }}>
        {SETTINGS.companySub} buys and sells trucks, vans, pickups, buses, and commercial vehicles
        from Hino, Isuzu, Mitsubishi Fuso, Nissan, Toyota, and Suzuki, along with spare parts and
        automotive services. Based on Baddawi&apos;s main road in Tripoli, Lebanon, we work with
        operators, fleets, and independent buyers across the region.
      </p>
    </div>
  );
}
