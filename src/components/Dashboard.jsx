import { fmt } from "../utils/helpers";

export default function Dashboard({
  user,
  invoices,
  onNew,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const revenuesByCurrency = invoices
    .filter((i) => i.status === "paid")
    .reduce((acc, i) => {
      acc[i.currency] = (acc[i.currency] || 0) + i.total;
      return acc;
    }, {});

  const pending = invoices.filter((i) => i.status === "pending");
  const pendingByCurrency = pending.reduce((acc, i) => {
    acc[i.currency] = (acc[i.currency] || 0) + i.total;
    return acc;
  }, {});

  const multiCurrency = Object.keys(revenuesByCurrency).length > 1;

  return (
    <div className="dashboard">
      <div className="dash-title">Welcome back, {user.name.split(" ")[0]}.</div>
      <div className="dash-sub">
        {new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>

      <div className="stats-row">
        {/* Card 1 */}
        <div className="stat-card">
          <div className="stat-label">Total Invoices</div>
          <div className="stat-val">{invoices.length}</div>
          <div className="stat-sub">all time</div>
        </div>

        {/* Card 2 */}
        <div className="stat-card">
          <div className="stat-label">Revenue Collected</div>
          {Object.keys(revenuesByCurrency).length === 0 ? (
            <div className="stat-val">—</div>
          ) : (
            Object.entries(revenuesByCurrency).map(([currency, amount]) => (
              <div
                className="stat-val"
                key={currency}
                style={{
                  fontSize: multiCurrency ? "1.2rem" : "1.8rem",
                  marginBottom: "0.2rem",
                }}
              >
                {fmt(amount, currency)}
              </div>
            ))
          )}
          <div className="stat-sub">paid invoices</div>
        </div>

        {/* Card 3 */}
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <div className="stat-val">{pending.length}</div>
          {Object.keys(pendingByCurrency).length === 0 ? (
            <div className="stat-sub">none outstanding</div>
          ) : (
            Object.entries(pendingByCurrency).map(([currency, amount]) => (
              <div className="stat-sub" key={currency}>
                {fmt(amount, currency)} outstanding
              </div>
            ))
          )}
        </div>
      </div>

      {/* Invoice list */}
      <div className="section-header">
        <div className="section-title">Recent Invoices</div>
        <button className="btn-new" onClick={onNew}>
          + New Invoice
        </button>
      </div>

      <div className="invoice-table-wrap">
        {invoices.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <div className="empty-title">No invoices yet</div>
            <div className="empty-sub">
              Create your first invoice to get started
            </div>
          </div>
        ) : (
          <table className="inv-list-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices
                .slice()
                .reverse()
                .map((inv) => (
                  <tr key={inv.id}>
                    <td>
                      <span className="inv-num-cell">{inv.number}</span>
                    </td>
                    <td>
                      <span className="inv-client">{inv.clientName}</span>
                    </td>
                    <td>
                      <span className="inv-date-cell">{inv.date}</span>
                    </td>
                    <td>
                      <span className="inv-amount-cell">
                        {fmt(inv.total, inv.currency)}
                      </span>
                    </td>
                    <td>
                      <select
                        value={inv.status}
                        onChange={(e) => onStatusChange(inv.id, e.target.value)}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          fontSize: "0.75rem",
                          color:
                            inv.status === "paid"
                              ? "var(--green)"
                              : inv.status === "pending"
                                ? "#9a6f2a"
                                : "var(--muted)",
                          fontFamily: "'DM Mono', monospace",
                          cursor: "pointer",
                          width: "auto",
                        }}
                      >
                        <option value="draft">Draft</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                      </select>
                    </td>
                    <td>
                      <div className="inv-actions">
                        <button className="btn-sm" onClick={() => onEdit(inv)}>
                          Edit
                        </button>
                        <button
                          className="btn-sm danger"
                          onClick={() => onDelete(inv.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
