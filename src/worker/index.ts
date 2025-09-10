import { Hono } from "hono";
import { cors } from "hono/cors";
import { authMiddleware, getOAuthRedirectUrl, exchangeCodeForSessionToken, deleteSession, MOCHA_SESSION_TOKEN_COOKIE_NAME } from "@getmocha/users-service/backend";
import { getCookie, setCookie } from "hono/cookie";
import { MochaUser } from "@getmocha/users-service/shared";

type Bindings = {
  DB: D1Database;
  MOCHA_USERS_SERVICE_API_URL: string;
  MOCHA_USERS_SERVICE_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", cors({
  origin: ["http://localhost:5173", "https://localhost:5173"],
  credentials: true,
}));

// Auth endpoints
app.get('/api/oauth/google/redirect_url', async (c) => {
  const redirectUrl = await getOAuthRedirectUrl('google', {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60, // 60 days
  });

  return c.json({ success: true }, 200);
});

app.get("/api/users/me", authMiddleware, async (c) => {
  const user = c.get("user") as MochaUser;
  
  // Check if admin user exists in our database
  const adminUser = await c.env.DB.prepare(
    "SELECT * FROM admin_users WHERE mocha_user_id = ?"
  ).bind(user.id).first();

  if (!adminUser) {
    return c.json({ error: "Admin user not found" }, 403);
  }

  return c.json({
    ...user,
    adminUser: {
      id: adminUser.id,
      name: adminUser.name,
      email: adminUser.email,
      phone: adminUser.phone,
      role: adminUser.role,
      isActive: adminUser.is_active
    }
  });
});

app.get('/api/logout', async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === 'string') {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    sameSite: 'none',
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// Admin Users API
app.get('/api/admin-users', authMiddleware, async (c) => {
  const user = c.get("user") as MochaUser;
  const adminUser = await c.env.DB.prepare(
    "SELECT * FROM admin_users WHERE mocha_user_id = ?"
  ).bind(user.id).first();

  if (!adminUser || (adminUser.role !== 'super-admin' && adminUser.role !== 'admin' && adminUser.role !== 'manager')) {
    return c.json({ error: "Unauthorized" }, 403);
  }

  const { results } = await c.env.DB.prepare(
    "SELECT id, name, email, phone, role, is_active, created_at FROM admin_users ORDER BY created_at DESC"
  ).all();

  return c.json(results);
});

app.post('/api/admin-users', authMiddleware, async (c) => {
  const user = c.get("user") as MochaUser;
  const adminUser = await c.env.DB.prepare(
    "SELECT * FROM admin_users WHERE mocha_user_id = ?"
  ).bind(user.id).first();

  if (!adminUser || (adminUser.role !== 'super-admin' && adminUser.role !== 'admin')) {
    return c.json({ error: "Unauthorized" }, 403);
  }

  const body = await c.req.json();
  const { name, email, phone, role } = body;

  if (!name || !email || !role) {
    return c.json({ error: "Missing required fields" }, 400);
  }

  const result = await c.env.DB.prepare(
    "INSERT INTO admin_users (name, email, phone, role) VALUES (?, ?, ?, ?)"
  ).bind(name, email, phone || null, role).run();

  return c.json({ id: result.meta.last_row_id, success: true });
});

app.put('/api/admin-users/:id', authMiddleware, async (c) => {
  const user = c.get("user") as MochaUser;
  const adminUser = await c.env.DB.prepare(
    "SELECT * FROM admin_users WHERE mocha_user_id = ?"
  ).bind(user.id).first();

  if (!adminUser || (adminUser.role !== 'super-admin' && adminUser.role !== 'admin')) {
    return c.json({ error: "Unauthorized" }, 403);
  }

  const userId = c.req.param('id');
  const body = await c.req.json();

  await c.env.DB.prepare(
    "UPDATE admin_users SET name = ?, email = ?, phone = ?, role = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(body.name, body.email, body.phone || null, body.role, body.isActive ? 1 : 0, userId).run();

  return c.json({ success: true });
});

// Guests API
app.get('/api/guests', authMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM guests ORDER BY created_at DESC"
  ).all();

  return c.json(results);
});

app.post('/api/guests', authMiddleware, async (c) => {
  const user = c.get("user") as MochaUser;
  const adminUser = await c.env.DB.prepare(
    "SELECT * FROM admin_users WHERE mocha_user_id = ?"
  ).bind(user.id).first();

  if (!adminUser) {
    return c.json({ error: "Admin user not found" }, 403);
  }

  const body = await c.req.json();
  const { name, email, phone, roomNumber, checkInDate, checkOutDate, idNumber, nationality } = body;

  if (!name) {
    return c.json({ error: "Name is required" }, 400);
  }

  const result = await c.env.DB.prepare(
    "INSERT INTO guests (name, email, phone, room_number, check_in_date, check_out_date, id_number, nationality, created_by_admin_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(name, email || null, phone || null, roomNumber || null, checkInDate || null, checkOutDate || null, idNumber || null, nationality || null, adminUser.id).run();

  return c.json({ id: result.meta.last_row_id, success: true });
});

// Menu Items API
app.get('/api/menu-items', authMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM menu_items WHERE is_available = 1 ORDER BY category, name"
  ).all();

  return c.json(results);
});

// Orders API
app.get('/api/orders', authMiddleware, async (c) => {
  const user = c.get("user") as MochaUser;
  const adminUser = await c.env.DB.prepare(
    "SELECT * FROM admin_users WHERE mocha_user_id = ?"
  ).bind(user.id).first();

  if (!adminUser) {
    return c.json({ error: "Admin user not found" }, 403);
  }

  let query = `
    SELECT o.*, g.name as guest_name, a.name as created_by_name
    FROM orders o
    LEFT JOIN guests g ON o.guest_id = g.id
    LEFT JOIN admin_users a ON o.created_by_admin_id = a.id
  `;

  // If not manager/admin, only show own orders
  if (adminUser.role === 'staff') {
    query += ` WHERE o.created_by_admin_id = ${adminUser.id}`;
  }

  query += ` ORDER BY o.created_at DESC`;

  const { results } = await c.env.DB.prepare(query).all();

  // Get order items for each order
  for (const order of results) {
    const { results: items } = await c.env.DB.prepare(
      "SELECT * FROM order_items WHERE order_id = ?"
    ).bind(order.id).all();
    (order as any).items = items;
  }

  return c.json(results);
});

app.post('/api/orders', authMiddleware, async (c) => {
  const user = c.get("user") as MochaUser;
  const adminUser = await c.env.DB.prepare(
    "SELECT * FROM admin_users WHERE mocha_user_id = ?"
  ).bind(user.id).first();

  if (!adminUser) {
    return c.json({ error: "Admin user not found" }, 403);
  }

  const body = await c.req.json();
  const { guestId, roomNumber, tableNumber, customerName, orderType, items, subtotal, tax, total, notes } = body;

  if (!items || items.length === 0) {
    return c.json({ error: "Order must have items" }, 400);
  }

  const orderNumber = `ORD-${Date.now()}`;

  const orderResult = await c.env.DB.prepare(
    "INSERT INTO orders (order_number, guest_id, room_number, table_number, customer_name, order_type, subtotal, tax, total, notes, created_by_admin_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(orderNumber, guestId || null, roomNumber || null, tableNumber || null, customerName || null, orderType, subtotal, tax, total, notes || null, adminUser.id).run();

  const orderId = orderResult.meta.last_row_id;

  // Insert order items
  for (const item of items) {
    await c.env.DB.prepare(
      "INSERT INTO order_items (order_id, menu_item_id, name, price, quantity, notes) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(orderId, item.menuItemId, item.name, item.price, item.quantity, item.notes || null).run();
  }

  return c.json({ id: orderId, orderNumber, success: true });
});

app.put('/api/orders/:id/status', authMiddleware, async (c) => {
  const orderId = c.req.param('id');
  const body = await c.req.json();
  const { status } = body;

  await c.env.DB.prepare(
    "UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(status, orderId).run();

  return c.json({ success: true });
});

// Payments API
app.post('/api/payments', authMiddleware, async (c) => {
  const user = c.get("user") as MochaUser;
  const adminUser = await c.env.DB.prepare(
    "SELECT * FROM admin_users WHERE mocha_user_id = ?"
  ).bind(user.id).first();

  if (!adminUser) {
    return c.json({ error: "Admin user not found" }, 403);
  }

  const body = await c.req.json();
  const { orderId, amount, paymentMethod, transactionReference } = body;

  const result = await c.env.DB.prepare(
    "INSERT INTO payments (order_id, amount, payment_method, payment_status, transaction_reference, processed_by_admin_id) VALUES (?, ?, ?, 'completed', ?, ?)"
  ).bind(orderId, amount, paymentMethod, transactionReference || null, adminUser.id).run();

  // Update order status to paid
  await c.env.DB.prepare(
    "UPDATE orders SET status = 'paid', updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(orderId).run();

  return c.json({ id: result.meta.last_row_id, success: true });
});

// Sales Reports API
app.get('/api/reports/sales', authMiddleware, async (c) => {
  const user = c.get("user") as MochaUser;
  const adminUser = await c.env.DB.prepare(
    "SELECT * FROM admin_users WHERE mocha_user_id = ?"
  ).bind(user.id).first();

  if (!adminUser || (adminUser.role !== 'super-admin' && adminUser.role !== 'admin' && adminUser.role !== 'manager')) {
    return c.json({ error: "Unauthorized" }, 403);
  }

  // Sales by admin user
  const { results: salesByAdmin } = await c.env.DB.prepare(`
    SELECT 
      a.name,
      a.role,
      COUNT(o.id) as total_orders,
      SUM(CASE WHEN o.status = 'paid' THEN o.total ELSE 0 END) as total_revenue,
      SUM(CASE WHEN DATE(o.created_at) = DATE('now') AND o.status = 'paid' THEN o.total ELSE 0 END) as today_revenue
    FROM admin_users a
    LEFT JOIN orders o ON a.id = o.created_by_admin_id
    WHERE a.is_active = 1
    GROUP BY a.id, a.name, a.role
    ORDER BY total_revenue DESC
  `).all();

  return c.json({ salesByAdmin });
});

export default app;
