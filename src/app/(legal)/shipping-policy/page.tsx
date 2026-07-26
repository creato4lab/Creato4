import LegalLayout from '@/components/LegalLayout';

const sections = [
  { id: 'digital-delivery', title: 'Digital Delivery' },
  { id: 'how-it-works', title: 'How Delivery Works' },
  { id: 'timeline', title: 'Delivery Timeline' },
  { id: 'access', title: 'Accessing Your Files' },
  { id: 'failures', title: 'Delivery Failures' },
  { id: 'no-physical', title: 'No Physical Shipping' },
  { id: 'download-limits', title: 'Download Limits' },
  { id: 'contact', title: 'Contact Support' },
];

export const metadata = {
  title: 'Shipping & Delivery Policy — Creato4 Lab',
  description: 'Shipping and delivery policy for digital engineering products from Creato4 Lab. All products are delivered digitally — no physical shipment.',
};

export default function ShippingPolicyPage() {
  return (
    <LegalLayout
      title="Shipping & Delivery Policy"
      subtitle="All products sold by Creato4 Lab are digital goods. There is no physical shipping. This policy explains how digital products are delivered to you."
      lastUpdated="July 26, 2026"
      effectiveDate="July 26, 2026"
      sections={sections}
    >
      <div className="space-y-12">

        <section id="digital-delivery">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">1. 100% Digital Delivery</h2>
          <div className="bg-[#1A3C2F] text-[#FAF8F5] rounded-2xl p-6">
            <p className="text-xs text-[#C4A35A] font-bold uppercase tracking-widest mb-3">No Physical Goods. No Courier. No Waiting.</p>
            <p className="text-sm leading-relaxed">
              Creato4 Lab is an exclusively digital marketplace. Every product — including Arduino source code, ESP32 firmware, PCB schematics, CAD models, 3D printable files, documentation, BOM files, and video courses — is delivered digitally and instantly to your secure account dashboard.
            </p>
          </div>
        </section>

        <section id="how-it-works">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">2. How Delivery Works</h2>
          <div className="space-y-3">
            {[
              { step: '1', title: 'Complete Your Purchase', desc: 'Choose a product, select your license tier (Student / Commercial / Enterprise), and complete payment via Razorpay.' },
              { step: '2', title: 'Payment Confirmation', desc: 'Upon successful payment, our system automatically generates a unique license key tied to your account.' },
              { step: '3', title: 'Instant Access', desc: 'You are immediately redirected to your dashboard where the product appears under "My Purchases" with a secure download link.' },
              { step: '4', title: 'Email Notification', desc: 'A confirmation email with your order ID and download instructions is sent to your registered email address.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4 p-4 bg-[#1A3C2F]/[0.03] rounded-xl border border-[#1A3C2F]/8">
                <div className="shrink-0 w-7 h-7 rounded-full bg-[#1A3C2F] text-[#FAF8F5] flex items-center justify-center text-xs font-bold">{step}</div>
                <div>
                  <p className="text-sm font-semibold text-[#1A3C2F] mb-0.5">{title}</p>
                  <p className="text-xs text-[#1A3C2F]/65 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="timeline">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">3. Delivery Timeline</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#1A3C2F] text-[#FAF8F5] text-xs">
                  <th className="text-left p-3 rounded-tl-lg">Payment Method</th>
                  <th className="text-left p-3">Delivery Time</th>
                  <th className="text-left p-3 rounded-tr-lg">Notes</th>
                </tr>
              </thead>
              <tbody className="text-xs text-[#1A3C2F]/70">
                {[
                  { method: 'UPI / GPay / PhonePe', time: 'Instant (0–2 minutes)', note: 'Fastest method' },
                  { method: 'Debit / Credit Card', time: '0–5 minutes', note: 'Depends on bank authorization' },
                  { method: 'Net Banking', time: '5–15 minutes', note: 'May take slightly longer' },
                  { method: 'Razorpay Wallet', time: 'Instant', note: 'Fastest method' },
                  { method: 'EMI', time: '5–15 minutes', note: 'After EMI approval from bank' },
                ].map((row, i) => (
                  <tr key={row.method} className={i % 2 === 0 ? 'bg-[#1A3C2F]/[0.02]' : ''}>
                    <td className="p-3 font-medium text-[#1A3C2F]">{row.method}</td>
                    <td className="p-3 text-green-700 font-semibold">{row.time}</td>
                    <td className="p-3 text-[#1A3C2F]/50">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="access">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">4. Accessing Your Files</h2>
          <div className="space-y-3 text-sm text-[#1A3C2F]/75">
            <p>All purchased products are accessible in your <strong>Creato4 Lab Dashboard</strong> at <strong>creato4lab.com/dashboard</strong> under the &quot;My Purchases&quot; section.</p>
            <p><strong className="text-[#1A3C2F]">Download Validity:</strong> Download links remain active for the duration of your license. Student licenses provide access for <strong>1 year</strong>. Commercial and Enterprise licenses provide access for <strong>3 years</strong> from the date of purchase.</p>
            <p><strong className="text-[#1A3C2F]">File Formats:</strong> Products are delivered in standard engineering formats including .ino (Arduino), .c/.h (C/C++), .sch/.brd (Eagle), .kicad_sch/.kicad_pcb (KiCad), .STEP/.STL (3D models), .pdf (Documentation), and .csv (BOM).</p>
          </div>
        </section>

        <section id="failures">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">5. Delivery Failures</h2>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed mb-4">
            In rare cases, delivery may fail due to technical issues. If you have been charged but have not received access to your product within <strong>30 minutes</strong> of payment:
          </p>
          <div className="space-y-3 text-sm text-[#1A3C2F]/75">
            <p className="flex gap-3"><span className="text-[#C4A35A] font-bold shrink-0">1.</span>Check your dashboard at creato4lab.com/dashboard and refresh the page</p>
            <p className="flex gap-3"><span className="text-[#C4A35A] font-bold shrink-0">2.</span>Check your registered email for a confirmation or error message</p>
            <p className="flex gap-3"><span className="text-[#C4A35A] font-bold shrink-0">3.</span>Email us at <a href="mailto:creato4lab@gmail.com" className="text-[#C4A35A]">creato4lab@gmail.com</a> with your Order ID and payment screenshot</p>
          </div>
          <p className="text-xs text-[#1A3C2F]/50 mt-4">We will resolve genuine delivery failures within <strong>24 hours</strong>. If we cannot resolve it, a full refund will be issued.</p>
        </section>

        <section id="no-physical">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">6. No Physical Shipping</h2>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed">
            Creato4 Lab does not ship any physical goods. We do not sell hardware kits, components, or physical products through this platform. If you are looking for physical hardware components (resistors, microcontrollers, PCBs), we recommend purchasing from established Indian electronics distributors like Robu.in, Evelta, or Stack.
          </p>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed mt-3">
            Our commercial engineering and industrial prototype services (listed separately on our Services section) may involve physical deliverables. Those engagements are governed by a separate project contract, not this policy.
          </p>
        </section>

        <section id="download-limits">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">7. Download Limits</h2>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed mb-4">
            To protect our intellectual property, each license has a download limit per the EULA:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#1A3C2F] text-[#FAF8F5] text-xs">
                  <th className="text-left p-3 rounded-tl-lg">License Tier</th>
                  <th className="text-left p-3">Max Downloads</th>
                  <th className="text-left p-3 rounded-tr-lg">Access Duration</th>
                </tr>
              </thead>
              <tbody className="text-xs text-[#1A3C2F]/70">
                {[
                  { tier: 'Student', downloads: '2 downloads', duration: '1 year' },
                  { tier: 'Commercial', downloads: '5 downloads', duration: '3 years' },
                  { tier: 'Enterprise', downloads: 'Unlimited', duration: '3 years' },
                ].map((row, i) => (
                  <tr key={row.tier} className={i % 2 === 0 ? 'bg-[#1A3C2F]/[0.02]' : ''}>
                    <td className="p-3 font-semibold text-[#1A3C2F]">{row.tier}</td>
                    <td className="p-3">{row.downloads}</td>
                    <td className="p-3">{row.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="contact">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">8. Contact Support</h2>
          <div className="p-5 border border-[#1A3C2F]/10 rounded-xl text-sm text-[#1A3C2F]/75 space-y-2">
            <p><strong>Email:</strong> <a href="mailto:creato4lab@gmail.com" className="text-[#C4A35A]">creato4lab@gmail.com</a></p>
            <p><strong>Phone:</strong> <a href="tel:+919909089344" className="text-[#C4A35A]">+91 99090 89344</a></p>
            <p><strong>Response Time:</strong> Within 24 hours (business days)</p>
          </div>
        </section>

      </div>
    </LegalLayout>
  );
}
