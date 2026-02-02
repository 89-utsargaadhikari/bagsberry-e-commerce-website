import { Header } from '@/components/header';
import { Card } from '@/components/ui/card';

export default function CookiesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <section className="border-b py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl mb-6">
              Cookie Policy
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-foreground/70">
              Learn about how we use cookies on our website
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Card className="p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">What Are Cookies?</h2>
                <p className="text-foreground/70">
                  Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Types of Cookies We Use</h2>
                <div className="space-y-4 text-foreground/70">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Essential Cookies</h3>
                    <p>Required for the website to function properly. These include cookies for shopping cart functionality and secure areas.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Analytics Cookies</h3>
                    <p>Help us understand how visitors interact with our website, allowing us to improve user experience.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Marketing Cookies</h3>
                    <p>Used to deliver personalized advertisements and measure the effectiveness of our marketing campaigns.</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Managing Cookies</h2>
                <p className="text-foreground/70">
                  Most web browsers allow you to control cookies through their settings. However, limiting cookies may impact your experience on our website. You can typically find cookie management options in your browser's privacy settings.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Questions?</h2>
                <p className="text-foreground/70">
                  If you have questions about our use of cookies, please contact us at privacy@bagsberry.com
                </p>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}
