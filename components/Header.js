"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { SETTINGS } from "@/lib/constants";

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setLoggedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setLoggedIn(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <div style={{ background: "#1C2128", color: "#fff" }}>
      <div className="container" style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "#fff" }}>
          <div style={{ width: 34, height: 34, background: "#C93B26", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>AS</div>
          <div style={{ lineHeight: 1.1 }}>
            <div className="heading" style={{ fontSize: 18, letterSpacing: 0.5 }}>{SETTINGS.companyName.toUpperCase()}</div>
            <div style={{ fontSize: 10, color: "#9AA1AC" }}>{SETTINGS.companySub}</div>
          </div>
        </Link>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <Link href="/" className="btn" style={{ background: "transparent", color: "#C4C8CF", padding: "7px 12px" }}>Home</Link>
          <Link href="/inventory" className="btn" style={{ background: "transparent", color: "#C4C8CF", padding: "7px 12px" }}>Trucks for Sale</Link>
          <Link href="/about" className="btn" style={{ background: "transparent", color: "#C4C8CF", padding: "7px 12px" }}>About</Link>
          <Link href="/contact" className="btn" style={{ background: "transparent", color: "#C4C8CF", padding: "7px 12px" }}>Contact</Link>
          <Link href={loggedIn ? "/admin/dashboard" : "/admin/login"} className="btn" style={{ background: "transparent", color: "#C93B26", border: "1px solid #3A4150", padding: "7px 12px" }}>
            {loggedIn ? "Admin" : "Staff login"}
          </Link>
        </div>
      </div>
    </div>
  );
}
