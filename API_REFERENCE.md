# CampusEats MEC - API Reference

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## 🔐 Authentication Endpoints

### POST /auth/signup
Register a new user.

**Body:**
```json
{
  "email": "student@mec.ac.in",
  "password": "password123",
  "name": "John Doe",
  "role": "student",
  "rfid_uid": "ABC12345" // Optional, for students
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "...", "name": "...", "role": "student" },
    "session": { "access_token": "...", "refresh_token": "..." }
  }
}
```

### POST /auth/login
Login with email and password.

**Body:**
```json
{
  "email": "student@mec.ac.in",
  "password": "password123"
}
```

**Response:** `200 OK`

### POST /auth/logout
Logout current user.

**Response:** `200 OK`

### GET /auth/me
Get current user details. **Requires auth.**

**Response:** `200 OK`

---

## 📦 Order Endpoints

### POST /orders
Create a new order. **Requires student role.**

**Body:**
```json
{
  "vendor_id": "vendor_123",
  "items": [
    {
      "item_id": "item_456",
      "name": "Burger",
      "price": 120,
      "quantity": 2
    }
  ],
  "payment_method": "rfid"
}
```

**Response:** `201 Created`

### GET /orders/:id
Get order details. **Requires auth.**

**Response:** `200 OK`

### GET /orders/user/:userId
Get all orders for a user. **Requires auth.**

**Response:** `200 OK`

### GET /orders/vendor/:vendorId
Get all orders for a vendor. **Requires vendor role.**

**Query params:**
- `status=pending` - Get only pending orders (order queue)

**Response:** `200 OK`

### PATCH /orders/:id/status
Update order status. **Requires vendor role.**

**Body:**
```json
{
  "status": "accepted" // pending | accepted | preparing | ready | picked_up | cancelled
}
```

**Response:** `200 OK`

### PATCH /orders/:id/pickup
Confirm pickup and process payment. **Requires auth.**

**Body:**
```json
{
  "rfid_uid": "ABC12345" // For RFID verification
}
```

**Response:** `200 OK`

---

## 💳 Payment & Wallet Endpoints

### POST /wallet/topup
Add funds to wallet. **Requires admin role.**

**Body:**
```json
{
  "user_id": "user_123",
  "amount": 500
}
```

**Response:** `200 OK`

### GET /wallet/balance/:userId
Get wallet balance. **Requires auth.**

**Response:** `200 OK`

### POST /payment/rfid
Verify RFID for payment. **Requires auth.**

**Body:**
```json
{
  "rfid_uid": "ABC12345",
  "order_id": "order_789"
}
```

**Response:** `200 OK`

---

## 🏪 Vendor Endpoints

### GET /vendors
Get all vendors. **Public endpoint.**

**Query params:**
- `available=true` - Get only open vendors

**Response:** `200 OK`

### GET /vendors/:id
Get vendor details. **Public endpoint.**

**Response:** `200 OK`

### PATCH /vendors/:id/status
Update vendor availability. **Requires vendor role.**

**Body:**
```json
{
  "status": "open" // open | closed | busy
}
```

**Response:** `200 OK`

---

## 🍔 Menu Endpoints

### GET /menu/:vendorId
Get menu for a vendor. **Public endpoint.**

**Query params:**
- `available=true` - Get only available items

**Response:** `200 OK`

### POST /menu
Create menu item. **Requires vendor role.**

**Body:**
```json
{
  "vendor_id": "vendor_123",
  "name": "Burger",
  "description": "Delicious beef burger",
  "price": 120,
  "category": "Main Course",
  "image_url": "https://...",
  "available": true
}
```

**Response:** `201 Created`

### PATCH /menu/item/:id
Update menu item. **Requires vendor role.**

**Body:**
```json
{
  "price": 130,
  "available": false
}
```

**Response:** `200 OK`

---

## 👥 Group Order Endpoints

### POST /group-orders
Create group order. **Requires student role.**

**Body:**
```json
{
  "linked_orders": [] // Optional, can add orders later
}
```

**Response:** `201 Created`

### POST /group-orders/:id/join
Join group order. **Requires student role.**

**Body:**
```json
{
  "order_id": "order_789"
}
```

**Response:** `200 OK`

---

## Error Responses

All errors follow this format:
```json
{
  "error": "Error message",
  "statusCode": 400
}
```

**Common status codes:**
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error
