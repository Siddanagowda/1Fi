# 1Fi Marketplace

A React/Vite 1Fi marketplace experience backed by an Express REST API and PostgreSQL. The original 1Fi Shop design is preserved: the marketplace appears inside the Shop page, with the same navigation, product screens, EMI journey, and responsive styling.

## Features

- Product listing with images, names, prices, categories, search, and filters
- Product detail view with description and relevant product information
- Database-backed product variants, colours, stock options, and price adjustments
- Database-backed EMI plans with tenure, monthly amount, and interest rate
- EMI plan selection and a clear CTA to continue with the selected plan
- Eligibility, mutual-fund linking, pledge review, and confirmation screens
- Responsive layout for mobile, tablet, and desktop
- Loading, error, and empty states

The eligibility and pledge screens are currently a front-end simulation. They do not create real KYC requests, mutual-fund pledges, loans, payments, or orders yet.

## Project Structure

```text
src/main.jsx              Original 1Fi UI and application flow
src/api/client.js         Frontend REST API client
src/style.css             Original 1Fi-inspired responsive styling
backend/server.js         Express server and database initialization
backend/routes/            Users, products, variants, EMI, and orders APIs
backend/seed.js            Sample marketplace data
backend/.env               Local database and server configuration
```

## Requirements

- Node.js 18+
- PostgreSQL 12+
- npm

## Setup

### 1. Configure PostgreSQL

Create a PostgreSQL database named `marketplace_db`. On Windows, this can be done in pgAdmin:

1. Connect to the PostgreSQL server.
2. Right-click **Databases** and select **Create → Database**.
3. Set the name to `marketplace_db`.

Update `backend/.env` with the credentials and port used by your PostgreSQL installation:

```env
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=marketplace_db
PORT=5000
```

`5433` is the port used by the current local PostgreSQL 14 installation. Use `5432` or another port if that is what your installation uses.

### 2. Start the backend

Open a terminal:

```powershell
cd backend
npm install
npm run dev
```

The backend initializes the tables automatically and runs at `http://localhost:5000`.

### 3. Seed sample data

In another terminal:

```powershell
cd backend
npm run seed
```

This creates sample users, products, variants, and EMI plans.

### 4. Start the frontend

In a third terminal:

```powershell
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`. If that port is already in use, Vite selects another port such as `5174`.

## API

The frontend uses `http://localhost:5000/api` through `src/api/client.js`.

- `GET /api/health` — backend health check
- `GET /api/products` — product listing with search, category, and pagination support
- `GET /api/products/:id` — product details with variants and EMI plans
- `/api/variants` — product variant CRUD
- `/api/emi` — EMI plan CRUD
- `/api/users` — registration, login, and user CRUD
- `/api/orders` — order CRUD and buyer/seller queries

## Validation

```bash
npm run build
```

The backend can be checked with:

```text
http://localhost:5000/api/health
```

## Production build

```bash
npm run build
npm run preview
```

## Design scope

The original 1Fi visual design is preserved. Top Brands and Nearby Stores remain reference screens, while the 1Fi Marketplace flow is connected to the PostgreSQL-backed product, variant, and EMI APIs.
