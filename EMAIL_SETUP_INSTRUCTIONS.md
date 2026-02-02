# 📧 Email Notifications Setup

## ✅ What's Been Implemented

Email notifications are now fully coded and ready to go! Here's what happens:

### When Customer Places Order:
✉️ **"Order Placed Successfully"** email sent immediately

### When Admin Updates Status:
- `confirmed` → ✉️ **"Order Confirmed"** email
- `processing` → ✉️ **"Order Processing"** email  
- `shipped` → ✉️ **"Order Shipped"** email (with tracking)
- `delivered` → ✉️ **"Order Delivered"** email

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Sign Up for Resend (Free)

1. Go to [resend.com](https://resend.com)
2. Sign up with your email
3. Verify your email address

### Step 2: Get Your API Key

1. Go to **API Keys** in Resend dashboard
2. Click **Create API Key**
3. Give it a name like "Bagsberry Production"
4. Copy the API key (starts with `re_...`)

### Step 3: Add API Key to Your Project

Open `.env.local` in your project and add:

```env
RESEND_API_KEY=re_your_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**For production, change to your actual domain:**
```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Step 4: Restart Your Dev Server

```bash
# Stop current server (Ctrl + C)
npm run dev
```

### Step 5: Test It!

1. Place a test order on your website
2. Check your email inbox
3. You should receive an "Order Placed" email!

---

## 📝 Important Notes

### Default Sender Email

Currently using: `orders@resend.dev`

**For production:** You should verify your own domain in Resend and update:

In `app/api/send-email/route.ts`, change line 108:
```typescript
from: 'Bagsberry <orders@yourdomain.com>',
```

### Free Tier Limits

- ✅ **3,000 emails/month** (free forever)
- ✅ Enough for ~100 orders/month
- ✅ Perfect for starting out

### Verify Your Domain (Optional, for Production)

1. In Resend dashboard → **Domains**
2. Add your domain (e.g., `bagsberry.com`)
3. Add DNS records they provide
4. Verify domain
5. Update `from` email in code

---

## 🧪 Testing Checklist

Test these scenarios:

- [ ] Place order → Check "Order Placed" email
- [ ] Admin: Change status to "Confirmed" → Check email
- [ ] Admin: Change status to "Processing" → Check email
- [ ] Admin: Add tracking + Change to "Shipped" → Check email with tracking
- [ ] Admin: Change status to "Delivered" → Check email

---

## 🎨 Email Templates

Beautiful React-based templates with:
- ✅ Pink Bagsberry branding
- ✅ Order summary with items
- ✅ Delivery address
- ✅ Tracking info (for shipped emails)
- ✅ "Track Your Order" button
- ✅ Mobile responsive

Templates location:
- `emails/order-confirmation.tsx` - Initial order placed
- `emails/order-email.tsx` - Status updates

---

## 🐛 Troubleshooting

### Emails Not Sending?

**Check:**
1. ✅ API key added to `.env.local`
2. ✅ Dev server restarted after adding key
3. ✅ Check browser console for errors
4. ✅ Check terminal for email logs
5. ✅ Check spam folder

### Console Logs

Look for these in your terminal:
- ✅ `✅ Email sent successfully`
- ❌ `❌ Email error`
- ❌ `RESEND_API_KEY not set`

---

## 💰 Costs (After Free Tier)

If you exceed 3,000 emails/month:

| Plan | Emails/Month | Cost |
|------|-------------|------|
| Free | 3,000 | $0 |
| Pro | 50,000 | $20/month |
| Business | 100,000 | $80/month |

**For 100 orders/month:** ~500 emails = Still free!

---

## 🔐 Security

- ✅ API key stored in `.env.local` (not in code)
- ✅ `.env.local` is gitignored (not pushed to GitHub)
- ✅ Email sending is non-blocking (won't slow down orders)
- ✅ Errors are caught and logged (won't break checkout)

---

## ✨ You're Done!

Just add your Resend API key and restart the server. Emails will start sending automatically! 📧💖
