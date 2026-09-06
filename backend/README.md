# 1Fi Marketplace Backend

A complete Node.js/Express backend API for the 1Fi Marketplace with PostgreSQL database integration.

## Features

- User authentication (register/login)
- Product management (CRUD operations)
- Order management
- PostgreSQL database
- RESTful API endpoints
- Secure password hashing
- JWT token authentication infrastructure
- Product variants and EMI plan management

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials:
```
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=marketplace_db
PORT=5000
JWT_SECRET=your_jwt_secret_key
```

## Setup PostgreSQL Database

1. Create a new database:
```bash
createdb marketplace_db
```

2. Start the server (tables will be created automatically):
```bash
npm run dev
```

If PostgreSQL is configured on another port, use that port in `.env`. The current Windows development setup uses PostgreSQL 14 on port `5433`.

3. Load sample products, variants, and EMI plans:
```bash
npm run seed
```

## Running the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Products
- `POST /api/products` - Create product
- `GET /api/products` - Get all products (with search/filter)
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/seller/:seller_id` - Get products by seller

### Variants
- `GET /api/variants/product/:product_id` - Get variants for a product
- `POST /api/variants` - Create a variant
- `PUT /api/variants/:id` - Update a variant
- `DELETE /api/variants/:id` - Delete a variant

### EMI Plans
- `GET /api/emi/product/:product_id` - Get active EMI plans for a product
- `POST /api/emi` - Create an EMI plan
- `PUT /api/emi/:id` - Update an EMI plan
- `DELETE /api/emi/:id` - Delete an EMI plan

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id` - Update order status
- `DELETE /api/orders/:id` - Delete order
- `GET /api/orders/buyer/:buyer_id` - Get orders by buyer
- `GET /api/orders/seller/:seller_id` - Get orders by seller

### Health Check
- `GET /api/health` - Server health check

## Example Requests

### Register User
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "phone": "1234567890",
    "address": "123 Main St"
  }'
```

### Create Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "seller_id": "uuid-here",
    "name": "Product Name",
    "description": "Product Description",
    "price": 99.99,
    "quantity": 10,
    "category": "Electronics",
    "image_url": "https://example.com/image.jpg"
  }'
```

### Create Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "buyer_id": "uuid-here",
    "seller_id": "uuid-here",
    "product_id": "uuid-here",
    "quantity": 2
  }'
```

## Database Schema

### Users Table
- id (UUID, Primary Key)
- email (VARCHAR, Unique)
- password (VARCHAR)
- name (VARCHAR)
- phone (VARCHAR)
- address (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Product Variants Table
- id (UUID, Primary Key)
- product_id (UUID, Foreign Key)
- variant_name (VARCHAR)
- variant_value (VARCHAR)
- price_adjustment (DECIMAL)
- stock (INT)

### EMI Plans Table
- id (UUID, Primary Key)
- product_id (UUID, Foreign Key)
- plan_name (VARCHAR)
- tenure_months (INT)
- interest_rate (DECIMAL)
- emi_amount (DECIMAL)
- processing_fee (DECIMAL)
- active (BOOLEAN)

### Products Table
- id (UUID, Primary Key)
- seller_id (UUID, Foreign Key)
- name (VARCHAR)
- description (TEXT)
- price (DECIMAL)
- quantity (INT)
- category (VARCHAR)
- image_url (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Orders Table
- id (UUID, Primary Key)
- buyer_id (UUID, Foreign Key)
- seller_id (UUID, Foreign Key)
- product_id (UUID, Foreign Key)
- quantity (INT)
- total_price (DECIMAL)
- status (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check your `.env` file configuration
- Verify database credentials

### Port Already in Use
- Change the PORT in `.env`
- Or kill the process using the port

## Future Enhancements

- Payment gateway integration
- Email notifications
- Product reviews and ratings
- Cart functionality
- Admin dashboard
- Advanced search and filtering
- File upload for product images
