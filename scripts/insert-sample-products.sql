-- Insert sample luxury bag products with high-quality images
-- Run this AFTER the setup-database.sql script

-- Clear existing products (optional)
-- DELETE FROM products;

INSERT INTO products (name, slug, description, price, sale_price, image_url, category, stock_quantity, is_featured)
VALUES
  (
    'Rose Velvet Evening Bag',
    'rose-velvet-evening-bag',
    'Luxurious rose velvet evening bag with gold chain strap. Features quilted design and magnetic closure. Perfect for special occasions and elegant nights out.',
    189.99,
    149.99,
    'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80',
    'Evening Bag',
    15,
    TRUE
  ),
  (
    'Blush Pink Leather Tote',
    'blush-pink-leather-tote',
    'Premium genuine Italian leather tote in soft blush pink. Spacious interior with multiple compartments. Timeless design for everyday sophistication.',
    299.99,
    NULL,
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
    'Tote',
    12,
    TRUE
  ),
  (
    'Quilted Rose Gold Crossbody',
    'quilted-rose-gold-crossbody',
    'Elegant quilted crossbody in dusty rose with gold hardware. Adjustable chain strap and interior card slots. Compact yet functional.',
    179.99,
    159.99,
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
    'Crossbody',
    20,
    TRUE
  ),
  (
    'Pink Satin Mini Clutch',
    'pink-satin-mini-clutch',
    'Delicate satin clutch in soft pink with crystal clasp. Perfect for weddings, galas, and formal events. Includes detachable chain.',
    129.99,
    NULL,
    'https://images.unsplash.com/photo-1564422167509-4f1c93df38e0?w=800&q=80',
    'Clutch',
    30,
    FALSE
  ),
  (
    'Mauve Hobo Shoulder Bag',
    'mauve-hobo-shoulder-bag',
    'Sophisticated hobo bag in mauve leather with slouchy silhouette. Interior zip pocket and key holder. Effortlessly chic.',
    249.99,
    219.99,
    'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80',
    'Hobo',
    10,
    FALSE
  ),
  (
    'Dusty Rose Bucket Bag',
    'dusty-rose-bucket-bag',
    'Modern bucket bag in dusty rose with drawstring closure. Includes inner pouch and adjustable strap. Perfect everyday companion.',
    199.99,
    NULL,
    'https://images.unsplash.com/photo-1564422170194-896b89110ef8?w=800&q=80',
    'Bucket',
    18,
    TRUE
  ),
  (
    'Coral Pink Satchel',
    'coral-pink-satchel',
    'Classic satchel in vibrant coral pink. Structured design with top handle and shoulder strap. Professional yet playful.',
    279.99,
    249.99,
    'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=800&q=80',
    'Satchel',
    8,
    FALSE
  ),
  (
    'Blush Quilted Flap Bag',
    'blush-quilted-flap-bag',
    'Iconic quilted flap bag in soft blush. Gold chain strap and signature turn-lock closure. A timeless investment piece.',
    399.99,
    NULL,
    'https://images.unsplash.com/photo-1590739225017-e5827de7dff1?w=800&q=80',
    'Shoulder',
    5,
    TRUE
  );
