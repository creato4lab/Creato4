import LegalLayout from '@/components/LegalLayout';

const sections = [
  { id: 'agreement', title: 'The Agreement' },
  { id: 'eligibility', title: 'Eligibility' },
  { id: 'account', title: 'Your Account' },
  { id: 'products', title: 'Digital Products' },
  { id: 'payments', title: 'Payments & Pricing' },
  { id: 'prohibited', title: 'Prohibited Uses' },
  { id: 'ip', title: 'Intellectual Property' },
  { id: 'disclaimer', title: 'Disclaimers' },
  { id: 'liability', title: 'Limitation of Liability' },
  { id: 'termination', title: 'Termination' },
  { id: 'governing-law', title: 'Governing Law' },
  { id: 'contact', title: 'Contact Us' },
];

export const metadata = {
  title: 'Terms of Service — Creato4 Lab',
  description: 'Terms and conditions for using Creato4 Lab engineering marketplace. Governed by Indian Contract Act 1872.',
};

export default function TermsOfServicePage() {
  return (
    <LegalLayout
      title="Terms of Service"
      subtitle="These Terms constitute a legally binding agreement between you and Creato4 Technologies under the Indian Contract Act, 1872. Please read carefully before using our platform."
      lastUpdated="July 26, 2026"
      effectiveDate="July 26, 2026"
      sections={sections}
    >
      <div className="space-y-12">

        <section id="agreement">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">1. The Agreement</h2>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed mb-4">
            These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Creato4 Lab platform operated by <strong>Creato4 Technologies</strong> (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), an engineering products marketplace based in <strong>Gujarat, India</strong>.
          </p>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed mb-4">
            By accessing our website, creating an account, or purchasing any product, you agree to be bound by these Terms. If you are acting on behalf of a company, you represent that you have authority to bind that company to these Terms.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <strong>Important:</strong> These Terms contain a limitation of liability clause (Section 9) and a mandatory arbitration/jurisdiction clause (Section 11). Please read them carefully.
          </div>
        </section>

        <section id="eligibility">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">2. Eligibility</h2>
          <ul className="space-y-3 text-sm text-[#1A3C2F]/75">
            <li className="flex gap-3"><span className="text-[#C4A35A] font-bold shrink-0">•</span>You must be at least <strong>18 years of age</strong> to use this platform. Users aged 13–17 may use the platform only with verified parental or guardian consent.</li>
            <li className="flex gap-3"><span className="text-[#C4A35A] font-bold shrink-0">•</span>You must be legally capable of entering into a binding contract under the <strong>Indian Contract Act, 1872</strong>.</li>
            <li className="flex gap-3"><span className="text-[#C4A35A] font-bold shrink-0">•</span>You must not be barred from receiving our services under any applicable law or court order.</li>
            <li className="flex gap-3"><span className="text-[#C4A35A] font-bold shrink-0">•</span>Our services are available globally, but all transactions are governed by Indian law.</li>
          </ul>
        </section>

        <section id="account">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">3. Your Account</h2>
          <div className="space-y-3 text-sm text-[#1A3C2F]/75">
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
            <p>You must provide accurate and truthful information when creating your account. Providing false information, impersonating another person, or creating accounts under fictitious names is strictly prohibited and may result in immediate termination.</p>
            <p>You must notify us immediately at <a href="mailto:creato4lab@gmail.com" className="text-[#C4A35A]">creato4lab@gmail.com</a> if you suspect unauthorized access to your account.</p>
            <p>We reserve the right to suspend or terminate any account at our sole discretion for violations of these Terms, without prior notice and without refund.</p>
          </div>
        </section>

        <section id="products">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">4. Digital Products</h2>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed mb-4">
            Creato4 Lab sells digital engineering products including but not limited to: Arduino source code, ESP32 firmware, PCB schematics, CAD models, 3D printable files, embedded documentation, BOM files, and video courses.
          </p>
          <div className="space-y-3 text-sm text-[#1A3C2F]/75">
            <p><strong className="text-[#1A3C2F]">License, Not Sale:</strong> The purchase of a digital product grants you a <strong>license</strong> to use the product as specified in our End User License Agreement (EULA). You do not acquire ownership of the intellectual property.</p>
            <p><strong className="text-[#1A3C2F]">Instant Delivery:</strong> Digital products are delivered immediately upon confirmed payment via your account dashboard.</p>
            <p><strong className="text-[#1A3C2F]">Accuracy:</strong> We make every effort to accurately describe our products. However, engineering designs may require modification for your specific application. We are not responsible for design modifications made by the buyer.</p>
            <p><strong className="text-[#1A3C2F]">Safety Disclaimer:</strong> Electrical and embedded engineering products carry inherent risk. You are responsible for implementing appropriate safety measures before deploying any design in a real-world environment.</p>
          </div>
        </section>

        <section id="payments">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">5. Payments & Pricing</h2>
          <div className="space-y-3 text-sm text-[#1A3C2F]/75">
            <p>All prices are listed in <strong>Indian Rupees (INR)</strong> and are inclusive of applicable GST unless stated otherwise.</p>
            <p>Payments are processed securely by <strong>Razorpay</strong>. We do not store your card details. By completing a purchase, you agree to Razorpay&apos;s Terms of Service.</p>
            <p>We reserve the right to change prices at any time. Price changes will not affect orders already placed.</p>
            <p>In the event of a pricing error, we reserve the right to cancel the order and issue a full refund.</p>
            <p><strong className="text-[#1A3C2F]">GST:</strong> As required by the Goods and Services Tax (GST) Act, applicable GST will be charged on all transactions. GST invoices will be made available in your account dashboard.</p>
          </div>
        </section>

        <section id="prohibited">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">6. Prohibited Uses</h2>
          <p className="text-sm text-[#1A3C2F]/75 mb-4">You strictly agree NOT to:</p>
          <ul className="space-y-2.5 text-sm text-[#1A3C2F]/75">
            {[
              'Resell, redistribute, sublicense, or share any purchased digital product with any third party',
              'Upload any purchased product to a public repository, torrent, or file-sharing platform',
              'Claim authorship or ownership of our original engineering designs',
              'Use our designs to create weapons, illegal devices, or any product that violates Indian law or international treaties',
              'Attempt to reverse-engineer our proprietary product structures or extract embedded watermarks',
              'Use automated bots or scrapers to access our platform',
              'Engage in fraudulent chargebacks or payment disputes for legitimately delivered products',
              'Create multiple accounts to circumvent purchase limits or abuse free-trial features',
              'Interfere with or disrupt the integrity or performance of the platform',
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-red-500 font-bold shrink-0">✗</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-[#1A3C2F]/50 mt-4">Violations may result in immediate account termination, license revocation, and legal proceedings under the <strong>Copyright Act 1957</strong> and <strong>IT Act 2000</strong>.</p>
        </section>

        <section id="ip">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">7. Intellectual Property</h2>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed mb-4">
            All content on the Creato4 Lab platform — including engineering designs, source code, CAD files, PCB schematics, documentation, images, logos, and the platform&apos;s software — is the exclusive intellectual property of Creato4 Technologies and is protected under the <strong>Copyright Act, 1957</strong> and the <strong>Patents Act, 1970</strong>.
          </p>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed">
            &quot;Creato4&quot;, &quot;Creato4 Lab&quot;, and the Creato4 logomark are trademarks of Creato4 Technologies. Unauthorized use of our trademarks is strictly prohibited under the <strong>Trademarks Act, 1999</strong>.
          </p>
        </section>

        <section id="disclaimer">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">8. Disclaimers</h2>
          <div className="space-y-3 text-sm text-[#1A3C2F]/75">
            <p>THE PLATFORM IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.</p>
            <p>We do not warrant that: (a) the platform will be uninterrupted or error-free; (b) any defects will be corrected; (c) digital products are free of viruses; or (d) the results of using our products will meet your requirements.</p>
            <p>Engineering designs are provided for educational and prototyping purposes. We make no guarantees regarding commercial viability, regulatory compliance, or fitness for a specific industrial purpose.</p>
          </div>
        </section>

        <section id="liability">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">9. Limitation of Liability</h2>
          <div className="bg-[#1A3C2F]/5 border border-[#1A3C2F]/10 rounded-xl p-5 text-sm text-[#1A3C2F]/75 space-y-3">
            <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE INDIAN LAW, CREATO4 TECHNOLOGIES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.</p>
            <p>Our total cumulative liability to you for all claims arising out of or relating to the use of our platform shall not exceed the amount you paid to us in the <strong>3 months preceding the claim</strong>.</p>
            <p>This limitation applies whether the liability arises from contract, tort (including negligence), strict liability, or any other legal theory, and whether or not we have been advised of the possibility of such damage.</p>
          </div>
        </section>

        <section id="termination">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">10. Termination</h2>
          <div className="space-y-3 text-sm text-[#1A3C2F]/75">
            <p>We may terminate or suspend your account and access to our services at any time, for any reason, including — but not limited to — violation of these Terms, fraudulent activity, or inactivity exceeding 24 months.</p>
            <p>Upon termination, your license to use purchased products continues for the duration specified in your license, unless terminated due to a policy violation, in which case all licenses are immediately revoked.</p>
            <p>You may delete your account at any time via your dashboard settings. Account deletion does not entitle you to a refund of any prior purchases.</p>
          </div>
        </section>

        <section id="governing-law">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">11. Governing Law & Dispute Resolution</h2>
          <div className="bg-[#1A3C2F] text-[#FAF8F5] rounded-2xl p-6 space-y-3 text-sm">
            <p><span className="text-[#C4A35A] font-bold">Governing Law:</span> These Terms are governed by and construed in accordance with the laws of the <strong>Republic of India</strong>.</p>
            <p><span className="text-[#C4A35A] font-bold">Jurisdiction:</span> The courts of <strong>Ahmedabad, Gujarat, India</strong> shall have exclusive jurisdiction over all disputes arising from these Terms.</p>
            <p><span className="text-[#C4A35A] font-bold">Dispute Resolution:</span> Before initiating any legal proceedings, both parties agree to attempt resolution through good-faith negotiation for at least <strong>30 days</strong> following written notice of the dispute.</p>
            <p><span className="text-[#C4A35A] font-bold">Force Majeure:</span> We are not liable for failure to perform our obligations due to circumstances beyond our reasonable control, including natural disasters, government actions, internet outages, or pandemic-related disruptions.</p>
          </div>
        </section>

        <section id="contact">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">12. Contact Us</h2>
          <p className="text-sm text-[#1A3C2F]/75 mb-4">For questions about these Terms, contact us at:</p>
          <div className="p-4 border border-[#1A3C2F]/10 rounded-xl text-sm text-[#1A3C2F]/75 space-y-1.5">
            <p><strong>Creato4 Technologies</strong></p>
            <p>Gujarat, India</p>
            <p>Email: <a href="mailto:creato4lab@gmail.com" className="text-[#C4A35A]">creato4lab@gmail.com</a></p>
            <p>Phone: <a href="tel:+919909089344" className="text-[#C4A35A]">+91 99090 89344</a></p>
          </div>
        </section>

      </div>
    </LegalLayout>
  );
}
