import { Header } from '@/components/header';
import { Card } from '@/components/ui/card';

export default function PressPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <section className="border-b py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl mb-6">
              Press & Media
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-foreground/70">
              For press inquiries, please contact us at press@bagsberry.com
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Press Kit
            </h2>
            <Card className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Brand Assets</h3>
                  <p className="text-foreground/70 mb-4">
                    Download our official logos, brand guidelines, and product images.
                  </p>
                  <button className="text-primary hover:underline">Download Press Kit →</button>
                </div>
                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Contact Information</h3>
                  <div className="space-y-2 text-foreground/70">
                    <p>📧 Email: press@bagsberry.com</p>
                    <p>📱 Phone: +1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}
