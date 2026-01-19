-- Create tables for Bagsberry e-commerce platform

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2),
  image_url VARCHAR(500),
  category VARCHAR(100),
  stock_quantity INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email VARCHAR(255),
  full_name VARCHAR(255),
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products (public read)
CREATE POLICY "Products are readable by everyone" ON products
  FOR SELECT USING (true);

-- RLS Policies for cart_items (users can only see their own)
CREATE POLICY "Users can view their own cart" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items" ON cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" ON cart_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" ON cart_items
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for orders (users can only see their own)
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for order_items (through orders)
CREATE POLICY "Users can view their order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Insert sample products
INSERT INTO products (name, slug, description, price, sale_price, image_url, category, stock_quantity, is_featured)
VALUES
  (
    'Velvet Crossbody',
    'velvet-crossbody',
    'Luxurious velvet crossbody bag with gold chain strap. Perfect for evening events or casual outings.',
    189.99,
    149.99,
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80',
    'Crossbody',
    15,
    TRUE
  ),
  (
    'Leather Tote',
    'leather-tote',
    'Premium genuine leather tote bag with spacious interior. Timeless design for everyday use.',
    249.99,
    NULL,
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80',
    'Tote',
    8,
    TRUE
  ),
  (
    'Quilted Shoulder Bag',
    'quilted-shoulder-bag',
    'Elegant quilted shoulder bag with soft leather. Features interior pockets and adjustable strap.',
    199.99,
    179.99,
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80',
    'Shoulder',
    12,
    FALSE
  ),
  (
    'Mini Clutch',
    'mini-clutch',
    'Compact and stylish mini clutch. Great for special occasions or as a weekend accessory.',
    79.99,
    NULL,
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80',
    'Clutch',
    25,
    TRUE
  ),
  (
    'Hobo Handbag',
    'hobo-handbag',
    'Sophisticated hobo handbag with soft texture. Perfect blend of style and functionality.',
    219.99,
    199.99,
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80',
    'Hobo',
    10,
    FALSE
  );
