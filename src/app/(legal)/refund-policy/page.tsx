import LegalLayout from '@/components/LegalLayout';

const sections = [
  { id: 'digital-nature', title: 'Digital Products Policy' },
  { id: 'no-refund', title: 'No-Refund Rule' },
  { id: 'eligible-refunds', title: 'Eligible Refund Cases' },
  { id: 'process', title: 'Refund Process' },
  { id: 'timeline', title: 'Refund Timeline' },
  { id: 'chargebacks', title: 'Chargebacks Policy' },
  { id: 'cancellations', title: 'Order Cancellations' },
  { id: 'contact', title: 'Contact for Disputes' },
];

export const metadata = {
  title: 'Refund & Cancellation Policy — Creato4 Lab',
  description: 'Refund and cancellation policy for digital engineering products purchased from Creato4 Lab. Compliant with Consumer Protection Act 2019.',
};

export default function RefundPolicyPage() {
  return (
    <LegalLayout
      title="Refund & Cancellation Policy"
      subtitle="This policy governs refunds and cancellations for digital products purchased on Creato4 Lab, in accordance with the Consumer Protection Act, 2019 and RBI payment guidelines."
      lastUpdated="July 26, 2026"
      effectiveDate="July 26, 2026"
      sections={sections}
    >
      <div className="space-y-12">

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-900">
          <p className="font-bold mb-2">⚠ Important — Please Read Before Purchase</p>
          <p className="leading-relaxed">
            All products sold on Creato4 Lab are <strong>digital goods</strong> (source code, CAD files, schematics, firmware, documentation, and courses). Due to their instant-delivery and intangible nature, our refund policy is governed by the specific provisions of the <strong>Consumer Protection Act, 2019</strong> that apply to digital products.
          </p>
        </div>

        <section id="digital-nature">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">1. Digital Products Policy</h2>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed mb-4">
            Unlike physical goods, digital products are delivered immediately upon payment confirmation. Once a digital file has been accessed, downloaded, or the download link opened, it cannot be &quot;returned&quot; — the information has been transferred.
          </p>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed">
            Our policy reflects this reality while still protecting consumers against genuine defects or errors on our part. We comply with the <strong>Consumer Protection Act, 2019</strong> and the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>.
          </p>
        </section>

        <section id="no-refund">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">2. General No-Refund Rule</h2>
          <div className="bg-[#1A3C2F] text-[#FAF8F5] rounded-2xl p-6">
            <p className="text-sm leading-relaxed">
              <strong>All sales of digital products are final.</strong> No refund will be issued once a download link has been generated or the product has been accessed in your dashboard, except in the specific circumstances listed in Section 3.
            </p>
          </div>
          <div className="mt-4 space-y-2 text-sm text-[#1A3C2F]/70">
            <p className="flex gap-3"><span className="text-red-500">✗</span> Refunds are NOT provided for &quot;change of mind&quot; purchases</p>
            <p className="flex gap-3"><span className="text-red-500">✗</span> Refunds are NOT provided if you purchased the wrong license tier (contact us to discuss an upgrade)</p>
            <p className="flex gap-3"><span className="text-red-500">✗</span> Refunds are NOT provided if you lack the technical skills to use the product</p>
            <p className="flex gap-3"><span className="text-red-500">✗</span> Refunds are NOT provided after 7 days from the date of purchase, under any circumstances</p>
          </div>
        </section>

        <section id="eligible-refunds">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">3. Cases Eligible for Refund</h2>
          <p className="text-sm text-[#1A3C2F]/75 mb-5">
            We will issue a full refund in the following circumstances, provided the request is made within <strong>7 days of purchase</strong> and the download has NOT been initiated:
          </p>
          <div className="space-y-4">
            {[
              {
                case: 'Broken Download Link',
                desc: 'The download link provided is broken, expired (before the stated validity), or returns an error, and we cannot resolve it within 48 hours of your report.',
              },
              {
                case: 'Materially Incorrect Product',
                desc: 'The delivered product is materially different from what was described on the product page (e.g., a completely different schematic was delivered instead of the one shown).',
              },
              {
                case: 'Duplicate Payment',
                desc: 'You were charged twice for the same order due to a payment gateway error.',
              },
              {
                case: 'Payment Failure + Deduction',
                desc: 'Your payment was deducted but the order was not placed (common with UPI), and the amount has not been automatically refunded within 5 business days.',
              },
            ].map(({ case: c, desc }) => (
              <div key={c} className="flex gap-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                <span className="text-green-600 font-bold shrink-0">✓</span>
                <div>
                  <p className="text-sm font-semibold text-[#1A3C2F] mb-1">{c}</p>
                  <p className="text-xs text-[#1A3C2F]/65 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="process">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">4. Refund Request Process</h2>
          <div className="space-y-3">
            {[
              { step: '1', title: 'Email us', desc: 'Send an email to creato4lab@gmail.com with subject: "Refund Request — [Order ID]"' },
              { step: '2', title: 'Provide details', desc: 'Include: Your registered email, Order ID, product name, reason for refund, and any screenshots or evidence.' },
              { step: '3', title: 'Wait for review', desc: 'Our team reviews the request within 2 business days. We may ask for additional information.' },
              { step: '4', title: 'Decision', desc: 'We will notify you of our decision via email. Approved refunds are initiated within 3 business days.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4 p-4 bg-[#1A3C2F]/[0.03] rounded-xl border border-[#1A3C2F]/8">
                <div className="shrink-0 w-7 h-7 rounded-full bg-[#1A3C2F] text-[#FAF8F5] flex items-center justify-center text-xs font-bold">{step}</div>
                <div>
                  <p className="text-sm font-semibold text-[#1A3C2F] mb-0.5">{title}</p>
                  <p className="text-xs text-[#1A3C2F]/65">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="timeline">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">5. Refund Timeline</h2>
          <p className="text-sm text-[#1A3C2F]/75 mb-4 leading-relaxed">
            Once a refund is approved and initiated by us, the time for the amount to appear in your account depends on your payment method:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#1A3C2F] text-[#FAF8F5] text-xs">
                  <th className="text-left p-3 rounded-tl-lg">Payment Method</th>
                  <th className="text-left p-3">Refund Timeline</th>
                  <th className="text-left p-3 rounded-tr-lg">Notes</th>
                </tr>
              </thead>
              <tbody className="text-xs text-[#1A3C2F]/70">
                {[
                  { method: 'UPI (GPay, PhonePe)', timeline: '1–3 business days', note: 'Directly to your UPI-linked bank' },
                  { method: 'Debit / Credit Card', timeline: '5–7 business days', note: 'Depends on issuing bank' },
                  { method: 'Net Banking', timeline: '3–5 business days', note: 'Directly to your bank account' },
                  { method: 'Razorpay Wallet', timeline: '1 business day', note: 'Directly to your Razorpay wallet' },
                  { method: 'EMI', timeline: '7–10 business days', note: 'EMI cancellation processed by bank' },
                ].map((row, i) => (
                  <tr key={row.method} className={i % 2 === 0 ? 'bg-[#1A3C2F]/[0.02]' : ''}>
                    <td className="p-3 font-medium text-[#1A3C2F]">{row.method}</td>
                    <td className="p-3">{row.timeline}</td>
                    <td className="p-3 text-[#1A3C2F]/50">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="chargebacks">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">6. Chargebacks Policy</h2>
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-sm text-red-800 space-y-3">
            <p className="font-bold">Filing a fraudulent chargeback for a legitimately delivered product is a serious violation of our Terms and constitutes fraud under Indian law.</p>
            <p>If you file a chargeback without first contacting us and allowing us to resolve the issue:</p>
            <ul className="space-y-1.5 ml-4">
              <li>• Your account will be permanently banned without refund</li>
              <li>• All your licenses will be immediately revoked</li>
              <li>• We will provide Razorpay with evidence of delivery to contest the chargeback</li>
              <li>• We reserve the right to pursue legal action for the recovery of the chargeback fee</li>
            </ul>
            <p>If you have a genuine dispute, please email us at <a href="mailto:creato4lab@gmail.com" className="underline">creato4lab@gmail.com</a> and we will resolve it fairly.</p>
          </div>
        </section>

        <section id="cancellations">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">7. Order Cancellations</h2>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed mb-3">
            Since digital products are delivered instantly upon payment confirmation, order cancellation is only possible in the following scenario:
          </p>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed p-4 bg-[#1A3C2F]/5 rounded-xl border border-[#1A3C2F]/8">
            <strong>Pre-download cancellation:</strong> If you contact us within <strong>30 minutes</strong> of purchase AND have not opened your dashboard or clicked any download link, we may cancel the order at our discretion.
          </p>
        </section>

        <section id="contact">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">8. Contact for Disputes</h2>
          <div className="p-5 border border-[#1A3C2F]/10 rounded-xl text-sm text-[#1A3C2F]/75 space-y-2">
            <p><strong>Email:</strong> <a href="mailto:creato4lab@gmail.com" className="text-[#C4A35A]">creato4lab@gmail.com</a></p>
            <p><strong>Subject line:</strong> &quot;Refund Request — [Your Order ID]&quot;</p>
            <p><strong>Response time:</strong> 2 business days</p>
            <p className="text-xs text-[#1A3C2F]/50 pt-2 border-t border-[#1A3C2F]/8">
              If you are not satisfied with our resolution, you may approach the National Consumer Helpline (NCH) at <strong>1800-11-4000</strong> or file a complaint on the <a href="https://consumerhelpline.gov.in" target="_blank" rel="noreferrer" className="text-[#C4A35A] hover:underline">consumerhelpline.gov.in</a> portal.
            </p>
          </div>
        </section>

      </div>
    </LegalLayout>
  );
}
