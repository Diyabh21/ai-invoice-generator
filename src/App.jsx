import { useState } from "react";
import AuthScreen from "./components/AuthScreen";
import Dashboard from "./components/Dashboard";
import InvoiceEditor from "./components/InvoiceEditor";
import Sidebar from "./components/Sidebar";

import "./styles/index.css";
import "./styles/auth.css";
import "./styles/layout.css";
import "./styles/dashboard.css";
import "./styles/editor.css";
import "./styles/preview.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("dashboard");
  const [invoices, setInvoices] = useState([]);
  const [editingInv, setEditingInv] = useState(null);

  const userInvoices = invoices.filter((i) => i.userId === user?.id);

  const handleLogin = (u) => {
    setUser(u);
    setView("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setView("dashboard");
  };

  const handleSaved = (inv) => {
    setInvoices((prev) => {
      const exists = prev.find((i) => i.id === inv.id);
      if (exists) return prev.map((i) => (i.id === inv.id ? inv : i));
      return [...prev, inv];
    });
    setView("dashboard");
    setEditingInv(null);
  };

  const handleDelete = (id) =>
    setInvoices((prev) => prev.filter((i) => i.id !== id));

  const handleStatusChange = (id, status) =>
    setInvoices((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status } : i)),
    );

  const handleEdit = (inv) => {
    setEditingInv(inv);
    setView("edit");
  };

  const handleNavigate = (dest) => {
    if (dest === "new") setEditingInv(null);
    setView(dest);
  };

  if (!user) return <AuthScreen onLogin={handleLogin} />;
  if (view === "new" || view === "edit") {
    return (
      <InvoiceEditor
        user={user}
        existing={editingInv}
        onSaved={handleSaved}
        onCancel={() => {
          setView("dashboard");
          setEditingInv(null);
        }}
      />
    );
  }

  return (
    <div className="shell">
      <Sidebar
        user={user}
        view={view}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
      <div className="main-content">
        <Dashboard
          user={user}
          invoices={userInvoices}
          onNew={() => {
            setEditingInv(null);
            setView("new");
          }}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
}
