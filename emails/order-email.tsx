import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface OrderEmailProps {
  customerName: string;
  orderNumber: string;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
}

const statusMessages = {
  confirmed: {
    title: 'Order Confirmed! 🎉',
    message: "We've received and confirmed your order. We're getting it ready for you!",
    color: '#22c55e',
  },
  processing: {
    title: 'Order Processing 📦',
    message: "Your order is being carefully prepared and packed!",
    color: '#3b82f6',
  },
  shipped: {
    title: 'Order Shipped! 🚚',
    message: "Your order is on its way to you!",
    color: '#8b5cf6',
  },
  delivered: {
    title: 'Order Delivered! ✨',
    message: "Your order has been delivered. Thank you for shopping with Bagsberry!",
    color: '#ec4899',
  },
};

export const OrderEmail = ({
  customerName,
  orderNumber,
  status,
  items,
  total,
  shippingAddress,
  trackingNumber,
  estimatedDelivery,
}: OrderEmailProps) => {
  const statusInfo = statusMessages[status];

  return (
    <Html>
      <Head />
      <Preview>{statusInfo.title} - Order #{orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo/Header */}
          <Heading style={logo}>Bagsberry</Heading>
          
          {/* Status Header */}
          <Section style={{ ...statusHeader, backgroundColor: statusInfo.color }}>
            <Heading style={statusHeading}>{statusInfo.title}</Heading>
            <Text style={statusMessage}>{statusInfo.message}</Text>
          </Section>

          {/* Greeting */}
          <Text style={text}>Dear {customerName},</Text>

          {/* Order Info */}
          <Section style={orderInfoBox}>
            <Text style={orderNumber}>Order #{orderNumber}</Text>
            {trackingNumber && (
              <Text style={trackingText}>
                <strong>Tracking Number:</strong> {trackingNumber}
              </Text>
            )}
            {estimatedDelivery && (
              <Text style={trackingText}>
                <strong>Estimated Delivery:</strong> {estimatedDelivery}
              </Text>
            )}
          </Section>

          {/* Order Items */}
          <Heading as="h2" style={sectionHeading}>
            Order Items
          </Heading>
          {items.map((item, index) => (
            <Section key={index} style={itemRow}>
              <Text style={itemName}>{item.name}</Text>
              <Text style={itemDetails}>
                Qty: {item.quantity} × NPR {item.price.toFixed(2)}
              </Text>
            </Section>
          ))}

          <Hr style={hr} />

          {/* Total */}
          <Section style={totalSection}>
            <Text style={totalText}>
              <strong>Total: NPR {total.toFixed(2)}</strong>
            </Text>
          </Section>

          {/* Delivery Address */}
          <Heading as="h2" style={sectionHeading}>
            Delivery Address
          </Heading>
          <Text style={address}>
            {shippingAddress.address}<br />
            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
          </Text>

          {/* Track Order Button */}
          <Section style={buttonSection}>
            <Link
              style={button}
              href={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/orders/${orderNumber}`}
            >
              Track Your Order
            </Link>
          </Section>

          {/* Footer */}
          <Hr style={hr} />
          <Text style={footer}>
            Questions? Contact us anytime.<br />
            Thank you for choosing Bagsberry! 💖
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#fdf2f8',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
  backgroundColor: '#ffffff',
};

const logo = {
  fontFamily: '"Great Vibes", cursive',
  fontSize: '42px',
  color: '#ec4899',
  textAlign: 'center' as const,
  margin: '0 0 30px',
};

const statusHeader = {
  borderRadius: '12px',
  padding: '24px',
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const statusHeading = {
  color: '#ffffff',
  fontSize: '24px',
  margin: '0 0 8px',
};

const statusMessage = {
  color: '#ffffff',
  fontSize: '16px',
  margin: 0,
};

const text = {
  fontSize: '16px',
  color: '#374151',
  lineHeight: '24px',
  margin: '16px 0',
};

const orderInfoBox = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '24px',
};

const orderNumber = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#ec4899',
  margin: '0 0 8px',
};

const trackingText = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '4px 0',
};

const sectionHeading = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#111827',
  margin: '24px 0 16px',
};

const itemRow = {
  borderBottom: '1px solid #e5e7eb',
  padding: '12px 0',
};

const itemName = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#111827',
  margin: '0 0 4px',
};

const itemDetails = {
  fontSize: '14px',
  color: '#6b7280',
  margin: 0,
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '24px 0',
};

const totalSection = {
  textAlign: 'right' as const,
  marginTop: '16px',
};

const totalText = {
  fontSize: '18px',
  color: '#111827',
  margin: 0,
};

const address = {
  fontSize: '14px',
  color: '#6b7280',
  lineHeight: '20px',
  margin: 0,
};

const buttonSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#ec4899',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '12px 32px',
  borderRadius: '8px',
  display: 'inline-block',
};

const footer = {
  fontSize: '14px',
  color: '#9ca3af',
  textAlign: 'center' as const,
  lineHeight: '20px',
  marginTop: '32px',
};

export default OrderEmail;
