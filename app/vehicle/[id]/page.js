"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import { SETTINGS, money, waLink } from "../../../lib/constants";

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #EDEEF0" }}>
      <span style={{ fontSize: 13, color: "#9AA1AC" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500 }}>{value}</span>
    </div>
  );
}

export default function VehicleDetailsPage() {
  const { id } = useParams();
  const [v, setV] = useState(null);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    supabase.from("vehicles").select("*").eq("id", id).single().then(({ data }) => setV(data));
  }, [id]);

  if (!v) return <div className="container" style={{ padding: 40, textAlign: "center", color: "#9AA1AC" }}>Loading...</div>;

  const photos = v.photos && v.photos.length ? v.photos : [null];
  const wa = waLink(SETTINGS.whatsapp, `Hello ${SETTINGS.companyName}, I am interested in the ${v.brand} ${v.model}, Stock No. ${v.stock_number}.`);

  return (
    <div className="container" style={{ padding: "24px 20px" }}>
      <Link href="/inventory" style={{ color: "#5B6270", fontSize: 13, textDecoration: "none" }}>&larr; Back to inventory</Link>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 28, marginTop: 14 }}>
        <div>
          <div style={{ position: "relative", aspectRatio: "4/3", background: "#EDEEF0", borderRadius: 6, overflow: "hidden" }}>
            {photos[imgIdx] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photos[imgIdx]} alt={v.model} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#9AA1AC" }}>No photo</div>
            )}
          </div>
          {photos.length > 1 && (
            <div style={{ display: "flex", gap: 6, marginTop: 8, overflowX: "auto" }}>
              {photos.map((p, i) => (
                <button key={i} onClick={() => setImgIdx(i)} style={{ width: 56, height: 42, flexShrink: 0, borderRadius: 3, overflow: "hidden", border: i === imgIdx ? "2px solid #C93B26" : "1px solid #E4E6EA", padding: 0, cursor: "pointer" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <span className="stock-plate">{v.stock_number}</span>
          <div className="heading" style={{ fontSize: 28, marginTop: 10 }}>{v.brand} {v.model}</div>
          <div className="heading" style={{ fontSize: 22, color: "#C93B26", marginTop: 6 }}>{v.selling_price ? money(v.selling_price) : "Price on request"}</div>
          <div style={{ marginTop: 14 }}>
            <Row label="Year" value={v.year} />
            <Row label="Type" value={v.vehicle_type} />
            <Row label="Chassis number" value={v.chassis_number} />
            <Row label="Engine number" value={v.engine_number} />
            <Row label="Engine" value={v.engine} />
            <Row label="Transmission" value={v.transmission} />
            <Row label="Fuel" value={v.fuel} />
            <Row label="Mileage" value={v.mileage ? `${Number(v.mileage).toLocaleString()} km` : ""} />
            <Row label="Color" value={v.color} />
            <Row label="Body type" value={v.body_type} />
            <Row label="Payload" value={v.payload} />
            <Row label="Dimensions" value={v.dimensions} />
            <Row label="Cabin type" value={v.cabin_type} />
            <Row label="Condition" value={v.condition} />
          </div>
          {v.notes && <div style={{ marginTop: 12, fontSize: 13, color: "#5B6270" }}>{v.notes}</div>}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <a href={wa} target="_blank" rel="noreferrer" className="btn" style={{ flex: 1, background: "#25D366", color: "#fff" }}>WhatsApp</a>
            <a href={`tel:${SETTINGS.phone1.replace(/\s/g, "")}`} className="btn btn-dark" style={{ flex: 1 }}>Call now</a>
          </div>
        </div>
      </div>
    </div>
  );
}
