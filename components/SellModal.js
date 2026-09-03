"use client";
import { useState } from "react";
import { money } from "@/lib/constants";

export default function SellModal({ v, onClose, onConfirm }) {
  const [form, setForm] = useState({ buyer: "", sale_price: v.selling_price || "", sale_date: new Date().toISOString().slice(0, 10), amount_paid: "" });
  const [confirming, setConfirming] = useState(false);
  const set = (k, val) => setForm((f) => ({ ...f, [k]: val }));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(28,33,40,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16 }}>
      <div className="card" style={{ padding: 22, width: 380, maxWidth: "100%", maxHeight: "90vh", overflowY: "auto" }}>
        {!confirming ? (
          <>
            <div className="heading" style={{ fontSize: 18 }}>Sell {v.brand} {v.model}</div>
            <label className="field-label" style={{ display: "block", marginTop: 12 }}>Buyer
              <input className="field-input" style={{ marginTop: 4 }} value={form.buyer} onChange={(e) => set("buyer", e.target.value)} /></label>
            <label className="field-label" style={{ display: "block", marginTop: 10 }}>Sale price
              <input className="field-input" style={{ marginTop: 4 }} type="number" value={form.sale_price} onChange={(e) => set("sale_price", e.target.value)} /></label>
            <label className="field-label" style={{ display: "block", marginTop: 10 }}>Sale date
              <input className="field-input" style={{ marginTop: 4 }} type="date" value={form.sale_date} onChange={(e) => set("sale_date", e.target.value)} /></label>
            <label className="field-label" style={{ display: "block", marginTop: 10 }}>Amount paid now
              <input className="field-input" style={{ marginTop: 4 }} type="number" value={form.amount_paid} onChange={(e) => set("amount_paid", e.target.value)} /></label>
            <div style={{ fontSize: 12, color: "#5B6270", marginTop: 10 }}>
              Remaining: {money((Number(form.sale_price) || 0) - (Number(form.amount_paid) || 0))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
              <button onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
              <button onClick={() => { if (!form.buyer || !form.sale_price) return; setConfirming(true); }} className="btn btn-primary" style={{ flex: 1 }}>Continue</button>
            </div>
          </>
        ) : (
          <>
            <div className="heading" style={{ fontSize: 17 }}>Confirm sale</div>
            <div style={{ fontSize: 14, color: "#3D4451", marginTop: 10 }}>
              Are you sure you want to mark this vehicle as sold? It will move to the Sold list and leave the public site.
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
              <button onClick={() => setConfirming(false)} className="btn btn-outline" style={{ flex: 1 }}>Back</button>
              <button onClick={() => onConfirm(form)} className="btn btn-dark" style={{ flex: 1 }}>Mark as sold</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
