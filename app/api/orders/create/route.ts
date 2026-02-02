import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { items, shippingInfo, location, total } = body;

    // Validate request
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in order' },
        { status: 400 }
      );
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: user.id,
          total_amount: total,
          status: 'pending',
          customer_name: shippingInfo.name,
          customer_email: shippingInfo.email,
          customer_phone: shippingInfo.phone || null,
          shipping_address: JSON.stringify(shippingInfo),
          payment_status: 'pending',
          delivery_latitude: location?.latitude || null,
          delivery_longitude: location?.longitude || null,
          delivery_map_url: location?.mapUrl || null,
        },
      ])
      .select()
      .single();

    if (orderError) {
      throw orderError;
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      // Rollback order if items fail
      await supabase.from('orders').delete().eq('id', order.id);
      throw itemsError;
    }

    // Update product stock
    for (const item of items) {
      await supabase.rpc('decrement_stock', {
        product_id: item.productId,
        quantity: item.quantity,
      });
    }

    // Send order confirmation email (non-blocking)
    const orderNumber = order.id.substring(0, 8).toUpperCase();
    
    // Use environment variable for base URL in production, construct from host in dev
    const getBaseUrl = () => {
      if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL;
      }
      // In dev/local, construct from request host
      const host = request.headers.get('host');
      if (!host) {
        console.error('❌ No host header found, cannot send email');
        return null;
      }
      const protocol = host.includes('localhost') ? 'http' : 'https';
      return `${protocol}://${host}`;
    };

    const baseUrl = getBaseUrl();
    if (baseUrl) {
      fetch(`${baseUrl}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'order-placed',
          to: shippingInfo.email,
          data: {
            customerName: shippingInfo.name,
            orderNumber: orderNumber,
            items: items.map((item: any) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
            })),
            total: total,
            shippingAddress: {
              address: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              zip: shippingInfo.zip,
            },
          },
        }),
      }).catch(err => console.error('❌ Failed to send order confirmation email:', err));
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: orderNumber,
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
