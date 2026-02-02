import { Header } from '@/components/header';
import { Card } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <section className="border-b py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl mb-6">
              Terms of Service
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
                <h2 className="text-2xl font-bold text-foreground mb-4">Agreement to Terms</h2>
                <p className="text-foreground/70">
                  By accessing and using Bagsberry's website, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Use of Service</h2>
                <p className="text-foreground/70 mb-4">
                  You agree to use our service only for lawful purposes and in accordance with these Terms. You must not:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/70">
                  <li>Use the service in any way that violates any applicable law or regulation</li>
                  <li>Attempt to interfere with the proper functioning of the service</li>
                  <li>Impersonate or attempt to impersonate Bagsberry or any other person</li>
                  <li>Use any automated system to access the service</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Product Information</h2>
                <p className="text-foreground/70">
                  We strive to provide accurate product descriptions and pricing. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Limitation of Liability</h2>
                <p className="text-foreground/70">
                  Bagsberry shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Contact Information</h2>
                <p className="text-foreground/70">
                  Questions about the Terms of Service should be sent to us at legal@bagsberry.com
                </p>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}
