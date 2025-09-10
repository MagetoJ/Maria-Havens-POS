
DROP INDEX idx_payments_order_id;
DROP INDEX idx_order_items_order_id;
DROP INDEX idx_orders_created_at;
DROP INDEX idx_orders_status;
DROP INDEX idx_orders_created_by_admin_id;
DROP INDEX idx_guests_room_number;
DROP INDEX idx_admin_users_mocha_user_id;

DROP TABLE payments;
DROP TABLE menu_items;
DROP TABLE order_items;
DROP TABLE orders;
DROP TABLE guests;
DROP TABLE admin_users;
