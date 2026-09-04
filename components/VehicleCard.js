"use client";
import Link from "next/link";
import { money, waLink, SETTINGS } from "../lib/constants";

export default function VehicleCard({ v }) {
  const photo = (v.photos || [])[0];
  const wa = waLink(SETTINGS.whatsapp, `Hello ${SETTINGS.companyName}, I am interested in the ${v.brand} ${v.model}, Stock No. ${v.stock_number}.`);
  return (
    <div className="card">
      <Link href={`/vehicle/${v.id}`} style={{ display: "block", position: "relative", aspectRatio: "4/3", background: "#EDEEF0" }}>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt={v.model} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#9AA1AC" }}>No photo</div>
        )}
        <div style={{ position: "absolute", top: 8, left: 8 }}><span className="stock-plate">{v.stock_number}</span></div>
      </Link>
      <div style={{ padding: "12px 14px" }}>
        <Link href={`/vehicle/${v.id}`} className="heading" style={{ fontSize: 18, textDecoration: "none", color: "#14294B" }}>
          {v.brand} {v.model}
        </Link>
        <div style={{ fontSize: 13, color: "#5B6270", margin: "6px 0" }}>
          {v.year} &middot; {v.vehicle_type}{v.mileage ? ` \u00b7 ${Number(v.mileage).toLocaleString()} km` : ""}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="heading" style={{ fontSize: 18, color: "#2FA84F" }}>{v.selling_price ? money(v.selling_price) : "Price on request"}</span>
          <span className={`status-tag status-${v.status}`}>{v.status}</span>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <Link href={`/vehicle/${v.id}`} className="btn btn-outline" style={{ flex: 1, padding: "8px 0" }}>Details</Link>
          <a href={wa} target="_blank" rel="noreferrer" className="btn" style={{ flex: 1, padding: "8px 0", background: "#25D366", color: "#fff" }}>WhatsApp</a>
        </div>
      </div>
    </div>
  );
}
