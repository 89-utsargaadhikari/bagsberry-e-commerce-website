import { Header } from '@/components/header';
import { Card } from '@/components/ui/card';

export default function ReturnsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <section className="border-b py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl mb-6">
              Returns & Exchanges
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-foreground/70">
              We want you to love your Bagsberry purchase. If you're not completely satisfied, we're here to help.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">30-Day Return Policy</h2>
                <div className="space-y-4 text-foreground/70">
                  <p>
                    You may return any unworn, unwashed, or defective item within 30 days of delivery for a full refund or exchange.
                  </p>
                  <h3 className="font-semibold text-foreground mt-6">Return Requirements:</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Items must be in original condition with all tags attached</li>
                    <li>Original packaging must be included</li>
                    <li>Proof of purchase required</li>
                    <li>Items must not show signs of wear or use</li>
                  </ul>
                </div>
              </Card>

              <Card className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">How to Return</h2>
                <div className="space-y-4 text-foreground/70">
                  <ol className="list-decimal pl-6 space-y-3">
                    <li>Contact our customer service team at returns@bagsberry.com</li>
                    <li>Receive your return authorization and shipping label</li>
                    <li>Pack your item securely in original packaging</li>
                    <li>Ship using the provided label</li>
                    <li>Receive refund within 5-7 business days after we receive your return</li>
                  </ol>
                </div>
              </Card>

              <Card className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Exchanges</h2>
                <p className="text-foreground/70">
                  Need a different size or color? We'll gladly exchange your item. Simply follow the return process and place a new order for your desired item.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
