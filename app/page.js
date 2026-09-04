"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import { SETTINGS, BRANDS } from "../lib/constants";
import VehicleCard from "../components/VehicleCard";

export default function HomePage() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    supabase
      .from("vehicles")
      .select("*")
      .eq("status", "AVAILABLE")
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => setVehicles(data || []));
  }, []);

  return (
    <div>
      <div style={{ background: "linear-gradient(120deg, #14294B 60%, #1F3A63 60%)", color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: "-5%", bottom: 0, width: "32%", background: "#2FA84F", opacity: 0.85, clipPath: "polygon(40% 0, 100% 0, 100% 100%, 0% 100%)" }} />
        <div className="container" style={{ padding: "64px 20px 72px", position: "relative" }}>
          <div style={{ fontSize: 13, color: "#9AA1AC", marginBottom: 10 }}>{SETTINGS.address}</div>
          <div className="heading" style={{ fontSize: 42, lineHeight: 1.05 }}>{SETTINGS.companyName.toUpperCase()}</div>
          <div style={{ fontSize: 17, color: "#D8DBE0", marginTop: 10, maxWidth: 420 }}>
            Trucks &middot; Vans &middot; Pickups &middot; Buses. Bought, sold, and serviced on Tripoli&apos;s Baddawi main road.
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 26, flexWrap: "wrap" }}>
            <Link href="/inventory" className="btn btn-primary">View trucks</Link>
            <Link href="/contact" className="btn" style={{ background: "transparent", color: "#fff", border: "1.5px solid #6B7280" }}>Contact us</Link>
          </div>
        </div>
      </div>
      <div className="container" style={{ padding: "40px 20px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 18 }}>
          <div className="heading" style={{ fontSize: 24 }}>Latest arrivals</div>
          <Link href="/inventory" style={{ color: "#2FA84F", fontWeight: 600, fontSize: 13, textDecoration: "none" }}>See all &rarr;</Link>
        </div>
        {vehicles.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#9AA1AC", background: "#F2F4F7", borderRadius: 6 }}>
            No vehicles listed yet.
          </div>
        ) : (
          <div className="grid-cards">{vehicles.map((v) => <VehicleCard key={v.id} v={v} />)}</div>
        )}
      </div>
    </div>
  );
}
