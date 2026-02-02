import { Header } from '@/components/header';
import { Card } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <section className="border-b py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl mb-6">
              Privacy Policy
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-foreground/70">
              Last updated: January 19, 2026
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Card className="p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Information We Collect</h2>
                <p className="text-foreground/70">
                  We collect information you provide directly to us, such as when you create an account, make a purchase, or contact customer service. This may include your name, email address, shipping address, payment information, and phone number.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-2 text-foreground/70">
                  <li>Process and fulfill your orders</li>
                  <li>Send you order confirmations and updates</li>
                  <li>Respond to your questions and provide customer service</li>
                  <li>Send you marketing communications (with your consent)</li>
                  <li>Improve our website and services</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Data Security</h2>
                <p className="text-foreground/70">
                  We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Your Rights</h2>
                <p className="text-foreground/70">
                  You have the right to access, update, or delete your personal information. You can also opt out of marketing communications at any time. Contact us at privacy@bagsberry.com for any privacy-related requests.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
                <p className="text-foreground/70">
                  If you have questions about this Privacy Policy, please contact us at:
                  <br />
                  Email: privacy@bagsberry.com
                  <br />
                  Phone: +1 (555) 123-4567
                </p>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}
