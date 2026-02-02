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

interface OrderConfirmationProps {
  customerName: string;
  orderNumber: string;
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
}

export const OrderConfirmation = ({
  customerName,
  orderNumber,
  items,
  total,
  shippingAddress,
}: OrderConfirmationProps) => {
  return (
    <Html>
      <Head />
      <Preview>Thank you for your order #{orderNumber}!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo/Header */}
          <Heading style={logo}>Bagsberry</Heading>
          
          {/* Success Header */}
          <Section style={successHeader}>
            <Heading style={successHeading}>Order Placed Successfully! 🎉</Heading>
            <Text style={successMessage}>
              Thank you for your order! We'll send you an update once it's confirmed.
            </Text>
          </Section>

          {/* Greeting */}
          <Text style={text}>Dear {customerName},</Text>
          <Text style={text}>
            We've received your order and will process it shortly. You'll receive a confirmation email once we verify your order.
          </Text>

          {/* Order Info */}
          <Section style={orderInfoBox}>
            <Text style={orderNumber}>Order #{orderNumber}</Text>
            <Text style={orderDate}>
              Order Date: {new Date().toLocaleDateString('en-NP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </Section>

          {/* Order Items */}
          <Heading as="h2" style={sectionHeading}>
            Order Summary
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

          {/* Payment Info */}
          <Section style={infoBox}>
            <Text style={infoText}>
              💳 <strong>Payment Method:</strong> Cash on Delivery<br />
              🚚 <strong>Delivery:</strong> Free delivery within Kathmandu Valley
            </Text>
          </Section>

          {/* Track Order Button */}
          <Section style={buttonSection}>
            <Link
              style={button}
              href={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/orders/${orderNumber}`}
            >
              View Order Details
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

const successHeader = {
  backgroundColor: '#22c55e',
  borderRadius: '12px',
  padding: '24px',
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const successHeading = {
  color: '#ffffff',
  fontSize: '24px',
  margin: '0 0 8px',
};

const successMessage = {
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

const orderDate = {
  fontSize: '14px',
  color: '#6b7280',
  margin: 0,
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

const infoBox = {
  backgroundColor: '#fef3c7',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
};

const infoText = {
  fontSize: '14px',
  color: '#78350f',
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

export default OrderConfirmation;
