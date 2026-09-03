"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setErr(error.message); return; }
    router.push("/admin/dashboard");
  };

  return (
    <div className="container-narrow" style={{ maxWidth: 360, margin: "60px auto", padding: "0 20px" }}>
      <form onSubmit={submit} className="card" style={{ padding: 28, textAlign: "center" }}>
        <div className="heading" style={{ fontSize: 20 }}>Staff login</div>
        <div style={{ fontSize: 12, color: "#9AA1AC", marginTop: 4, marginBottom: 16 }}>
          Use the admin account you created in Supabase.
        </div>
        <input className="field-input" style={{ marginBottom: 10 }} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="field-input" style={{ marginBottom: 10 }} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {err && <div style={{ color: "#C93B26", fontSize: 12, marginBottom: 10 }}>{err}</div>}
        <button type="submit" disabled={loading} className="btn btn-dark" style={{ width: "100%" }}>{loading ? "Logging in..." : "Log in"}</button>
      </form>
    </div>
  );
}
