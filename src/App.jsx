import { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection, addDoc, deleteDoc, updateDoc,
  doc, onSnapshot, serverTimestamp, query, orderBy
} from "firebase/firestore";

const LOGO_B64 = "/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCALQBQADASIAAhEBAxEB/8QAHQABAAEFAQEBAAAAAAAAAAAAAAgEBQYHCQMCAf/EAEYQAQABAwMBBQUECAIIBQUAAAABAgMEBQYRBwghMUFREhNhcYEiMpGhCRRCUmJyscEjghUWJEOSorLwNERTwtFzg6PS4f/EABsBAQEAAwEBAQAAAAAAAAAAAAABAgYHBAUD/8QALREBAAEDAgMFCAMAAAAAAAAAAAECAxEEBQYSMSFBYYGhIiNxkbHB0eETQlH/2gAMAwEAAhEDEQA/AIkgMgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0c0c0c; --s1: #141414; --s2: #1c1c1c; --s3: #232323; --s4: #2a2a2a;
    --orange: #f04e23; --orange-soft: rgba(240,78,35,0.14); --orange-mid: rgba(240,78,35,0.35);
    --text: #f2efe9; --muted: #888; --dim: #444;
    --green: #3ecf8e; --green-soft: rgba(62,207,142,0.12);
    --red: #f04e4e; --red-soft: rgba(240,78,78,0.12);
    --border: rgba(255,255,255,0.06); --border2: rgba(255,255,255,0.11);
    --modal-overlay: rgba(0,0,0,0.72);
    --toggle-bg: #232323; --toggle-border: rgba(255,255,255,0.1); --toggle-icon: #aaa;
  }

  html[data-theme="dark"], html[data-theme="dark"] body {
    --bg: #0c0c0c;
    --s1: #141414;
    --s2: #1c1c1c;
    --s3: #232323;
    --s4: #2a2a2a;
    --orange: #f04e23;
    --orange-soft: rgba(240,78,35,0.14);
    --orange-mid: rgba(240,78,35,0.35);
    --text: #f2efe9;
    --muted: #888;
    --dim: #444;
    --green: #3ecf8e;
    --green-soft: rgba(62,207,142,0.12);
    --red: #f04e4e;
    --red-soft: rgba(240,78,78,0.12);
    --border: rgba(255,255,255,0.06);
    --border2: rgba(255,255,255,0.11);
    --modal-overlay: rgba(0,0,0,0.72);
    --toggle-bg: #232323;
    --toggle-border: rgba(255,255,255,0.1);
    --toggle-icon: #aaa;
  }

  html[data-theme="light"], html[data-theme="light"] body {
    --bg: #f4f2ee;
    --s1: #ffffff;
    --s2: #f0ede8;
    --s3: #e8e4de;
    --s4: #dedad3;
    --orange: #e03d14;
    --orange-soft: rgba(224,61,20,0.1);
    --orange-mid: rgba(224,61,20,0.3);
    --text: #1a1816;
    --muted: #888;
    --dim: #bbb;
    --green: #1f9e63;
    --green-soft: rgba(31,158,99,0.1);
    --red: #d13a3a;
    --red-soft: rgba(209,58,58,0.1);
    --border: rgba(0,0,0,0.07);
    --border2: rgba(0,0,0,0.13);
    --modal-overlay: rgba(0,0,0,0.35);
    --toggle-bg: #ece8e2;
    --toggle-border: rgba(0,0,0,0.12);
    --toggle-icon: #555;
  }

  body { background: var(--bg); color: var(--text); font-family: 'Syne', sans-serif; transition: background 0.25s, color 0.25s; }

  .theme-toggle {
    margin-left: auto;
    display: flex; align-items: center; gap: 6px;
    background: var(--toggle-bg);
    border: 0.5px solid var(--toggle-border);
    border-radius: 20px; padding: 4px 5px;
    cursor: pointer; transition: all 0.2s;
  }
  .theme-toggle:hover { border-color: var(--orange); }
  .toggle-track {
    width: 34px; height: 18px; border-radius: 9px;
    background: var(--s3); border: 0.5px solid var(--border2);
    position: relative; transition: background 0.2s; flex-shrink: 0;
  }
  .toggle-thumb {
    width: 12px; height: 12px; border-radius: 50%;
    background: var(--orange); position: absolute; top: 2px; left: 2px;
    transition: transform 0.22s cubic-bezier(0.4,0,0.2,1);
  }
  .toggle-thumb.right { transform: translateX(16px); }
  .toggle-label {
    font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--toggle-icon); padding: 0 6px 0 2px;
    font-family: 'Syne', sans-serif;
  }
  .root { min-height: 100vh; padding: 0; }
  .header {
    display: flex; align-items: center; gap: 16px;
    padding: 20px 28px; border-bottom: 0.5px solid var(--border);
    background: var(--s1);
  }
  .logo-img { width: 42px; height: 42px; object-fit: contain; }
  .brand-sub { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); }
  .brand-name { font-size: 17px; font-weight: 800; letter-spacing: -0.03em; }
  .brand-name span { color: var(--orange); }
  .header-right { margin-left: auto; display: flex; gap: 10px; }
  .summary-bar {
    display: grid; grid-template-columns: repeat(6, 1fr);
    gap: 0; border-bottom: 0.5px solid var(--border);
  }
  .sum-card {
    padding: 18px 24px; border-right: 0.5px solid var(--border);
    background: var(--s1);
  }
  .sum-card:last-child { border-right: none; }
  .sum-label { font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
  .sum-val { font-family: 'DM Mono', monospace; font-size: 22px; font-weight: 500; }
  .sum-val.orange { color: var(--orange); }
  .sum-val.green { color: var(--green); }
  .sum-val.red { color: var(--red); }
  .tabs-row {
    display: flex; gap: 0; padding: 0 28px;
    background: var(--s1); border-bottom: 0.5px solid var(--border);
  }
  .tab-btn {
    padding: 14px 20px; background: none; border: none; border-bottom: 2px solid transparent;
    color: var(--muted); font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.18s;
    margin-bottom: -0.5px;
  }
  .tab-btn:hover { color: var(--text); }
  .tab-btn.active { color: var(--orange); border-bottom-color: var(--orange); }
  .panel { padding: 24px 28px; }
  .form-block {
    background: var(--s1); border: 0.5px solid var(--border);
    border-radius: 12px; padding: 20px 22px; margin-bottom: 20px;
  }
  .form-block-title {
    font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--orange); font-weight: 700; margin-bottom: 16px;
    display: flex; align-items: center; gap: 8px;
  }
  .form-block-title::after {
    content: ''; flex: 1; height: 0.5px; background: var(--orange-soft);
  }
  .fgrid { display: grid; gap: 12px; }
  .fgrid-2 { grid-template-columns: 1fr 1fr; }
  .fgrid-3 { grid-template-columns: 1fr 1fr 1fr; }
  .fgrid-4 { grid-template-columns: 1fr 1fr 1fr 1fr; }
  .field label {
    display: block; font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 6px; font-weight: 600;
  }
  input, select {
    width: 100%; background: var(--s2); border: 0.5px solid var(--border2);
    border-radius: 8px; color: var(--text); font-family: 'Syne', sans-serif;
    font-size: 13px; padding: 10px 13px; outline: none; transition: border-color 0.2s;
    -webkit-appearance: none;
  }
  input:focus, select:focus { border-color: var(--orange-mid); }
  select option { background: var(--s2); }
  .btn {
    padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer;
    font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase; transition: all 0.18s;
  }
  .btn-primary { background: var(--orange); color: #fff; }
  .btn-primary:hover { background: #c73d1a; }
  .btn-ghost {
    background: transparent; border: 0.5px solid var(--border2);
    color: var(--muted); padding: 5px 11px; font-size: 10px; border-radius: 6px;
  }
  .btn-ghost:hover { color: var(--text); border-color: var(--muted); }
  .btn-danger:hover { color: var(--red); border-color: var(--red); }
  .tbl-wrap { background: var(--s1); border: 0.5px solid var(--border); border-radius: 12px; overflow: hidden; }
  .tbl-head { padding: 13px 18px; font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); font-weight: 700; border-bottom: 0.5px solid var(--border); }
  table { width: 100%; border-collapse: collapse; }
  th { padding: 10px 16px; text-align: left; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--dim); font-weight: 700; border-bottom: 0.5px solid var(--border); }
  td { padding: 12px 16px; font-size: 13px; border-bottom: 0.5px solid var(--border); }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: var(--s2); }
  .mono { font-family: 'DM Mono', monospace; font-size: 13px; }
  .badge {
    display: inline-block; padding: 2px 9px; border-radius: 4px;
    font-size: 9px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
  }
  .badge-yes { background: var(--green-soft); color: var(--green); }
  .badge-no { background: var(--red-soft); color: var(--red); }
  .badge-cat { background: var(--orange-soft); color: var(--orange); }
  .green { color: var(--green); }
  .red { color: var(--red); }
  .orange { color: var(--orange); }
  .muted { color: var(--muted); }
  .empty-row td { text-align: center; color: var(--muted); padding: 32px 16px; font-size: 13px; }
  .prog-wrap { height: 3px; background: var(--s3); border-radius: 2px; margin-top: 7px; overflow: hidden; }
  .prog-bar { height: 100%; background: var(--orange); border-radius: 2px; transition: width 0.4s; }
  .divider { height: 0.5px; background: var(--border); margin: 24px 0; }
  .modal-overlay {
    position: fixed; inset: 0; background: var(--modal-overlay);
    display: flex; align-items: center; justify-content: center; z-index: 100;
  }
  .modal {
    background: var(--s1); border: 0.5px solid var(--border2);
    border-radius: 14px; padding: 24px; width: 380px;
  }
  .modal-title { font-size: 14px; font-weight: 700; margin-bottom: 16px; color: var(--orange); }
  .modal-actions { display: flex; gap: 10px; margin-top: 16px; justify-content: flex-end; }

  /* ── MOBILE RESPONSIVE ── */
  @media (max-width: 768px) {
    .header { padding: 14px 16px; gap: 10px; }
    .logo-img { width: 34px; height: 34px; }
    .brand-name { font-size: 14px; }
    .brand-sub { font-size: 9px; }
    .toggle-label { display: none; }

    .summary-bar { grid-template-columns: 1fr 1fr 1fr; }
    .sum-card { padding: 12px 14px; border-bottom: 0.5px solid var(--border); }
    .sum-card:nth-child(3n) { border-right: none; }
    .sum-card:nth-child(3n+1), .sum-card:nth-child(3n+2) { border-right: 0.5px solid var(--border); }
    .sum-val { font-size: 17px; }

    .tabs-row { padding: 0 4px; overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .tab-btn { padding: 12px 14px; font-size: 10px; white-space: nowrap; }

    .panel { padding: 14px 12px; }
    .form-block { padding: 14px 14px; }

    .fgrid-2,
    .fgrid-3,
    .fgrid-4 { grid-template-columns: 1fr; }

    .tbl-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; border-radius: 10px; }
    table { min-width: 520px; }

    .modal { width: calc(100vw - 32px); padding: 18px 16px; }

    td, th { padding: 10px 12px; }
    td { font-size: 12px; }

    .btn-primary { width: 100%; margin-top: 4px; }
  }

  @media (max-width: 420px) {
    .sum-val { font-size: 15px; }
    .header { padding: 12px 12px; }
    .panel { padding: 12px 10px; }
    .form-block { padding: 12px 12px; }
    table { min-width: 460px; }
  }
`;

const fmt = (n) => {
  const abs = Math.abs(n);
  return "₹" + abs.toLocaleString("en-IN");
};

const today = () => new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

let _id = 1;
const uid = () => _id++;

// ─── Edit Modal ───────────────────────────────────────────────
function EditModal({ fields, values, onSave, onClose, title }) {
  const [form, setForm] = useState({ ...values });
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">{title}</div>
        {fields.map((f) => (
          <div className="field" key={f.key} style={{ marginBottom: 12 }}>
            <label>{f.label}</label>
            {f.type === "select" ? (
              <select value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}>
                {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input type={f.type || "text"} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
            )}
          </div>
        ))}
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { onSave(form); onClose(); }}>Save</button>
        </div>
      </div>
    </div>
  );
}

// ─── CLIENT PANEL ─────────────────────────────────────────────
function ClientPanel({ clients, onAdd, onDelete, onUpdate }) {
  const [form, setForm] = useState({ client: "", desc: "", quote: "", amount: "", revenue: "", domain: "no" });
  const [editing, setEditing] = useState(null);

  const add = () => {
    if (!form.client.trim()) return;
    onAdd({ ...form, quote: parseFloat(form.quote) || 0, amount: parseFloat(form.amount) || 0, revenue: parseFloat(form.revenue) || 0 });
    setForm({ client: "", desc: "", quote: "", amount: "", revenue: "", domain: "no" });
  };

  return (
    <div className="panel">
      <div className="form-block">
        <div className="form-block-title">Add Client Expense</div>
        <div className="fgrid fgrid-3" style={{ marginBottom: 12 }}>
          <div className="field"><label>Client Name</label><input placeholder="e.g. Acme Corp" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} /></div>
          <div className="field"><label>Description</label><input placeholder="e.g. Facebook Ads" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} /></div>
          <div className="field"><label>Quote Amount (₹)</label><input type="number" placeholder="Total quoted to client" value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} /></div>
        </div>
        <div className="fgrid fgrid-3" style={{ marginBottom: 12 }}>
          <div className="field"><label>Amount Received (₹)</label><input type="number" placeholder="Advance / payment received" value={form.revenue} onChange={(e) => setForm({ ...form, revenue: e.target.value })} /></div>
          <div className="field"><label>Expense (₹)</label><input type="number" placeholder="Your cost for this client" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
          <div className="field"><label>Domain Included?</label>
            <select value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <button className="btn btn-primary" onClick={add}>Add Entry</button>
        </div>
      </div>

      <div className="tbl-wrap">
        <div className="tbl-head">Client Entries — {clients.length} record{clients.length !== 1 ? "s" : ""}</div>
        <table>
          <thead><tr><th>Client</th><th>Description</th><th>Quote</th><th>Received</th><th>Balance Due</th><th>Expense</th><th>P / L</th><th>Domain</th><th>Actions</th></tr></thead>
          <tbody>
            {clients.length === 0 && <tr className="empty-row"><td colSpan={9}>No client entries yet — add one above.</td></tr>}
            {clients.map((c) => {
              const received = c.revenue || 0;
              const expense = c.amount || 0;
              const quote = c.quote || 0;
              const balanceDue = quote - received;
              const pl = received - expense;
              return (
                <tr key={c.id}>
                  <td><strong>{c.client}</strong></td>
                  <td className="muted">{c.desc || "—"}</td>
                  <td className="mono orange">{fmt(quote)}</td>
                  <td className="mono green">{fmt(received)}</td>
                  <td className={`mono ${balanceDue > 0 ? "red" : "green"}`}>{balanceDue > 0 ? fmt(balanceDue) + " left" : "Fully Paid"}</td>
                  <td className="mono red">{fmt(expense)}</td>
                  <td className={`mono ${pl >= 0 ? "green" : "red"}`}>{pl >= 0 ? "+" : "−"}{fmt(pl)}</td>
                  <td><span className={`badge badge-${c.domain}`}>{(c.domain || "no").toUpperCase()}</span></td>
                  <td style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-ghost" onClick={() => setEditing(c)}>Edit</button>
                    <button className="btn btn-ghost btn-danger" onClick={() => onDelete(c.id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editing && (
        <EditModal
          title={`Edit — ${editing.client}`}
          fields={[
            { key: "client", label: "Client Name" },
            { key: "desc", label: "Description" },
            { key: "quote", label: "Quote Amount (₹)", type: "number" },
            { key: "revenue", label: "Amount Received (₹)", type: "number" },
            { key: "amount", label: "Expense (₹)", type: "number" },
            { key: "domain", label: "Domain Included?", type: "select", options: ["no", "yes"] },
          ]}
          values={editing}
          onSave={(vals) => { onUpdate(editing.id, { ...vals, quote: parseFloat(vals.quote)||0, amount: parseFloat(vals.amount)||0, revenue: parseFloat(vals.revenue)||0 }); setEditing(null); }}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

// ─── TEAM PANEL ───────────────────────────────────────────────
function TeamPanel({ team, payments, onAddMember, onDeleteMember, onUpdateMember, onAddPayment, onDeletePayment }) {
  const [form, setForm] = useState({ name: "", role: "", salary: "" });
  const [payForm, setPayForm] = useState({ memberId: "", amount: "", note: "" });
  const [editing, setEditing] = useState(null);

  const addMember = () => {
    if (!form.name.trim()) return;
    onAddMember({ ...form, salary: parseFloat(form.salary) || 0 });
    setForm({ name: "", role: "", salary: "" });
  };

  const logPayment = () => {
    const m = team.find((x) => x.id === payForm.memberId);
    const amt = parseFloat(payForm.amount) || 0;
    if (!m || !amt) return;
    onAddPayment({ memberId: m.id, memberName: m.name, amount: amt, note: payForm.note, date: today() });
    setPayForm({ memberId: "", amount: "", note: "" });
  };

  const givenFor = (mid) => payments.filter((p) => p.memberId === mid).reduce((s, p) => s + (p.amount || 0), 0);

  return (
    <div className="panel">
      <div className="form-block">
        <div className="form-block-title">Add Team Member</div>
        <div className="fgrid fgrid-3" style={{ marginBottom: 12 }}>
          <div className="field"><label>Name</label><input placeholder="e.g. Rahul" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="field"><label>Role</label><input placeholder="e.g. Designer" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></div>
          <div className="field"><label>Monthly Salary (₹)</label><input type="number" placeholder="0" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} /></div>
        </div>
        <div style={{ textAlign: "right" }}><button className="btn btn-primary" onClick={addMember}>Add Member</button></div>
      </div>

      <div className="tbl-wrap" style={{ marginBottom: 24 }}>
        <div className="tbl-head">Team Members</div>
        <table>
          <thead><tr><th>Name</th><th>Role</th><th>Salary</th><th>Given</th><th>Remaining</th><th>Actions</th></tr></thead>
          <tbody>
            {team.length === 0 && <tr className="empty-row"><td colSpan={6}>No team members yet.</td></tr>}
            {team.map((m) => {
              const given = givenFor(m.id);
              const rem = (m.salary || 0) - given;
              const pct = m.salary ? Math.min(100, Math.round((given / m.salary) * 100)) : 0;
              return (
                <tr key={m.id}>
                  <td><strong>{m.name}</strong></td>
                  <td className="muted">{m.role || "—"}</td>
                  <td className="mono">{fmt(m.salary || 0)}</td>
                  <td className="mono green">{fmt(given)}</td>
                  <td>
                    <span className={`mono ${rem > 0 ? "red" : "green"}`}>{rem > 0 ? fmt(rem) + " left" : "Fully Paid"}</span>
                    <div className="prog-wrap"><div className="prog-bar" style={{ width: pct + "%" }} /></div>
                  </td>
                  <td style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-ghost" onClick={() => setEditing(m)}>Edit</button>
                    <button className="btn btn-ghost btn-danger" onClick={() => onDeleteMember(m.id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="form-block">
        <div className="form-block-title">Log Salary Payment</div>
        <div className="fgrid fgrid-3" style={{ marginBottom: 12 }}>
          <div className="field">
            <label>Member</label>
            <select value={payForm.memberId} onChange={(e) => setPayForm({ ...payForm, memberId: e.target.value })}>
              <option value="">Select member</option>
              {team.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div className="field"><label>Amount Given (₹)</label><input type="number" placeholder="0" value={payForm.amount} onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })} /></div>
          <div className="field"><label>Note</label><input placeholder="e.g. May advance" value={payForm.note} onChange={(e) => setPayForm({ ...payForm, note: e.target.value })} /></div>
        </div>
        <div style={{ textAlign: "right" }}><button className="btn btn-primary" onClick={logPayment}>Log Payment</button></div>
      </div>

      <div className="tbl-wrap">
        <div className="tbl-head">Payment History</div>
        <table>
          <thead><tr><th>Member</th><th>Amount</th><th>Note</th><th>Date</th><th>Action</th></tr></thead>
          <tbody>
            {payments.length === 0 && <tr className="empty-row"><td colSpan={5}>No payments logged yet.</td></tr>}
            {payments.map((p) => (
              <tr key={p.id}>
                <td><strong>{p.memberName}</strong></td>
                <td className="mono green">{fmt(p.amount || 0)}</td>
                <td className="muted">{p.note || "—"}</td>
                <td className="muted">{p.date}</td>
                <td><button className="btn btn-ghost btn-danger" onClick={() => onDeletePayment(p.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <EditModal
          title={`Edit — ${editing.name}`}
          fields={[
            { key: "name", label: "Name" },
            { key: "role", label: "Role" },
            { key: "salary", label: "Monthly Salary (₹)", type: "number" },
          ]}
          values={editing}
          onSave={(vals) => { onUpdateMember(editing.id, { ...vals, salary: parseFloat(vals.salary)||0 }); setEditing(null); }}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

// ─── COMPANY PANEL ────────────────────────────────────────────
function CompanyPanel({ expenses, onAdd, onDelete, onUpdate }) {
  const [form, setForm] = useState({ name: "", cat: "Subscription", amount: "" });
  const [editing, setEditing] = useState(null);
  const CATS = ["Subscription", "Tools", "Office", "Marketing", "Travel", "Utilities", "Domain", "Other"];

  const add = () => {
    if (!form.name.trim()) return;
    onAdd({ ...form, amount: parseFloat(form.amount) || 0, date: today() });
    setForm({ name: "", cat: "Subscription", amount: "" });
  };

  return (
    <div className="panel">
      <div className="form-block">
        <div className="form-block-title">Add Company Expense</div>
        <div className="fgrid fgrid-3" style={{ marginBottom: 12 }}>
          <div className="field"><label>Expense Name</label><input placeholder="e.g. Figma Subscription" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="field">
            <label>Category</label>
            <select value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })}>
              {CATS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="field"><label>Amount (₹)</label><input type="number" placeholder="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
        </div>
        <div style={{ textAlign: "right" }}><button className="btn btn-primary" onClick={add}>Add Expense</button></div>
      </div>

      <div className="tbl-wrap">
        <div className="tbl-head">Company Expenses — {expenses.length} record{expenses.length !== 1 ? "s" : ""}</div>
        <table>
          <thead><tr><th>Name</th><th>Category</th><th>Amount</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {expenses.length === 0 && <tr className="empty-row"><td colSpan={5}>No company expenses yet.</td></tr>}
            {expenses.map((e) => (
              <tr key={e.id}>
                <td><strong>{e.name}</strong></td>
                <td><span className="badge badge-cat">{e.cat}</span></td>
                <td className="mono red">{fmt(e.amount || 0)}</td>
                <td className="muted">{e.date}</td>
                <td style={{ display: "flex", gap: 6 }}>
                  <button className="btn btn-ghost" onClick={() => setEditing(e)}>Edit</button>
                  <button className="btn btn-ghost btn-danger" onClick={() => onDelete(e.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <EditModal
          title={`Edit — ${editing.name}`}
          fields={[
            { key: "name", label: "Expense Name" },
            { key: "cat", label: "Category", type: "select", options: CATS },
            { key: "amount", label: "Amount (₹)", type: "number" },
          ]}
          values={editing}
          onSave={(vals) => { onUpdate(editing.id, { ...vals, amount: parseFloat(vals.amount)||0 }); setEditing(null); }}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

// ─── ROOT APP (Firebase) ──────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("client");
  const [clients, setClients] = useState([]);
  const [team, setTeam] = useState([]);
  const [payments, setPayments] = useState([]);
  const [company, setCompany] = useState([]);
  const [dark, setDark] = useState(true);
  const [loading, setLoading] = useState(true);

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  // ── Firestore real-time listeners ──
  useEffect(() => {
    const unsubs = [];

    const listen = (col, setter) => {
      const q = query(collection(db, col), orderBy("createdAt", "asc"));
      const unsub = onSnapshot(q, (snap) => {
        setter(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      });
      unsubs.push(unsub);
    };

    listen("clients", setClients);
    listen("team", setTeam);
    listen("payments", setPayments);
    listen("company", setCompany);

    return () => unsubs.forEach((u) => u());
  }, []);

  // ── Firestore helpers ──
  const fsAdd = (col, data) =>
    addDoc(collection(db, col), { ...data, createdAt: serverTimestamp() });

  const fsDel = (col, id) => deleteDoc(doc(db, col, id));

  const fsUpdate = (col, id, data) => updateDoc(doc(db, col, id), data);

  // ── Derived totals ──
  const totalQuoted   = clients.reduce((s, c) => s + (c.quote   || 0), 0);
  const totalReceived = clients.reduce((s, c) => s + (c.revenue || 0), 0);
  const totalBalanceDue = totalQuoted - totalReceived;
  const clientExp     = clients.reduce((s, c) => s + (c.amount  || 0), 0);
  const companyExp    = company.reduce((s, e) => s + (e.amount  || 0), 0);
  const salaryPaid    = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const totalSalary   = team.reduce((s, m) => s + (m.salary || 0), 0);
  const salaryPending = Math.max(0, totalSalary - salaryPaid);
  const totalExp = clientExp + companyExp + salaryPaid;
  const pl = totalReceived - totalExp;

  const TABS = [
    { id: "client",  label: "Client Expenses" },
    { id: "team",    label: "Team Salaries"   },
    { id: "company", label: "Company Expenses"},
  ];

  if (loading) {
    return (
      <>
        <style>{css}</style>
        <div className="root" style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh" }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:28, marginBottom:12 }}>⏳</div>
            <div style={{ fontSize:13, color:"var(--muted)", letterSpacing:"0.1em", textTransform:"uppercase" }}>Connecting to Firebase…</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div className="root">
        <div className="header">
          <img src={`crelante-logo.png`} className="logo-img" alt="Logo" />
          <div>
            <div className="brand-sub">Crelante</div>
            <div className="brand-name">Expense <span>Tracker</span></div>
          </div>
          <button className="theme-toggle" onClick={() => setDark(!dark)} title={dark ? "Switch to light mode" : "Switch to dark mode"}>
            <span style={{ fontSize: 14, lineHeight: 1 }}>{dark ? "🌙" : "☀️"}</span>
            <div className="toggle-track">
              <div className={`toggle-thumb ${dark ? "" : "right"}`} />
            </div>
            <span className="toggle-label">{dark ? "Dark" : "Light"}</span>
          </button>
        </div>

        <div className="summary-bar">
          <div className="sum-card">
            <div className="sum-label">Total Quoted</div>
            <div className="sum-val orange">{fmt(totalQuoted)}</div>
          </div>
          <div className="sum-card">
            <div className="sum-label">Amount Received</div>
            <div className="sum-val green">{fmt(totalReceived)}</div>
          </div>
          <div className="sum-card">
            <div className="sum-label">Balance Due</div>
            <div className="sum-val red">{fmt(totalBalanceDue)}</div>
          </div>
          <div className="sum-card">
            <div className="sum-label">Total Expenses</div>
            <div className="sum-val red">{fmt(totalExp)}</div>
          </div>
          <div className="sum-card">
            <div className="sum-label">Profit / Loss</div>
            <div className={`sum-val ${pl >= 0 ? "green" : "red"}`}>{pl >= 0 ? "+" : "−"}{fmt(pl)}</div>
          </div>
          <div className="sum-card">
            <div className="sum-label">Salary Pending</div>
            <div className="sum-val red">{fmt(salaryPending)}</div>
          </div>
        </div>

        <div className="tabs-row">
          {TABS.map((t) => (
            <button key={t.id} className={`tab-btn ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {tab === "client" && (
          <ClientPanel
            clients={clients}
            onAdd={(data) => fsAdd("clients", data)}
            onDelete={(id) => fsDel("clients", id)}
            onUpdate={(id, data) => fsUpdate("clients", id, data)}
          />
        )}
        {tab === "team" && (
          <TeamPanel
            team={team}
            payments={payments}
            onAddMember={(data) => fsAdd("team", data)}
            onDeleteMember={(id) => { fsDel("team", id); payments.filter(p => p.memberId === id).forEach(p => fsDel("payments", p.id)); }}
            onUpdateMember={(id, data) => fsUpdate("team", id, data)}
            onAddPayment={(data) => fsAdd("payments", data)}
            onDeletePayment={(id) => fsDel("payments", id)}
          />
        )}
        {tab === "company" && (
          <CompanyPanel
            expenses={company}
            onAdd={(data) => fsAdd("company", data)}
            onDelete={(id) => fsDel("company", id)}
            onUpdate={(id, data) => fsUpdate("company", id, data)}
          />
        )}
      </div>
    </>
  );
}