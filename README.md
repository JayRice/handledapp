# Handled - Missed Call to SMS Conversion Platform

**Turn missed calls into booked jobs automatically.**

Handled is a production-ready SaaS platform that helps service businesses (HVAC, plumbing, electrical) convert missed calls into SMS conversations. When a customer calls and you miss it, Handled automatically texts them within 60 seconds, asks what they need, and follows up intelligently until they respond or you close the conversation.

## 🎯 Product Overview

### Core Value Proposition
- **Problem**: Service businesses lose revenue every time they miss a call
- **Solution**: Handled automatically texts missed callers, asks what they need, and follows up 3 times
- **Positioning**: Add-on safety net (NOT a CRM replacement)

### Key Features (MVP)
- ✅ Dedicated phone number per organization (via Twilio)
- ✅ Carrier-level call forwarding (works even if app/AI is down)
- ✅ Missed call detection and automatic SMS response
- ✅ 3-step follow-up sequence (immediate, +2 hours, next morning)
- ✅ Simple inbox for manual replies
- ✅ AI-powered intent classification and emergency detection
- ✅ Fallback templates (AI never required)
- ✅ Usage limits (300 SMS, 500 voice minutes/month)
- ✅ Stripe subscriptions ($78/month, 14-day trial)
- ✅ Row Level Security (RLS) for all data

### Reliability Principles
- **AI is optional**: If OpenAI fails, fallback templates are used immediately
- **Call forwarding is independent**: Carrier-level forwarding continues even if the app is down
- **No silent failures**: Owners are notified of SMS send failures and webhook issues
- **Graceful degradation**: If usage limits are hit, call forwarding continues, manual messaging works, but automation pauses

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 13 (App Router), React, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Next.js API Routes, Server Actions
- **Database**: Supabase (PostgreSQL with RLS)
- **Auth**: Supabase Auth (email/password)
- **Telephony**: Twilio (voice + SMS)
- **AI**: OpenAI GPT-4o-mini (with mandatory fallbacks)
- **Billing**: Stripe (subscriptions, customer portal)
- **Email**: Resend (notifications, support)
- **Hosting**: Vercel (recommended)

### Database Schema

**Core Tables:**
- `organizations` - Business accounts
- `profiles` - User accounts (linked to auth.users)
- `phone_numbers` - Twilio numbers assigned to orgs
- `calls` - Call log (answered/missed/duration)
- `conversations` - SMS threads with callers
- `messages` - Individual SMS messages
- `automations` - Per-org automation settings
- `outbox_jobs` - Scheduled job queue for follow-ups
- `events` - Webhook idempotency log
- `billing` - Stripe subscription status
- `usage_tracking` - Monthly SMS/voice usage
- `support_tickets` - Customer support requests

**RLS (Row Level Security):**
- All tables have RLS enabled
- Users can only access data from their own organization
- Policies enforce organization_id checks
- Server-side service role bypasses RLS for webhooks

### Call Flow

1. Customer calls Handled number
2. Twilio forwards call to business's real phone (carrier-level)
3. Call status callback determines if missed (no-answer or duration < 5s)
4. If missed:
   - Check automation enabled
   - Check caller_number is available (if blocked, log only, notify owner)
   - Wait 60 seconds
   - Generate message (AI or fallback template)
   - Send SMS via Twilio
   - Create conversation record
   - Enqueue follow-up jobs (if enabled)
5. On caller reply:
   - Cancel pending follow-ups
   - Classify intent with AI (optional)
   - Detect emergencies and alert owner
   - Owner replies manually from inbox

### Follow-Up Sequence

**Step 1: Immediate (60s after missed call)**
- "Sorry we missed your call — what can we help with? (repair/estimate/maintenance) and what's your ZIP?"

**Step 2: +2 hours (if no reply, within business hours)**
- "Just checking in — still need help? Reply with your ZIP and what's going on."

**Step 3: Next business morning (final check-in)**
- "Last check-in — if you still need help, reply here and we'll get you scheduled."

**Stop Conditions:**
- Caller replies
- Owner replies
- Conversation marked booked/lost/spam/opted_out
- Caller sends STOP keyword

### Opt-Out Handling

Keywords detected: `STOP`, `UNSUBSCRIBE`, `CANCEL`, `END` (case-insensitive)

On opt-out:
- Set conversation status to `opted_out`
- Cancel all pending outbox_jobs
- Send confirmation: "You've been unsubscribed. No further messages will be sent."
- Block all future outbound messages to that number

### A2P 10DLC Compliance

**Required:** Twilio requires A2P 10DLC registration for SMS in the US.

**Setup Steps:**
1. Register Brand in Twilio Console
2. Register Campaign (transactional messaging)
3. Note: SMS may be filtered if not registered

**In-App Handling:**
- Dashboard banner if messaging not approved
- Explain that call forwarding still works
- Link to Twilio console for registration

## 🚀 Setup & Deployment

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- Twilio account with:
  - Account SID and Auth Token
  - Phone number purchasing enabled
- OpenAI API key
- Stripe account with:
  - Product and Price created ($78/month with 14-day trial)
  - Webhook endpoint configured
- Resend API key (or SMTP credentials)
- Vercel account (for deployment)

### Local Development

1. **Clone and install dependencies:**

```bash
git clone <your-repo>
cd handled
npm install
```

2. **Set up Supabase:**

- Create a new Supabase project
- The database schema has already been applied via migration
- Get your Project URL and anon key from Settings → API
- Get your service_role key (keep this secret!)

3. **Configure environment variables:**

Copy `.env.example` to `.env` and fill in all values:

```bash
cp .env.example .env
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Secret service role key
- `TWILIO_ACCOUNT_SID` - From Twilio console
- `TWILIO_AUTH_TOKEN` - From Twilio console
- `OPENAI_API_KEY` - From OpenAI dashboard
- `STRIPE_SECRET_KEY` - From Stripe dashboard
- `STRIPE_WEBHOOK_SECRET` - From Stripe webhook endpoint
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Public Stripe key
- `RESEND_API_KEY` - From Resend dashboard
- `SUPPORT_EMAIL` - support@handledapp.io
- `NEXT_PUBLIC_APP_URL` - http://localhost:3000 (local) or production URL
- `CRON_SECRET` - Random secret for cron job auth

4. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Twilio Setup

1. **Purchase your first test number:**

```bash
# In Twilio Console:
# Phone Numbers → Buy a Number → Choose a local number
```

2. **Configure webhooks for the test number:**

- Voice URL: `https://your-domain.com/api/webhooks/twilio/voice` (POST)
- Voice Status Callback: `https://your-domain.com/api/webhooks/twilio/status` (POST)
- SMS URL: `https://your-domain.com/api/webhooks/twilio/sms` (POST)
- SMS Status Callback: `https://your-domain.com/api/webhooks/twilio/status` (POST)

3. **Configure A2P 10DLC:**

- Go to Messaging → Regulatory Compliance
- Register your Brand
- Create a Campaign (select "Low Volume Transactional")
- This is required for SMS to work properly in production

### Stripe Setup

1. **Create Product and Price:**

```bash
# In Stripe Dashboard:
# Products → Add Product
# Name: Handled Subscription
# Price: $78 USD / month, recurring
# Add 14-day free trial
# Copy the Price ID (starts with price_)
```

2. **Set up webhook:**

```bash
# Stripe Dashboard → Developers → Webhooks → Add endpoint
# URL: https://your-domain.com/api/stripe/webhook
# Events to listen for:
# - customer.subscription.created
# - customer.subscription.updated
# - customer.subscription.deleted
# - invoice.payment_succeeded
# - invoice.payment_failed
```

3. **Get webhook signing secret:**

After creating the webhook, click to reveal the signing secret and add it to your `.env` as `STRIPE_WEBHOOK_SECRET`.

### Job Queue / Cron Setup

The follow-up system uses a simple job queue (`outbox_jobs` table) that needs to be processed every minute.

**Option 1: Vercel Cron (Recommended)**

Create `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/run-jobs",
    "schedule": "* * * * *"
  }]
}
```

**Option 2: External Cron Service**

Use cron-job.org or similar to hit:
```
POST https://your-domain.com/api/cron/run-jobs
Header: Authorization: Bearer YOUR_CRON_SECRET
```

### Deployment to Vercel

1. **Push code to GitHub**

2. **Import to Vercel:**

```bash
# Connect your GitHub repo in Vercel dashboard
# or use CLI:
vercel
```

3. **Add environment variables in Vercel:**

- Go to Project Settings → Environment Variables
- Add all variables from your `.env` file
- Make sure `NEXT_PUBLIC_APP_URL` is set to your production domain

4. **Deploy:**

```bash
git push origin main
# Vercel auto-deploys on push
```

5. **Update webhook URLs:**

After deployment, update all webhook URLs in Twilio and Stripe to use your production domain.

## 📁 Project Structure

```
handled/
├── app/
│   ├── (auth)/           # Auth pages (login, signup)
│   ├── (onboarding)/     # Onboarding flow
│   ├── (app)/            # Main app (inbox, settings, etc.)
│   ├── api/              # API routes
│   │   ├── webhooks/     # Twilio, Stripe webhooks
│   │   ├── telephony/    # Phone provisioning
│   │   ├── messages/     # Send message
│   │   └── cron/         # Job processor
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # App shell, sidebar, nav
│   ├── inbox/            # Conversation list, thread view
│   └── marketing/        # Landing page components
├── lib/
│   ├── supabase/         # Supabase clients (browser, server)
│   ├── telephony/        # Twilio integration
│   ├── ai/               # OpenAI + fallback templates
│   ├── billing/          # Stripe integration
│   ├── email/            # Resend integration
│   ├── utils/            # Phone, time, logger utilities
│   ├── validators/       # Zod schemas
│   └── types/            # TypeScript types
├── middleware.ts         # Auth + route protection
├── .env.example          # Environment template
└── README.md            # This file
```

## 🔧 Key Implementation Notes

### Webhook Signature Verification

**Twilio:**
```typescript
import { verifyWebhookSignature } from '@/lib/telephony/twilio'

const signature = request.headers.get('X-Twilio-Signature')
const url = request.url
const params = Object.fromEntries(new URL(request.url).searchParams)

if (!verifyWebhookSignature(signature, url, params)) {
  return new Response('Invalid signature', { status: 403 })
}
```

**Stripe:**
```typescript
import { constructWebhookEvent } from '@/lib/billing/stripe'

const signature = request.headers.get('stripe-signature')
const body = await request.text()

const event = constructWebhookEvent(body, signature)
```

### Idempotency

All webhook handlers check the `events` table:

```typescript
const { data: existing } = await supabase
  .from('events')
  .select('id')
  .eq('provider_event_id', twilioEventId)
  .maybeSingle()

if (existing) {
  return new Response('Already processed', { status: 200 })
}

await supabase.from('events').insert({
  provider_event_id: twilioEventId,
  event_type: 'twilio.call.status',
  payload: requestBody,
})
```

### AI Fallback Pattern

```typescript
import { generateMessage } from '@/lib/ai/openai'
import { getFallbackTemplate } from '@/lib/ai/templates'

try {
  const message = await generateMessage(options)
  // Use AI-generated message
} catch (error) {
  const message = getFallbackTemplate('initial', 'professional', businessName)
  // Use fallback template immediately
}
```

## 🔒 Security Checklist

- ✅ RLS enabled on all Supabase tables
- ✅ Webhook signature verification (Twilio, Stripe)
- ✅ Environment secrets never exposed to client
- ✅ Zod validation on all API inputs
- ✅ Rate limiting on webhook endpoints
- ✅ STOP keyword opt-out handling
- ✅ No SQL injection (parameterized queries via Supabase)
- ✅ No XSS (React escapes by default)
- ✅ CSRF protection via SameSite cookies

## 🐛 Troubleshooting

### "No available numbers in area code XXX"

Twilio may not have numbers available in that area code. Try a different area code or check Twilio's available numbers in the console.

### "Failed to verify Twilio webhook signature"

1. Check that `TWILIO_AUTH_TOKEN` is correct
2. Ensure the webhook URL in Twilio console matches exactly (including https://)
3. Verify the request URL includes all query parameters

### "SMS not sending"

1. Check Twilio account balance
2. Verify A2P 10DLC registration is complete
3. Check usage limits (300 SMS/month in MVP)
4. Look for errors in Supabase `events` table

### "Stripe webhook not processing"

1. Verify `STRIPE_WEBHOOK_SECRET` matches the webhook endpoint secret
2. Check Stripe Dashboard → Developers → Webhooks for failed attempts
3. Ensure webhook URL is correct and publicly accessible

## 📊 Usage Limits & Enforcement

**Included per organization:**
- 300 SMS messages/month
- 500 voice minutes/month

**Enforcement:**
- At 80% usage: Warning banner in dashboard
- At 100% usage:
  - Call forwarding continues ✅
  - Manual messaging continues ✅
  - Automated follow-ups pause ❌
  - Banner explains limit and reset date

**Tracking:**
- `usage_tracking` table stores monthly usage
- Reset on first of each month
- Query current usage: `get_current_month_usage(org_id)`

## 📝 Future Enhancements (Post-MVP)

- Calendar booking integrations (Calendly, Cal.com)
- CRM/FSM integrations (ServiceTitan, Housecall Pro)
- AI voice agent for answering live calls
- Multi-user support (team members)
- Custom business hours per day
- SMS templates editor
- Call recording (requires legal compliance)
- Advanced analytics dashboard
- White-label option

## 🤝 Support

For issues or questions:
- Email: support@handledapp.io
- In-app support form (copies org ID and phone number automatically)

## 📄 License

Proprietary - All rights reserved

---

Built with ❤️ for service businesses who refuse to lose revenue to missed calls.
