import { fmt } from "../utils/helpers";

export default function InvoicePreview({
  from,
  bank,
  to,
  meta,
  items,
  tax,
  discount,
  notes,
  onSave,
  isEdit,
}) {
  const subtotal = items.reduce(
    (s, i) => s + (parseFloat(i.qty) || 0) * (parseFloat(i.rate) || 0),
    0,
  );
  const discountAmt = subtotal * (discount / 100);
  const taxAmt = (subtotal - discountAmt) * (tax / 100);
  const total = subtotal - discountAmt + taxAmt;

  return (
    <div className="preview">
      <div className="invoice" id="invoice-preview">
        {/* Header */}
        <div className="inv-header">
          <div>
            <div className="inv-logo">{from.name || "Your Business"}</div>
            <div className="inv-logo-sub">{from.email}</div>
          </div>
          <div className="inv-title-block">
            <div className="inv-word">Invoice</div>
            <div className="inv-number">{meta.number}</div>
          </div>
        </div>

        {/* From / To */}
        <div className="inv-meta">
          <div>
            <div className="inv-meta-label">From</div>
            <div className="inv-name">{from.name}</div>
            <div className="inv-address">{from.address}</div>
            <div className="inv-address" style={{ marginTop: "0.3rem" }}>
              {from.email}
            </div>
            <div className="inv-tax-badges">
              {from.pan && (
                <div className="inv-tax-badge">
                  <span>PAN</span>
                  {from.pan}
                </div>
              )}
              {from.gst && (
                <div className="inv-tax-badge">
                  <span>GST</span>
                  {from.gst}
                </div>
              )}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="inv-meta-label">Bill To</div>
            <div className="inv-name">{to.name}</div>
            <div className="inv-address" style={{ textAlign: "right" }}>
              {to.address}
            </div>
          </div>
        </div>

        {/* Dates */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "2rem",
            marginBottom: "2.5rem",
          }}
        >
          <div className="inv-date-row">
            <span className="inv-date-key">Issued</span>
            <span className="inv-date-val">{meta.date}</span>
          </div>
          <div className="inv-date-row">
            <span className="inv-date-key">Due</span>
            <span className="inv-date-val" style={{ color: "var(--rust)" }}>
              {meta.due}
            </span>
          </div>
        </div>

        {/* Items table */}
        <table className="inv-table">
          <thead>
            <tr>
              <th style={{ width: "50%", textAlign: "left" }}>Description</th>
              <th style={{ width: "12%" }}>Qty</th>
              <th style={{ width: "18%" }}>Rate</th>
              <th style={{ width: "20%" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const amt =
                (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0);
              return (
                <tr key={item.id}>
                  <td className="td-desc">
                    {item.description}
                    {item.detail && (
                      <div className="td-desc-sub">{item.detail}</div>
                    )}
                  </td>
                  <td className="td-mono">{item.qty}</td>
                  <td className="td-mono">{fmt(item.rate, meta.currency)}</td>
                  <td className="td-amount">{fmt(amt, meta.currency)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals */}
        <div className="inv-totals">
          <div className="totals-row">
            <span className="totals-key">Subtotal</span>
            <span className="totals-val">{fmt(subtotal, meta.currency)}</span>
          </div>
          {discount > 0 && (
            <div className="totals-row">
              <span className="totals-key">Discount ({discount}%)</span>
              <span className="totals-val" style={{ color: "var(--rust)" }}>
                −{fmt(discountAmt, meta.currency)}
              </span>
            </div>
          )}
          {tax > 0 && (
            <div className="totals-row">
              <span className="totals-key">Tax ({tax}%)</span>
              <span className="totals-val">{fmt(taxAmt, meta.currency)}</span>
            </div>
          )}
          <div
            className="totals-row totals-grand"
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0.85rem 0.75rem",
            }}
          >
            <span className="totals-key">Total Due</span>
            <span className="totals-val">{fmt(total, meta.currency)}</span>
          </div>
        </div>

        {/* Bank details */}
        {(bank.accountNumber || bank.bankName) && (
          <div className="inv-bank">
            <div className="inv-bank-title">Payment / Bank Details</div>
            <div className="inv-bank-grid">
              {bank.accountName && (
                <div className="inv-bank-row">
                  <span className="inv-bank-key">Account Name</span>
                  <span className="inv-bank-val">{bank.accountName}</span>
                </div>
              )}
              {bank.accountNumber && (
                <div className="inv-bank-row">
                  <span className="inv-bank-key">Account Number</span>
                  <span className="inv-bank-val">{bank.accountNumber}</span>
                </div>
              )}
              {bank.bankName && (
                <div className="inv-bank-row">
                  <span className="inv-bank-key">Bank</span>
                  <span className="inv-bank-val">{bank.bankName}</span>
                </div>
              )}
              {bank.ifsc && (
                <div className="inv-bank-row">
                  <span className="inv-bank-key">IFSC Code</span>
                  <span className="inv-bank-val">{bank.ifsc}</span>
                </div>
              )}
              {bank.branch && (
                <div className="inv-bank-row">
                  <span className="inv-bank-key">Branch</span>
                  <span className="inv-bank-val">{bank.branch}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes */}
        {notes && (
          <div className="inv-notes">
            <div className="inv-notes-label">Notes</div>
            <div className="inv-notes-text">{notes}</div>
          </div>
        )}

        {/* Footer */}
        <div className="inv-footer">
          <span>{from.name}</span>
          <span>
            {meta.number} · Generated {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="preview-actions">
        <button className="btn-save-inv" onClick={onSave}>
          {isEdit ? "✓ Update Invoice" : "✓ Save Invoice"}
        </button>
        <button className="btn-print" onClick={() => window.print()}>
          ⎙ Print / Save as PDF
        </button>
      </div>
    </div>
  );
}
