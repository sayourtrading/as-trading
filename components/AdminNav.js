"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const ITEMS = [
  ["/admin/dashboard", "Dashboard"],
  ["/admin/vehicles", "Vehicles"],
  ["/admin/vehicles/new", "Add vehicle"],
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", padding: "10px 20px", background: "#F2F4F7", borderBottom: "1px solid #E4E6EA" }}>
      {ITEMS.map(([href, label]) => (
        <Link key={href} href={href} style={{
          fontSize: 13, fontWeight: 500, padding: "7px 12px", borderRadius: 4, textDecoration: "none",
          background: pathname === href ? "#1C2128" : "transparent", color: pathname === href ? "#fff" : "#3D4451"
        }}>{label}</Link>
      ))}
      <button onClick={logout} style={{ marginLeft: "auto", background: "transparent", border: "none", color: "#C93B26", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Log out</button>
    </div>
  );
}
