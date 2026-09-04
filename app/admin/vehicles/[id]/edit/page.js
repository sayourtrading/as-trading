"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RequireAuth from "../../../../../components/RequireAuth";
import AdminNav from "../../../../../components/AdminNav";
import VehicleForm from "../../../../../components/VehicleForm";
import { supabase } from "../../../../../lib/supabaseClient";

export default function EditVehiclePage() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    supabase.from("vehicles").select("*").eq("id", id).single().then(({ data }) => setVehicle(data));
  }, [id]);

  return (
    <RequireAuth>
      <AdminNav />
      {vehicle && <VehicleForm initial={vehicle} />}
    </RequireAuth>
  );
}
