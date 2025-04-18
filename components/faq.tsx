import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQ() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-[800px]">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Frequently Asked Questions</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Find answers to common questions about DragNDoc and our pricing plans.
              </p>
            </div>
          </div>

          <div className="mt-12 space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Can I switch plans later?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the
                  prorated amount for the remainder of your billing cycle. When downgrading, the new price will take
                  effect at the start of your next billing cycle.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                <AccordionContent>
                  We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. For Enterprise
                  plans, we also offer invoicing and wire transfers.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Is there a free trial?</AccordionTrigger>
                <AccordionContent>
                  Yes, all paid plans include a 14-day free trial. No credit card is required to start your trial. You
                  can upgrade to a paid plan at any time during or after your trial.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Can I use my own domain?</AccordionTrigger>
                <AccordionContent>
                  Custom domains are available on the Pro and Enterprise plans. You can use your own domain or subdomain
                  for your API documentation.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>How do I cancel my subscription?</AccordionTrigger>
                <AccordionContent>
                  You can cancel your subscription at any time from your account settings. When you cancel, you'll
                  continue to have access to your paid features until the end of your current billing cycle.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>Do you offer discounts for non-profits or educational institutions?</AccordionTrigger>
                <AccordionContent>
                  Yes, we offer special pricing for non-profit organizations, educational institutions, and open-source
                  projects. Please contact our sales team for more information.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
