"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { BRANDS, TYPES, TRANSMISSIONS, FUELS, totalCost, money } from "@/lib/constants";

function Field({ label, children }) {
  return <label className="field-label" style={{ display: "block" }}>{label}<div style={{ marginTop: 4 }}>{children}</div></label>;
}
function Section({ title, children }) {
  return (
    <div style={{ marginTop: 22 }}>
      <div className="heading" style={{ fontSize: 14, borderBottom: "2px solid #C93B26", display: "inline-block", paddingBottom: 3 }}>{title}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginTop: 10 }}>{children}</div>
    </div>
  );
}

export default function VehicleForm({ initial, stockNumber }) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const set = (k, val) => setV((f) => ({ ...f, [k]: val }));

  const handlePhotos = async (files) => {
    setUploading(true);
    const uploaded = [];
    for (const file of Array.from(files)) {
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.name}`;
      const { error } = await supabase.storage.from("vehicle-photos").upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from("vehicle-photos").getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
    }
    setV((f) => ({ ...f, photos: [...(f.photos || []), ...uploaded] }));
    setUploading(false);
  };

  const removePhoto = (idx) => setV((f) => ({ ...f, photos: f.photos.filter((_, i) => i !== idx) }));

  const submit = async () => {
    setErr("");
    if (!v.brand || !v.model || !v.year) { setErr("Brand, model and year are required."); return; }
    setSaving(true);
    const payload = { ...v };
    delete payload.id;
    let result;
    if (v.id) {
      result = await supabase.from("vehicles").update(payload).eq("id", v.id);
    } else {
      result = await supabase.from("vehicles").insert(payload);
    }
    setSaving(false);
    if (result.error) {
      if (result.error.message.includes("duplicate") || result.error.code === "23505") {
        setErr("That chassis number or stock number is already in use.");
      } else {
        setErr(result.error.message);
      }
      return;
    }
    router.push("/admin/vehicles");
  };

  return (
    <div className="container-narrow" style={{ padding: "24px 20px" }}>
      <div className="heading" style={{ fontSize: 22 }}>{v.id ? "Edit vehicle" : "Add new vehicle"}</div>
      <div style={{ fontSize: 12, color: "#9AA1AC", marginTop: 4 }}>Stock number: <b>{v.stock_number || stockNumber}</b></div>

      <Section title="Photos">
        <div style={{ gridColumn: "1 / -1" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(v.photos || []).map((p, i) => (
              <div key={i} style={{ position: "relative", width: 84, height: 64, borderRadius: 4, overflow: "hidden", border: i === 0 ? "2px solid #C93B26" : "1px solid #E4E6EA" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button onClick={() => removePhoto(i)} type="button" style={{ position: "absolute", top: 2, right: 2, background: "rgba(28,33,40,0.7)", border: "none", borderRadius: "50%", width: 18, height: 18, color: "#fff", cursor: "pointer" }}>x</button>
              </div>
            ))}
            <label style={{ width: 84, height: 64, border: "1.5px dashed #C4C8CF", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#9AA1AC", fontSize: 11, textAlign: "center" }}>
              {uploading ? "Uploading..." : "+ Upload"}
              <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={(e) => handlePhotos(e.target.files)} />
            </label>
          </div>
        </div>
      </Section>

      <Section title="Basic information">
        <Field label="Brand"><select className="field-input" value={v.brand} onChange={(e) => set("brand", e.target.value)}><option value="">Select</option>{BRANDS.map((b) => <option key={b}>{b}</option>)}</select></Field>
        <Field label="Model"><input className="field-input" value={v.model} onChange={(e) => set("model", e.target.value)} /></Field>
        <Field label="Year"><input className="field-input" type="number" value={v.year} onChange={(e) => set("year", e.target.value)} /></Field>
        <Field label="Vehicle type"><select className="field-input" value={v.vehicle_type} onChange={(e) => set("vehicle_type", e.target.value)}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></Field>
        <Field label="Chassis number"><input className="field-input" value={v.chassis_number || ""} onChange={(e) => set("chassis_number", e.target.value)} /></Field>
        <Field label="Selling price ($)"><input className="field-input" type="number" value={v.selling_price || ""} onChange={(e) => set("selling_price", e.target.value)} /></Field>
      </Section>

      <Section title="Technical information">
        <Field label="Engine number"><input className="field-input" value={v.engine_number || ""} onChange={(e) => set("engine_number", e.target.value)} /></Field>
        <Field label="Engine"><input className="field-input" value={v.engine || ""} onChange={(e) => set("engine", e.target.value)} placeholder="4.0L Diesel" /></Field>
        <Field label="Transmission"><select className="field-input" value={v.transmission || ""} onChange={(e) => set("transmission", e.target.value)}><option value="">Select</option>{TRANSMISSIONS.map((t) => <option key={t}>{t}</option>)}</select></Field>
        <Field label="Fuel"><select className="field-input" value={v.fuel || ""} onChange={(e) => set("fuel", e.target.value)}><option value="">Select</option>{FUELS.map((t) => <option key={t}>{t}</option>)}</select></Field>
        <Field label="Mileage (km)"><input className="field-input" type="number" value={v.mileage || ""} onChange={(e) => set("mileage", e.target.value)} /></Field>
        <Field label="Color"><input className="field-input" value={v.color || ""} onChange={(e) => set("color", e.target.value)} /></Field>
      </Section>

      <Section title="Body information">
        <Field label="Body type"><input className="field-input" value={v.body_type || ""} onChange={(e) => set("body_type", e.target.value)} /></Field>
        <Field label="Payload"><input className="field-input" value={v.payload || ""} onChange={(e) => set("payload", e.target.value)} /></Field>
        <Field label="Dimensions"><input className="field-input" value={v.dimensions || ""} onChange={(e) => set("dimensions", e.target.value)} /></Field>
        <Field label="Cabin type"><input className="field-input" value={v.cabin_type || ""} onChange={(e) => set("cabin_type", e.target.value)} /></Field>
        <Field label="Condition"><input className="field-input" value={v.condition || ""} onChange={(e) => set("condition", e.target.value)} /></Field>
      </Section>

      <Section title="Financial information (admin only)">
        <Field label="Purchase price"><input className="field-input" type="number" value={v.purchase_price || ""} onChange={(e) => set("purchase_price", e.target.value)} /></Field>
        <Field label="Shipping cost"><input className="field-input" type="number" value={v.shipping_cost || ""} onChange={(e) => set("shipping_cost", e.target.value)} /></Field>
        <Field label="Customs cost"><input className="field-input" type="number" value={v.customs_cost || ""} onChange={(e) => set("customs_cost", e.target.value)} /></Field>
        <Field label="Other expenses"><input className="field-input" type="number" value={v.other_expenses || ""} onChange={(e) => set("other_expenses", e.target.value)} /></Field>
        <Field label="Total cost (auto)"><input className="field-input" style={{ background: "#F2F4F7" }} value={money(totalCost(v))} disabled /></Field>
        <Field label="Expected profit (auto)"><input className="field-input" style={{ background: "#F2F4F7" }} value={money((Number(v.selling_price) || 0) - totalCost(v))} disabled /></Field>
      </Section>

      <Section title="Notes">
        <div style={{ gridColumn: "1 / -1" }}>
          <textarea className="field-input" style={{ minHeight: 70 }} value={v.notes || ""} onChange={(e) => set("notes", e.target.value)} />
        </div>
      </Section>

      {err && <div style={{ color: "#C93B26", fontSize: 13, marginTop: 16 }}>{err}</div>}
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button type="button" onClick={() => router.push("/admin/vehicles")} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
        <button type="button" onClick={submit} disabled={saving} className="btn btn-primary" style={{ flex: 1 }}>{saving ? "Saving..." : "Save vehicle"}</button>
      </div>
    </div>
  );
}
