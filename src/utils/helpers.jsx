export const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "INR", symbol: "₹" },
  { code: "CAD", symbol: "CA$" },
  { code: "AUD", symbol: "A$" },
  { code: "JPY", symbol: "¥" },
  { code: "SGD", symbol: "S$" },
  { code: "AED", symbol: "AED" },
  { code: "CHF", symbol: "CHF" },
];

export const CURRENCIES_FULL = [
  { code: "USD", label: "USD — US Dollar", symbol: "$" },
  { code: "EUR", label: "EUR — Euro", symbol: "€" },
  { code: "GBP", label: "GBP — British Pound", symbol: "£" },
  { code: "INR", label: "INR — Indian Rupee", symbol: "₹" },
  { code: "CAD", label: "CAD — Canadian Dollar", symbol: "CA$" },
  { code: "AUD", label: "AUD — Australian Dollar", symbol: "A$" },
  { code: "JPY", label: "JPY — Japanese Yen", symbol: "¥" },
  { code: "SGD", label: "SGD — Singapore Dollar", symbol: "S$" },
  { code: "AED", label: "AED — UAE Dirham", symbol: "AED" },
  { code: "CHF", label: "CHF — Swiss Franc", symbol: "CHF" },
];

export const fmt = (n, currency = "USD") => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(n || 0);
  } catch {
    return `${currency} ${(n || 0).toFixed(2)}`;
  }
};

export const today = () => new Date().toISOString().split("T")[0];

export const dueDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split("T")[0];
};

export const uid = () => Math.random().toString(36).slice(2, 9);

export const DB = {
  users: [
    {
      id: "demo",
      email: "demo@example.com",
      password: "demo1234",
      name: "Studio Marigold",
    },
  ],
  invoices: [],
};
