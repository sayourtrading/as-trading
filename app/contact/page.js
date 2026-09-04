import { SETTINGS, waLink } from "../../lib/constants";

export default function ContactPage() {
  return (
    <div className="container-narrow" style={{ padding: "44px 20px" }}>
      <div className="heading" style={{ fontSize: 28, marginBottom: 20 }}>Contact us</div>
      <div style={{ display: "grid", gap: 12, fontSize: 15 }}>
        <div>{SETTINGS.address}</div>
        <div>{SETTINGS.phone1} &middot; {SETTINGS.phone2}</div>
        <div>
          <a href={waLink(SETTINGS.whatsapp, `Hello ${SETTINGS.companyName}, I'd like more information.`)} target="_blank" rel="noreferrer" style={{ color: "#2FA84F", fontWeight: 600 }}>
            Message us on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
