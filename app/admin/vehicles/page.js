"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import { money, totalCost, profit, nextStockNumber } from "../../../lib/constants";
import RequireAuth from "../../../components/RequireAuth";
import AdminNav from "../../../components/AdminNav";
import SellModal from "../../../components/SellModal";

export default function AdminVehiclesPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState([]);
  const [q, setQ] = useState("");
  const [sellTarget, setSellTarget] = useState(null);

  const load = () => supabase.from("vehicles").select("*").order("created_at", { ascending: false }).then(({ data }) => setVehicles(data || []));

  useEffect(() => { load(); }, []);

  const filtered = vehicles.filter((v) => {
    if (!q) return true;
    const hay = [v.stock_number, v.chassis_number, v.brand, v.model].join(" ").toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  const handleDelete = async (v) => {
    if (!confirm(`Permanently delete ${v.brand} ${v.model} (${v.stock_number})? This cannot be undone.`)) return;
    await supabase.from("vehicles").delete().eq("id", v.id);
    load();
  };

  const handleDuplicate = async (v) => {
    const stock = await nextStockNumber();
    const copy = {
      stock_number: stock, brand: v.brand, model: v.model, year: v.year, vehicle_type: v.vehicle_type,
      engine: v.engine, transmission: v.transmission, fuel: v.fuel, color: v.color, body_type: v.body_type,
      payload: v.payload, dimensions: v.dimensions, cabin_type: v.cabin_type, condition: v.condition,
      purchase_price: v.purchase_price, shipping_cost: v.shipping_cost, customs_cost: v.customs_cost,
      other_expenses: v.other_expenses, selling_price: v.selling_price, notes: v.notes,
      status: "AVAILABLE", photos: [],
    };
    const { data } = await supabase.from("vehicles").insert(copy).select().single();
    if (data) router.push(`/admin/vehicles/${data.id}/edit`);
  };

  const confirmSale = async (form) => {
    const v = sellTarget;
    const paymentStatus = Number(form.amount_paid) >= Number(form.sale_price) ? "PAID" : (Number(form.amount_paid) > 0 ? "PARTIALLY PAID" : "UNPAID");
    await supabase.from("vehicles").update({
      status: "SOLD", buyer: form.buyer, sale_price: form.sale_price, sale_date: form.sale_date,
      amount_paid: form.amount_paid, payment_status: paymentStatus,
    }).eq("id", v.id);
    setSellTarget(null);
    load();
  };

  const th = { textAlign: "left", padding: "8px 10px", fontSize: 11, color: "#9AA1AC", fontWeight: 600, borderBottom: "1px solid #E4E6EA", whiteSpace: "nowrap" };
  const td = { padding: "8px 10px", fontSize: 13, borderBottom: "1px solid #EDEEF0", whiteSpace: "nowrap" };
  const iconBtn = { border: "1px solid #E4E6EA", background: "#fff", borderRadius: 4, padding: "5px 9px", cursor: "pointer", fontSize: 12 };

  return (
    <RequireAuth>
      <AdminNav />
      <div className="container" style={{ padding: "24px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
          <div className="heading" style={{ fontSize: 22 }}>All vehicles</div>
          <input placeholder="Search stock, chassis, brand, model" value={q} onChange={(e) => setQ(e.target.value)} className="field-input" style={{ minWidth: 220 }} />
        </div>
        <div className="card" style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead><tr>
              <th style={th}>Stock</th><th style={th}>Vehicle</th><th style={th}>Year</th><th style={th}>Chassis</th>
              <th style={th}>Cost</th><th style={th}>Price</th><th style={th}>Profit</th><th style={th}>Status</th><th style={th}>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id}>
                  <td style={td}><span className="stock-plate">{v.stock_number}</span></td>
                  <td style={td}>{v.brand} {v.model}</td>
                  <td style={td}>{v.year}</td>
                  <td style={td}>{v.chassis_number}</td>
                  <td style={td}>{money(totalCost(v))}</td>
                  <td style={td}>{money(v.status === "SOLD" ? v.sale_price : v.selling_price)}</td>
                  <td style={{ ...td, color: profit(v) >= 0 ? "#1E6B3C" : "#C93B26", fontWeight: 600 }}>{money(profit(v))}</td>
                  <td style={td}><span className={`status-tag status-${v.status}`}>{v.status}</span></td>
                  <td style={td}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={iconBtn} onClick={() => router.push(`/admin/vehicles/${v.id}/edit`)}>Edit</button>
                      {v.status !== "SOLD" && <button style={iconBtn} onClick={() => setSellTarget(v)}>Sell</button>}
                      <button style={iconBtn} onClick={() => handleDuplicate(v)}>Duplicate</button>
                      <button style={{ ...iconBtn, color: "#C93B26" }} onClick={() => handleDelete(v)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={9} style={{ ...td, textAlign: "center", color: "#9AA1AC" }}>No vehicles found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {sellTarget && <SellModal v={sellTarget} onClose={() => setSellTarget(null)} onConfirm={confirmSale} />}
    </RequireAuth>
  );
}
