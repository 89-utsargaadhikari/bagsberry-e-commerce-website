import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function CareersPage() {
  const positions = [
    {
      title: 'Senior Product Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
    },
    {
      title: 'E-commerce Manager',
      department: 'Operations',
      location: 'New York, NY',
      type: 'Full-time',
    },
    {
      title: 'Customer Success Specialist',
      department: 'Support',
      location: 'Remote',
      type: 'Full-time',
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <section className="border-b py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl mb-6">
              Join Our Team
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-foreground/70">
              Help us build the future of luxury fashion e-commerce. We're looking for talented individuals who share our passion for excellence.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Open Positions
            </h2>
            <div className="grid gap-6">
              {positions.map((position) => (
                <Card key={position.title} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {position.title}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm text-foreground/70">
                        <span>📁 {position.department}</span>
                        <span>📍 {position.location}</span>
                        <span>⏰ {position.type}</span>
                      </div>
                    </div>
                    <Button>Apply Now</Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-secondary/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Why Bagsberry?
            </h2>
            <div className="grid gap-8 sm:grid-cols-3 mt-12">
              <div>
                <div className="text-4xl mb-4">💼</div>
                <h3 className="font-semibold text-foreground mb-2">Competitive Benefits</h3>
                <p className="text-foreground/70">Health, dental, vision, and 401(k) matching</p>
              </div>
              <div>
                <div className="text-4xl mb-4">🌴</div>
                <h3 className="font-semibold text-foreground mb-2">Flexible PTO</h3>
                <p className="text-foreground/70">Unlimited vacation policy</p>
              </div>
              <div>
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="font-semibold text-foreground mb-2">Growth Opportunities</h3>
                <p className="text-foreground/70">Professional development and learning budget</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
