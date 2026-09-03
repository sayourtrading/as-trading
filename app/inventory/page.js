"use client";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { BRANDS, TYPES, TRANSMISSIONS, FUELS } from "@/lib/constants";
import VehicleCard from "@/components/VehicleCard";

export default function InventoryPage() {
  const [vehicles, setVehicles] = useState([]);
  const [filters, setFilters] = useState({ q: "", brand: "", vehicleType: "", transmission: "", fuel: "", yearMin: "", yearMax: "", priceMin: "", priceMax: "" });

  useEffect(() => {
    supabase.from("vehicles").select("*").neq("status", "SOLD").order("created_at", { ascending: false }).then(({ data }) => setVehicles(data || []));
  }, []);

  const set = (k, val) => setFilters((f) => ({ ...f, [k]: val }));

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      if (filters.q) {
        const q = filters.q.toLowerCase();
        const hay = [v.stock_number, v.chassis_number, v.brand, v.model].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filters.brand && v.brand !== filters.brand) return false;
      if (filters.vehicleType && v.vehicle_type !== filters.vehicleType) return false;
      if (filters.transmission && v.transmission !== filters.transmission) return false;
      if (filters.fuel && v.fuel !== filters.fuel) return false;
      if (filters.yearMin && Number(v.year) < Number(filters.yearMin)) return false;
      if (filters.yearMax && Number(v.year) > Number(filters.yearMax)) return false;
      if (filters.priceMin && Number(v.selling_price) < Number(filters.priceMin)) return false;
      if (filters.priceMax && Number(v.selling_price) > Number(filters.priceMax)) return false;
      return true;
    });
  }, [vehicles, filters]);

  return (
    <div className="container" style={{ padding: "28px 20px" }}>
      <div className="heading" style={{ fontSize: 26, marginBottom: 16 }}>Trucks for sale</div>
      <div style={{ background: "#F2F4F7", border: "1px solid #E4E6EA", borderRadius: 6, padding: 14, marginBottom: 20 }}>
        <input placeholder="Search stock no, chassis, brand, model" value={filters.q} onChange={(e) => set("q", e.target.value)} className="field-input" style={{ marginBottom: 10 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8 }}>
          <select className="field-input" value={filters.brand} onChange={(e) => set("brand", e.target.value)}><option value="">All brands</option>{BRANDS.map((b) => <option key={b}>{b}</option>)}</select>
          <select className="field-input" value={filters.vehicleType} onChange={(e) => set("vehicleType", e.target.value)}><option value="">All types</option>{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
          <select className="field-input" value={filters.transmission} onChange={(e) => set("transmission", e.target.value)}><option value="">Any transmission</option>{TRANSMISSIONS.map((t) => <option key={t}>{t}</option>)}</select>
          <select className="field-input" value={filters.fuel} onChange={(e) => set("fuel", e.target.value)}><option value="">Any fuel</option>{FUELS.map((t) => <option key={t}>{t}</option>)}</select>
          <input className="field-input" placeholder="Min year" type="number" value={filters.yearMin} onChange={(e) => set("yearMin", e.target.value)} />
          <input className="field-input" placeholder="Max year" type="number" value={filters.yearMax} onChange={(e) => set("yearMax", e.target.value)} />
          <input className="field-input" placeholder="Min price" type="number" value={filters.priceMin} onChange={(e) => set("priceMin", e.target.value)} />
          <input className="field-input" placeholder="Max price" type="number" value={filters.priceMax} onChange={(e) => set("priceMax", e.target.value)} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
          <span style={{ fontSize: 12, color: "#5B6270" }}>{filtered.length} vehicle(s)</span>
          <button onClick={() => setFilters({ q: "", brand: "", vehicleType: "", transmission: "", fuel: "", yearMin: "", yearMax: "", priceMin: "", priceMax: "" })} style={{ background: "none", border: "none", color: "#C93B26", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>Reset filters</button>
        </div>
      </div>
      {filtered.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", color: "#9AA1AC", background: "#F2F4F7", borderRadius: 6 }}>No vehicles match your filters.</div>
      ) : (
        <div className="grid-cards">{filtered.map((v) => <VehicleCard key={v.id} v={v} />)}</div>
      )}
    </div>
  );
}
