"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabaseClient";
import { money, totalCost, profit } from "../../../lib/constants";
import RequireAuth from "../../../components/RequireAuth";
import AdminNav from "../../../components/AdminNav";

function Stat({ label, value, color }) {
  return (
    <div className="card" style={{ padding: "16px 18px" }}>
      <div style={{ fontSize: 12, color: "#9AA1AC", fontWeight: 500 }}>{label}</div>
      <div className="heading" style={{ fontSize: 24, color: color || "#14294B", marginTop: 4 }}>{value}</div>
    </div>
  );
}

export default function DashboardPage() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    supabase.from("vehicles").select("*").order("created_at", { ascending: false }).then(({ data }) => setVehicles(data || []));
  }, []);

  const available = vehicles.filter((v) => v.status === "AVAILABLE").length;
  const sold = vehicles.filter((v) => v.status === "SOLD");
  const totalSales = sold.reduce((s, v) => s + (Number(v.sale_price) || Number(v.selling_price) || 0), 0);
  const totalCostSum = sold.reduce((s, v) => s + totalCost(v), 0);
  const totalProfit = sold.reduce((s, v) => s + profit(v), 0);

  return (
    <RequireAuth>
      <AdminNav />
      <div className="container" style={{ padding: "24px 20px" }}>
        <div className="heading" style={{ fontSize: 22, marginBottom: 16 }}>Dashboard</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: 12, marginBottom: 24 }}>
          <Stat label="Total vehicles" value={vehicles.length} />
          <Stat label="Available" value={available} color="#1E6B3C" />
          <Stat label="Sold" value={sold.length} color="#5B6270" />
          <Stat label="Total sales" value={money(totalSales)} />
          <Stat label="Total purchase cost" value={money(totalCostSum)} />
          <Stat label="Total profit" value={money(totalProfit)} color="#2FA84F" />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/admin/vehicles/new" className="btn btn-primary">+ New vehicle</Link>
          <Link href="/admin/vehicles" className="btn btn-outline">All vehicles</Link>
        </div>
      </div>
    </RequireAuth>
  );
}
