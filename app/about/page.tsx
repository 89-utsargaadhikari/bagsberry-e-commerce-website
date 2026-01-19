'use client';

import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Check, Heart, Sparkles, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 sm:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-8">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                  Crafting Luxury, One Bag at a Time
                </h1>
                <p className="text-lg text-foreground/70 leading-relaxed">
                  Bagsberry was founded on the belief that every woman deserves a bag that makes her feel confident, elegant, and ready to take on the world. Our mission is to create timeless pieces that blend craftsmanship with modern design.
                </p>
                <Button asChild data-sound="tap" size="lg">
                  <Link href="/products">Explore Collection</Link>
                </Button>
              </div>
              <div className="aspect-square overflow-hidden rounded-3xl shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80"
                  alt="Bagsberry Luxury Bags"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Story</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-foreground/70 leading-relaxed mb-6">
                Founded in 2020, Bagsberry emerged from a passion for creating accessories that don't just complement an outfit—they complete it. What started as a small atelier in New York has grown into a beloved brand for fashion-forward women worldwide.
              </p>
              <p className="text-foreground/70 leading-relaxed mb-6">
                Every Bagsberry bag is carefully crafted using premium materials sourced from ethical suppliers. Our artisans bring decades of experience, ensuring each stitch, clasp, and detail meets our exacting standards.
              </p>
              <p className="text-foreground/70 leading-relaxed">
                We believe in sustainability, quality over quantity, and designs that stand the test of time. When you choose Bagsberry, you're not just buying a bag—you're investing in a piece that will accompany you on life's most important journeys.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 sm:py-24 bg-secondary/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Values</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: <Sparkles className="h-8 w-8" />,
                  title: 'Quality',
                  description: 'Every bag is crafted with meticulous attention to detail and premium materials',
                },
                {
                  icon: <Heart className="h-8 w-8" />,
                  title: 'Sustainability',
                  description: 'Ethically sourced materials and eco-conscious production processes',
                },
                {
                  icon: <Award className="h-8 w-8" />,
                  title: 'Craftsmanship',
                  description: 'Handcrafted by skilled artisans with decades of experience',
                },
                {
                  icon: <Check className="h-8 w-8" />,
                  title: 'Timeless Design',
                  description: 'Classic styles that transcend trends and last a lifetime',
                },
              ].map((value) => (
                <Card key={value.title} className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                  <p className="text-foreground/70">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-br from-primary/20 to-primary/10 px-8 py-16 text-center shadow-2xl border-2 border-primary/20">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-6">
                Ready to Find Your Perfect Bag?
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-foreground/70 mb-8">
                Browse our collection of handcrafted luxury bags and find the one that speaks to you.
              </p>
              <Button asChild data-sound="tap" size="lg">
                <Link href="/products">Shop Now</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
