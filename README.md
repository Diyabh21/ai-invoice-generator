# Invoicer

A professional invoice builder with AI-powered line item generation, multi-currency support, and a live PDF preview. Built with React (Vite) on the frontend and a lightweight Express proxy on the backend.

---

## Features

- **AI Line Item Generation** — Describe your project and Claude generates realistic invoice line items instantly
- **Live Preview** — See a print-ready invoice update in real time as you type
- **Multi-Currency** — Supports USD, EUR, GBP, INR, CAD, AUD, JPY, SGD, AED, CHF; dashboard totals are grouped per currency
- **Bank Details** — Add account number, IFSC, and branch for payment instructions on the invoice
- **Tax IDs** — PAN and GST fields for Indian freelancers and businesses
- **Invoice Management** — Create, edit, delete invoices; mark them Draft / Pending / Paid
- **Print to PDF** — Browser-native print dialog generates a clean, styled PDF
- **Auth** — Simple in-memory login/register (demo account included)

---

## Project Structure

```
invoicer/
├── server/
│   └── index.js              # Express API proxy (forwards to Anthropic)
└── src/
    ├── App.jsx               # Root component, routing & state
    ├── components/
    │   ├── AuthScreen.jsx    # Login & register
    │   ├── Dashboard.jsx     # Stats cards + invoice list
    │   ├── InvoiceEditor.jsx # Left panel: form + AI prompt
    │   ├── InvoicePreview.jsx# Right panel: live invoice document
    │   └── Sidebar.jsx       # Navigation sidebar
    ├── utils/
    │   └── helpers.js        # Currency data, fmt(), uid(), in-memory DB
    └── styles/
        ├── index.css         # Reset, CSS variables, animations, media queries
        ├── auth.css          # Auth screen & card
        ├── layout.css        # Shell, sidebar, nav
        ├── dashboard.css     # Stats, invoice table, badges
        ├── editor.css        # Editor panel, line items, AI controls
        └── preview.css       # Invoice document, totals, bank details
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

### 1. Clone & install

```bash
git clone https://github.com/your-username/invoicer.git
cd invoicer
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
# Frontend — Vite picks this up automatically
VITE_API_URL=http://localhost:3001
```

Create a `.env` file in the `server/` directory:

```env
ANTHROPIC_API_KEY=sk-ant-...
PORT=3001
```

### 3. Run the dev servers

In one terminal, start the API proxy:

```bash
node server/index.js
```

In another terminal, start the Vite dev server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---
## Project Link : https://ai-invoicegenerator.netlify.app/
---

## Demo Account

The app ships with a pre-seeded in-memory user:

| Field    | Value               |
|----------|---------------------|
| Email    | demo@example.com    |
| Password | demo1234            |

You can also register a new account — it lives in memory for the session.

> **Note:** All data is in-memory only. Refreshing the page resets invoices and users (except the demo account).

---

## Backend — API Proxy

The Express server in `server/index.js` proxies requests to Anthropic so your API key is never exposed to the browser.

```
POST /api/generate
```

Accepts the same body as the [Anthropic Messages API](https://docs.anthropic.com/en/api/messages) and forwards it with your server-side `ANTHROPIC_API_KEY`.

---

## Deployment

### Frontend — Netlify / Vercel

```bash
npm run build
# deploy the dist/ folder
```

Set the environment variable in your hosting dashboard:

```
VITE_API_URL=https://your-api-server.onrender.com
```

### Backend — Render / Railway

Point your host to `server/index.js` as the start command:

```bash
node server/index.js
```

Set the environment variable:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Update the CORS origin in `server/index.js` from `"*"` to your deployed frontend URL for production.

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, Vite                    |
| Styling   | Plain CSS with CSS custom properties |
| Fonts     | Playfair Display, DM Mono, DM Sans (Google Fonts) |
| AI        | Anthropic Claude (claude-sonnet-4) |
| Backend   | Express, node-fetch               |
| Auth      | In-memory (no persistence)        |

---

## License

MIT
