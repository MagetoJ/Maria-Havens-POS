import z from "zod";

// Menu Item Schema
export const MenuItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  category: z.string(),
  available: z.boolean(),
  image: z.string().optional(),
});

export type MenuItem = z.infer<typeof MenuItemSchema>;

// Order Item Schema
export const OrderItemSchema = z.object({
  id: z.string(),
  menuItemId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  notes: z.string().optional(),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;

// Order Schema
export const OrderSchema = z.object({
  id: z.string(),
  roomNumber: z.string().optional(),
  tableNumber: z.string().optional(),
  customerName: z.string().optional(),
  items: z.array(OrderItemSchema),
  subtotal: z.number(),
  tax: z.number(),
  total: z.number(),
  status: z.enum(['pending', 'preparing', 'ready', 'delivered', 'paid']),
  type: z.enum(['room-service', 'restaurant', 'bar']),
  createdAt: z.string(),
  notes: z.string().optional(),
});

export type Order = z.infer<typeof OrderSchema>;

// Payment Schema
export const PaymentSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  amount: z.number(),
  method: z.enum(['cash', 'credit', 'debit', 'room-charge']),
  status: z.enum(['pending', 'completed', 'failed']),
  createdAt: z.string(),
});

export type Payment = z.infer<typeof PaymentSchema>;

// Guest Schema
export const GuestSchema = z.object({
  id: z.string(),
  name: z.string(),
  roomNumber: z.string(),
  checkIn: z.string(),
  checkOut: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
});

export type Guest = z.infer<typeof GuestSchema>;
