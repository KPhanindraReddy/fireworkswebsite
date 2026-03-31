# SkyBurst Fireworks

Full-stack e-commerce web application for selling fireworks with guest checkout, COD-only ordering, MongoDB persistence, Cloudinary-ready image uploads, and a basic admin panel.

## Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB Atlas / MongoDB via Mongoose
- Image storage: Cloudinary-ready upload API
- Payment: Cash on Delivery

## Project Structure

```text
/client
/server
  /config
  /controllers
  /data
  /middleware
  /models
  /routes
  /utils
```

## Features

- Guest browsing with no login required
- Add to cart, update quantity, remove items
- Fast checkout with:
  - Full name
  - Mobile number
  - Address
  - Pincode
  - Optional password
- Order success page and order tracking page
- Basic admin dashboard:
  - Add/edit/delete products
  - Upload product images through Cloudinary
  - View orders
  - Update order status
- Mobile-first responsive UI
- Sticky cart access and sticky product add-to-cart actions
- Toast notifications and loading states
- Starter sample product catalog seeded automatically if the database is empty

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Client example:

```bash
client/.env.example
```

Server example:

```bash
server/.env.example
```

Important server values:

- `MONGODB_URI`
- `CLIENT_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Cloudinary upload from the admin panel works only after the Cloudinary values are added.

### 3. Run in development

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run seed
```

## API Endpoints

### Products

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Orders

- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`
- `PATCH /api/orders/:id/status`

### Uploads

- `POST /api/uploads/image`

## Production Notes

- Build the frontend with `npm run build`
- The Express server serves the built client in production
- Configure MongoDB and Cloudinary through environment variables
- Replace the starter SVG product art with real product photography in the admin panel for launch
