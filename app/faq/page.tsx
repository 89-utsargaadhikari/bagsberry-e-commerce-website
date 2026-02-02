import { Header } from '@/components/header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function FAQPage() {
  const faqs = [
    {
      question: 'What is your shipping policy?',
      answer: 'We offer free shipping on all orders over $100. Standard shipping takes 3-5 business days, and express shipping is available for an additional fee.',
    },
    {
      question: 'What is your return policy?',
      answer: 'We accept returns within 30 days of purchase. Items must be in original condition with tags attached. Refunds are processed within 5-7 business days.',
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes! We ship to most countries worldwide. International shipping costs and delivery times vary by location.',
    },
    {
      question: 'Are your bags authentic?',
      answer: 'Absolutely. All our bags are 100% authentic and come with a certificate of authenticity. We guarantee the quality of every product.',
    },
    {
      question: 'How do I care for my bag?',
      answer: 'Each bag comes with specific care instructions. Generally, we recommend storing bags in dust bags, avoiding excessive moisture, and using appropriate leather care products.',
    },
    {
      question: 'Do you offer gift wrapping?',
      answer: 'Yes! We offer complimentary gift wrapping for all orders. You can select this option at checkout.',
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <section className="border-b py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl mb-6">
              Frequently Asked Questions
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-foreground/70">
              Find answers to common questions about Bagsberry
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/70">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
    </>
  );
}
