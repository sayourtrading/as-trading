"use client";
import { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import AdminNav from "@/components/AdminNav";
import VehicleForm from "@/components/VehicleForm";
import { nextStockNumber } from "@/lib/constants";

function emptyVehicle(stock) {
  return {
    stock_number: stock, brand: "", model: "", year: "", vehicle_type: "Truck",
    chassis_number: "", engine_number: "", engine: "", transmission: "", fuel: "", mileage: "", color: "",
    body_type: "", payload: "", dimensions: "", cabin_type: "", condition: "",
    purchase_price: "", shipping_cost: "", customs_cost: "", other_expenses: "", selling_price: "", notes: "",
    status: "AVAILABLE", photos: [],
  };
}

export default function NewVehiclePage() {
  const [stock, setStock] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    nextStockNumber().then((s) => { setStock(s); setReady(true); });
  }, []);

  return (
    <RequireAuth>
      <AdminNav />
      {ready && <VehicleForm initial={emptyVehicle(stock)} stockNumber={stock} />}
    </RequireAuth>
  );
}
