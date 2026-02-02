import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { render } from '@react-email/components';
import React from 'react';
import { OrderConfirmation } from '@/emails/order-confirmation';
import { OrderEmail } from '@/emails/order-email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, to, data } = body;

    // Validate API key
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not set in environment variables');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    let subject = '';
    let emailHtml = '';

    // Choose template based on type
    switch (type) {
      case 'order-placed':
        subject = `Order Placed #${data.orderNumber} - Bagsberry`;
        emailHtml = render(
          React.createElement(OrderConfirmation, {
            customerName: data.customerName,
            orderNumber: data.orderNumber,
            items: data.items,
            total: data.total,
            shippingAddress: data.shippingAddress,
          })
        );
        break;

      case 'order-confirmed':
        subject = `Order Confirmed #${data.orderNumber} - Bagsberry`;
        emailHtml = render(
          React.createElement(OrderEmail, {
            customerName: data.customerName,
            orderNumber: data.orderNumber,
            status: 'confirmed' as const,
            items: data.items,
            total: data.total,
            shippingAddress: data.shippingAddress,
          })
        );
        break;

      case 'order-processing':
        subject = `Order Processing #${data.orderNumber} - Bagsberry`;
        emailHtml = render(
          React.createElement(OrderEmail, {
            customerName: data.customerName,
            orderNumber: data.orderNumber,
            status: 'processing' as const,
            items: data.items,
            total: data.total,
            shippingAddress: data.shippingAddress,
          })
        );
        break;

      case 'order-shipped':
        subject = `Order Shipped #${data.orderNumber} - Bagsberry`;
        emailHtml = render(
          React.createElement(OrderEmail, {
            customerName: data.customerName,
            orderNumber: data.orderNumber,
            status: 'shipped' as const,
            items: data.items,
            total: data.total,
            shippingAddress: data.shippingAddress,
            trackingNumber: data.trackingNumber,
            estimatedDelivery: data.estimatedDelivery,
          })
        );
        break;

      case 'order-delivered':
        subject = `Order Delivered #${data.orderNumber} - Bagsberry`;
        emailHtml = render(
          React.createElement(OrderEmail, {
            customerName: data.customerName,
            orderNumber: data.orderNumber,
            status: 'delivered' as const,
            items: data.items,
            total: data.total,
            shippingAddress: data.shippingAddress,
          })
        );
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }

    // Send email via Resend
    const result = await resend.emails.send({
      from: 'Bagsberry <orders@resend.dev>', // Change to your verified domain later
      to: [to],
      subject: subject,
      html: emailHtml,
    });

    console.log('✅ Email sent successfully:', result);

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('❌ Email error:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error.message },
      { status: 500 }
    );
  }
}
