# Email Notifications Setup Guide

## Overview

Email notifications are essential for a professional e-commerce experience. This guide explains how to implement order confirmation emails for your Bagsberry Nepal store.

## Recommended Services for Nepal

### 1. Resend (Recommended)
- **Why**: Simple API, generous free tier, great for transactional emails
- **Free tier**: 3,000 emails/month
- **Nepal-friendly**: Works internationally
- **Setup time**: 15 minutes

### 2. SendGrid
- **Why**: Industry standard, robust features
- **Free tier**: 100 emails/day
- **Setup time**: 20 minutes

### 3. Mailgun
- **Why**: Developer-friendly, flexible
- **Free tier**: 5,000 emails/month (first 3 months)

## Implementation Steps

### Step 1: Choose Email Service (Using Resend)

1. Sign up at [resend.com](https://resend.com)
2. Verify your sending domain or use Resend's domain for testing
3. Get your API key

### Step 2: Install Dependencies

```bash
npm install resend
```

### Step 3: Add API Key to Environment

Add to `.env.local`:
```
RESEND_API_KEY=re_your_api_key_here
```

### Step 4: Create Email Template

Create `lib/email-templates/order-confirmation.tsx`:

```typescript
interface OrderConfirmationEmailProps {
  customerName: string;
  orderNumber: string;
  orderDate: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  shippingAddress: string;
  orderUrl: string;
}

export const OrderConfirmationEmail = ({
  customerName,
  orderNumber,
  orderDate,
  items,
  total,
  shippingAddress,
  orderUrl,
}: OrderConfirmationEmailProps) => {
  return (
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #ec4899;">Order Confirmation - Bagsberry</h1>
      
      <p>Dear {customerName},</p>
      
      <p>Thank you for your order! We're excited to prepare your items for delivery.</p>
      
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="margin-top: 0;">Order #{orderNumber}</h2>
        <p>Order Date: {orderDate}</p>
      </div>
      
      <h3>Order Items:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        {items.map((item, index) => (
          <tr key={index} style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 0;">{item.name}</td>
            <td style="text-align: center;">x{item.quantity}</td>
            <td style="text-align: right;">NPR {item.price.toFixed(2)}</td>
          </tr>
        ))}
        <tr>
          <td colspan="2" style="padding: 10px 0; font-weight: bold;">Total</td>
          <td style="text-align: right; font-weight: bold;">NPR {total.toFixed(2)}</td>
        </tr>
      </table>
      
      <div style="margin: 20px 0;">
        <h3>Delivery Address:</h3>
        <p style="white-space: pre-line;">{shippingAddress}</p>
      </div>
      
      <div style="margin: 30px 0;">
        <a href={orderUrl} style="background: #ec4899; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Track Your Order
        </a>
      </div>
      
      <p style="color: #6b7280; font-size: 14px; margin-top: 40px;">
        If you have any questions, please contact us at support@bagsberry.com
      </p>
      
      <p style="color: #6b7280; font-size: 14px;">
        Bagsberry Nepal<br/>
        Your trusted online bag store
      </p>
    </div>
  );
};
```

### Step 5: Create Email API Route

Create `app/api/send-email/route.ts`:

```typescript
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, html } = body;

    const data = await resend.emails.send({
      from: 'Bagsberry <orders@bagsberry.com>', // Use your verified domain
      to: [to],
      subject: subject,
      html: html,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
```

### Step 6: Update Order Creation to Send Email

In `app/api/orders/create/route.ts`, add after successful order creation:

```typescript
// After order is created successfully
try {
  const emailHtml = \`
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #ec4899;">Order Confirmation - Bagsberry</h1>
      <p>Dear \${shippingInfo.name},</p>
      <p>Thank you for your order!</p>
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="margin-top: 0;">Order #\${order.id.substring(0, 8).toUpperCase()}</h2>
        <p>Order Date: \${new Date().toLocaleDateString()}</p>
      </div>
      <h3>Order Items:</h3>
      \${items.map(item => \`
        <div style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
          <strong>\${item.name}</strong><br/>
          Quantity: \${item.quantity} | Price: NPR \${item.price.toFixed(2)}
        </div>
      \`).join('')}
      <div style="margin: 20px 0;">
        <p><strong>Total: NPR \${total.toFixed(2)}</strong></p>
      </div>
      <div style="margin: 20px 0;">
        <h3>Delivery Address:</h3>
        <p>\${shippingInfo.address}<br/>
        \${shippingInfo.city}, \${shippingInfo.state} \${shippingInfo.zip}</p>
      </div>
      <div style="margin: 30px 0;">
        <a href="\${process.env.NEXT_PUBLIC_SITE_URL}/orders/\${order.id}" style="background: #ec4899; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Track Your Order
        </a>
      </div>
      <p style="color: #6b7280; font-size: 14px; margin-top: 40px;">
        If you have any questions, please contact us.
      </p>
    </div>
  \`;

  // Send email (non-blocking)
  fetch(\`\${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: shippingInfo.email,
      subject: \`Order Confirmation #\${order.id.substring(0, 8).toUpperCase()} - Bagsberry\`,
      html: emailHtml,
    }),
  }).catch(err => console.error('Email send failed:', err));
} catch (emailError) {
  // Don't fail the order if email fails
  console.error('Email error:', emailError);
}
```

## Testing

1. Use a test email address
2. Place an order
3. Check your inbox for confirmation email
4. Verify all details are correct

## Production Checklist

- [ ] Verify sending domain in Resend
- [ ] Update `from` email address to match your domain
- [ ] Test with real orders
- [ ] Set up email templates for:
  - Order confirmation
  - Order shipped notification
  - Order delivered notification
  - Order cancelled notification
- [ ] Monitor email delivery rates
- [ ] Set up SPF and DKIM records for your domain

## Nepal-Specific Considerations

1. **Email Deliverability**: Gmail and Yahoo are most popular in Nepal
2. **Language**: Consider bilingual emails (English and Nepali)
3. **Customer Support**: Include WhatsApp contact for quick support
4. **Payment**: Mention Cash on Delivery clearly in email

## Cost Estimate

- **Resend**: Free for up to 3,000 emails/month
- **For 10,000 orders/month**: ~$20/month with Resend

## Alternative: Manual Email Notifications

If you want to start simple:

1. **Check orders in admin dashboard daily**
2. **Manually email customers** using Gmail
3. **Copy order details** from admin panel
4. **Send tracking number** when shipped

This works fine for low volume (< 50 orders/month) but automate as you grow.

## Support

For implementation help, see:
- [Resend Documentation](https://resend.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
