# 1Fi Marketplace

Standalone React/Vite implementation based on the assignment requirements and the 1Fi app screenshots provided by the candidate. The Marketplace is intentionally shown **inside the Shop page itself**, rather than behind a separate “Explore Marketplace” landing screen.

## End-to-end flow

Shop → 1Fi Marketplace → Search/category → Product → Variant + colour → EMI plan → Account/eligibility → Link mutual funds → Review pledge → Confirmation.

The eligibility flow is a realistic front-end simulation of an investment-backed EMI journey. It does **not** create a real KYC request, mutual-fund pledge, loan, or payment.

## Run

Node.js 18+ recommended.

```bash
npm install
npm run dev
```

Open the Vite URL, normally `http://localhost:5173`.

Production:

```bash
npm run build
npm run preview
```

## Architecture

- `src/main.jsx` — application routes, pages, components and mock API
- `src/style.css` — responsive 1Fi-inspired UI system
- Mock product service with delayed responses for loading-state testing
- Product/EMI information is kept in data structures rather than embedded in card markup
- `localStorage` keeps the selected product/variant/colour/EMI through the pledge flow

## Assignment scope

The original 1Fi source code was not provided. The implementation therefore uses the provided 1Fi app screenshots as the UI reference. Top Brands and Nearby Stores remain informational/reference implementations, while 1Fi Marketplace is fully interactive.
