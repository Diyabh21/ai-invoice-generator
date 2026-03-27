import { useState } from "react";
import {
  CURRENCIES,
  CURRENCIES_FULL,
  today,
  dueDate,
  uid,
} from "../utils/helpers";
import InvoicePreview from "./InvoicePreview";

export default function InvoiceEditor({ user, existing, onSaved, onCancel }) {
  const isEdit = !!existing;

  const [from, setFrom] = useState(
    existing?.from || {
      name: user.name || "Studio Marigold",
      address: "123 Creative Lane\nNew York, NY 10001",
      email: user.email || "",
      pan: "",
      gst: "",
    },
  );
  const [bank, setBank] = useState(
    existing?.bank || {
      accountName: "",
      accountNumber: "",
      bankName: "",
      ifsc: "",
      branch: "",
    },
  );
  const [to, setTo] = useState(
    existing?.to || {
      name: "Acme Corporation",
      address: "456 Business Blvd\nSan Francisco, CA 94102",
      email: "accounts@acmecorp.com",
    },
  );
  const getDefaultMeta = () => ({
    number: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`,
    date: today(),
    due: dueDate(),
    currency: "USD",
  });

  const [meta, setMeta] = useState(() => existing?.meta || getDefaultMeta());
  const [items, setItems] = useState(
    existing?.items || [
      {
        id: 2,
        description: "Website Development",
        detail: "5-page responsive site with CMS integration",
        qty: 1,
        rate: 4800,
      },
    ],
  );
  const [tax, setTax] = useState(existing?.tax ?? 10);
  const [discount, setDiscount] = useState(existing?.discount ?? 0);
  const [notes, setNotes] = useState(
    existing?.notes ||
      "Payment due within 30 days. Bank transfer or check accepted.\nThank you for your business!",
  );
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [nextId, setNextId] = useState(20);
  const [toast, setToast] = useState(false);

  // ── Derived totals ──────────────────────────────────────────────────────────
  const subtotal = items.reduce(
    (s, i) => s + (parseFloat(i.qty) || 0) * (parseFloat(i.rate) || 0),
    0,
  );
  const discountAmt = subtotal * (discount / 100);
  const taxAmt = (subtotal - discountAmt) * (tax / 100);
  const total = subtotal - discountAmt + taxAmt;

  // ── Line item helpers ────────────────────────────────────────────────────────
  const addItem = () => {
    setItems((p) => [
      ...p,
      { id: nextId, description: "New Item", detail: "", qty: 1, rate: 0 },
    ]);
    setNextId((n) => n + 1);
  };
  const removeItem = (id) => setItems((p) => p.filter((i) => i.id !== id));
  const updateItem = (id, field, val) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, [field]: val } : i)));

  // ── AI generation ────────────────────────────────────────────────────────────
  const generateAI = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Generate invoice line items for: "${aiPrompt}". Return ONLY a JSON array (no markdown, no extra text) with objects having: description (string, short title), detail (string, brief explanation 3-8 words), qty (number), rate (number in USD). Generate 2-5 realistic items. Example: [{"description":"UI Design","detail":"Homepage and dashboard wireframes","qty":1,"rate":1200}]`,
            },
          ],
        }),
      });
      const data = await res.json();
      const text = data.content?.find((b) => b.type === "text")?.text || "[]";
      const cleaned = text.replace(/```json|```/g, "").trim();
      const newItems = JSON.parse(cleaned);
      if (Array.isArray(newItems)) {
        setItems((prev) => [
          ...prev,
          ...newItems.map((item, i) => ({ ...item, id: nextId + i })),
        ]);
        setNextId((n) => n + newItems.length);
        setAiPrompt("");
      }
    } catch (e) {
      console.error(e);
    }
    setAiLoading(false);
  };

  // ── Save ─────────────────────────────────────────────────────────────────────
  const handleSave = () => {
    const invoiceData = {
      id: existing?.id || uid(),
      userId: user.id,
      from,
      bank,
      to,
      meta,
      items,
      tax,
      discount,
      notes,
      total,
      subtotal,
      number: meta.number,
      clientName: to.name,
      date: meta.date,
      currency: meta.currency,
      savedAt: new Date().toISOString(),
      status: existing?.status || "draft",
    };
    onSaved(invoiceData);
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  const symb =
    CURRENCIES.find((c) => c.code === meta.currency)?.symbol || meta.currency;

  return (
    <>
      {toast && <div className="save-toast">✓ Invoice saved successfully</div>}
      <div className="app">
        {/* ── LEFT PANEL: Form ── */}
        <div className="editor">
          <div className="editor-header">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div className="editor-title">
                  {isEdit ? "Edit Invoice" : "New Invoice"}
                </div>
                <div className="editor-sub">
                  Fill in details · AI generates line items
                </div>
              </div>
              <button className="btn-back" onClick={onCancel}>
                ← Back
              </button>
            </div>
          </div>

          {/* FROM */}
          <div className="section">
            <div className="section-label">From</div>
            <div className="input-full">
              <label>
                Business Name <span className="req">*</span>
              </label>
              <input
                value={from.name}
                onChange={(e) =>
                  setFrom((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>
            <div className="input-full">
              <label>
                Address <span className="req">*</span>
              </label>
              <textarea
                rows={2}
                value={from.address}
                onChange={(e) =>
                  setFrom((p) => ({ ...p, address: e.target.value }))
                }
              />
            </div>
            <div className="input-full">
              <label>
                Email <span className="req">*</span>
              </label>
              <input
                value={from.email}
                onChange={(e) =>
                  setFrom((p) => ({ ...p, email: e.target.value }))
                }
              />
            </div>
            <div className="input-row">
              <div>
                <label>PAN Number</label>
                <input
                  placeholder="ABCDE1234F"
                  value={from.pan}
                  onChange={(e) =>
                    setFrom((p) => ({
                      ...p,
                      pan: e.target.value.toUpperCase(),
                    }))
                  }
                  maxLength={10}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    letterSpacing: "0.08em",
                  }}
                />
              </div>
              <div>
                <label>GST Number</label>
                <input
                  placeholder="22ABCDE1234F1Z5"
                  value={from.gst}
                  onChange={(e) =>
                    setFrom((p) => ({
                      ...p,
                      gst: e.target.value.toUpperCase(),
                    }))
                  }
                  maxLength={15}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    letterSpacing: "0.08em",
                  }}
                />
              </div>
            </div>
          </div>

          {/* BANK */}
          <div className="section">
            <div className="section-label">Bank Details</div>
            <div className="input-full">
              <label>Account Holder Name</label>
              <input
                placeholder="As per bank records"
                value={bank.accountName}
                onChange={(e) =>
                  setBank((p) => ({ ...p, accountName: e.target.value }))
                }
              />
            </div>
            <div className="input-row">
              <div>
                <label>Account Number</label>
                <input
                  placeholder="XXXXXXXXXXXX"
                  value={bank.accountNumber}
                  onChange={(e) =>
                    setBank((p) => ({ ...p, accountNumber: e.target.value }))
                  }
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    letterSpacing: "0.08em",
                  }}
                />
              </div>
              <div>
                <label>IFSC Code</label>
                <input
                  placeholder="SBIN0001234"
                  value={bank.ifsc}
                  onChange={(e) =>
                    setBank((p) => ({
                      ...p,
                      ifsc: e.target.value.toUpperCase(),
                    }))
                  }
                  maxLength={11}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    letterSpacing: "0.08em",
                  }}
                />
              </div>
            </div>
            <div className="input-row">
              <div>
                <label>Bank Name</label>
                <input
                  placeholder="e.g. State Bank of India"
                  value={bank.bankName}
                  onChange={(e) =>
                    setBank((p) => ({ ...p, bankName: e.target.value }))
                  }
                />
              </div>
              <div>
                <label>Branch</label>
                <input
                  placeholder="e.g. MG Road, Bengaluru"
                  value={bank.branch}
                  onChange={(e) =>
                    setBank((p) => ({ ...p, branch: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          {/* TO */}
          <div className="section">
            <div className="section-label">Bill To</div>
            <div className="input-full">
              <label>
                Client Name <span className="req">*</span>
              </label>
              <input
                value={to.name}
                onChange={(e) => setTo((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="input-full">
              <label>Address</label>
              <textarea
                rows={2}
                value={to.address}
                onChange={(e) =>
                  setTo((p) => ({ ...p, address: e.target.value }))
                }
              />
            </div>
          </div>

          {/* META */}
          <div className="section">
            <div className="section-label">Invoice Details</div>
            <div className="input-row">
              <div>
                <label>
                  Invoice # <span className="req">*</span>
                </label>
                <input
                  value={meta.number}
                  onChange={(e) =>
                    setMeta((p) => ({ ...p, number: e.target.value }))
                  }
                />
              </div>
              <div>
                <label>Currency</label>
                <select
                  value={meta.currency}
                  onChange={(e) =>
                    setMeta((p) => ({ ...p, currency: e.target.value }))
                  }
                >
                  {CURRENCIES_FULL.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="input-row">
              <div>
                <label>Issue Date</label>
                <input
                  type="date"
                  value={meta.date}
                  onChange={(e) =>
                    setMeta((p) => ({ ...p, date: e.target.value }))
                  }
                />
              </div>
              <div>
                <label>Due Date</label>
                <input
                  type="date"
                  value={meta.due}
                  onChange={(e) =>
                    setMeta((p) => ({ ...p, due: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          {/* LINE ITEMS */}
          <div className="section">
            <div className="section-label">Line Items</div>
            <div className="ai-badge">✦ AI Powered</div>
            <div className="ai-prompt-row">
              <input
                placeholder="e.g. 'web design project' or 'marketing campaign'"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && generateAI()}
              />
            </div>
            <button
              className="btn-ai"
              onClick={generateAI}
              disabled={aiLoading || !aiPrompt.trim()}
            >
              {aiLoading ? (
                <>
                  <span className="spin">◌</span> Generating...
                </>
              ) : (
                <>✦ Generate Line Items with AI</>
              )}
            </button>

            <div style={{ marginTop: "1rem" }}>
              {items.map((item) => (
                <div key={item.id} className="line-item">
                  <div className="line-item-top">
                    <input
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, "description", e.target.value)
                      }
                      style={{
                        background: "transparent",
                        border: "none",
                        padding: 0,
                        fontSize: "0.85rem",
                        fontWeight: 500,
                      }}
                    />
                    <button
                      className="btn-remove"
                      onClick={() => removeItem(item.id)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                  <input
                    value={item.detail}
                    onChange={(e) =>
                      updateItem(item.id, "detail", e.target.value)
                    }
                    placeholder="Description..."
                    style={{
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      fontSize: "0.72rem",
                      color: "var(--muted)",
                      width: "100%",
                      marginBottom: "0.5rem",
                    }}
                  />
                  <div className="line-item-nums">
                    <div>
                      <label>Qty</label>
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) =>
                          updateItem(item.id, "qty", e.target.value)
                        }
                        min="0"
                      />
                    </div>
                    <div>
                      <label>Rate ({meta.currency})</label>
                      <div className="currency-input-wrap">
                        <span className="currency-symbol">{symb}</span>
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) =>
                            updateItem(item.id, "rate", e.target.value)
                          }
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-add" onClick={addItem}>
              + Add Line Item Manually
            </button>
          </div>

          {/* ADJUSTMENTS */}
          <div className="section">
            <div className="section-label">Adjustments</div>
            <div className="input-row">
              <div>
                <label>Tax (%)</label>
                <input
                  type="number"
                  value={tax}
                  onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label>Discount (%)</label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>

          {/* NOTES */}
          <div className="section">
            <div className="section-label">Notes</div>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* ── RIGHT PANEL: Live Preview ── */}
        <InvoicePreview
          from={from}
          bank={bank}
          to={to}
          meta={meta}
          items={items}
          tax={tax}
          discount={discount}
          notes={notes}
          onSave={handleSave}
          isEdit={isEdit}
        />
      </div>
    </>
  );
}
