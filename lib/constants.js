// Edit these values with your real business info before you deploy.
// This is the only file you need to touch to update the company details
// shown across the site.
export const SETTINGS = {
  companyName: "AS Trading",
  companySub: "Ali Sayour Trading",
  address: "Tripoli \u2013 Baddawi \u2013 Main Road \u2013 Lebanon",
  phone1: "03 183 798",
  phone2: "70 035 997",
  // digits only, with country code, no + or spaces (Lebanon = 961)
  whatsapp: "96103183798",
};

export const BRANDS = ["Hino", "Isuzu", "Mitsubishi Fuso", "Nissan", "Toyota", "Suzuki", "Other"];
export const TYPES = ["Truck", "Pickup", "Van", "Bus", "Other"];
export const TRANSMISSIONS = ["Manual", "Automatic"];
export const FUELS = ["Diesel", "Petrol", "Other"];

export function money(n) {
  const v = Number(n) || 0;
  return "$" + v.toLocaleString();
}

export function totalCost(v) {
  return (
    (Number(v.purchase_price) || 0) +
    (Number(v.shipping_cost) || 0) +
    (Number(v.customs_cost) || 0) +
    (Number(v.other_expenses) || 0)
  );
}

export function profit(v) {
  const revenue =
    v.status === "SOLD"
      ? Number(v.sale_price) || Number(v.selling_price) || 0
      : Number(v.selling_price) || 0;
  return revenue - totalCost(v);
}

export function waLink(whatsapp, text) {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
}

export async function nextStockNumber() {
  const { supabase } = await import("./supabaseClient");
  const { data } = await supabase.from("vehicles").select("stock_number");
  let max = 0;
  (data || []).forEach((v) => {
    const m = /AS-(\d+)/.exec(v.stock_number || "");
    if (m) max = Math.max(max, parseInt(m[1], 10));
  });
  return "AS-" + String(max + 1).padStart(4, "0");
}
