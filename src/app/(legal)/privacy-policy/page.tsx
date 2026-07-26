import LegalLayout from '@/components/LegalLayout';

const sections = [
  { id: 'overview', title: 'Overview' },
  { id: 'data-collected', title: 'Data We Collect' },
  { id: 'how-we-use', title: 'How We Use Data' },
  { id: 'data-sharing', title: 'Data Sharing' },
  { id: 'data-retention', title: 'Data Retention' },
  { id: 'your-rights', title: 'Your Rights (DPDP)' },
  { id: 'security', title: 'Data Security' },
  { id: 'children', title: 'Children\'s Privacy' },
  { id: 'changes', title: 'Policy Changes' },
  { id: 'grievance', title: 'Grievance Officer' },
];

export const metadata = {
  title: 'Privacy Policy — Creato4 Lab',
  description: 'How Creato4 Lab collects, uses, and protects your personal data. Compliant with India\'s Digital Personal Data Protection Act 2023.',
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="We are committed to protecting your personal data in compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act) and the Information Technology Act, 2000."
      lastUpdated="July 26, 2026"
      effectiveDate="July 26, 2026"
      sections={sections}
    >
      <div className="space-y-12">

        <section id="overview">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">1. Overview</h2>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed mb-4">
            This Privacy Policy applies to <strong>Creato4 Technologies</strong> (&quot;Creato4 Lab&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), operating the engineering marketplace at <strong>creato4lab.com</strong>. We are headquartered in <strong>Gujarat, India</strong>.
          </p>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed mb-4">
            By creating an account, purchasing a product, or visiting our website, you consent to the collection and use of your data as described in this policy. If you do not agree, you must not use our services.
          </p>
          <div className="bg-[#1A3C2F]/5 border border-[#1A3C2F]/10 rounded-xl p-5">
            <p className="text-xs font-bold text-[#1A3C2F] uppercase tracking-wider mb-2">Legal Basis (India)</p>
            <p className="text-sm text-[#1A3C2F]/70 leading-relaxed">
              This policy is governed by the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, the <strong>Information Technology Act, 2000</strong>, and the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong>.
            </p>
          </div>
        </section>

        <section id="data-collected">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">2. Data We Collect</h2>

          <h3 className="text-sm font-bold text-[#1A3C2F] mb-3 mt-6">2.1 Data You Provide Directly</h3>
          <ul className="space-y-2 text-sm text-[#1A3C2F]/75 mb-6">
            <li className="flex gap-3"><span className="text-[#C4A35A] font-bold shrink-0">•</span><span><strong>Account Data:</strong> Full name, email address, and profile picture (via Google OAuth)</span></li>
            <li className="flex gap-3"><span className="text-[#C4A35A] font-bold shrink-0">•</span><span><strong>Payment Data:</strong> Order amount, currency (INR), transaction ID. We do NOT store raw card numbers — all payment processing is handled by Razorpay (a PCI-DSS compliant gateway).</span></li>
            <li className="flex gap-3"><span className="text-[#C4A35A] font-bold shrink-0">•</span><span><strong>Communications:</strong> Messages sent to us via support tickets or email.</span></li>
          </ul>

          <h3 className="text-sm font-bold text-[#1A3C2F] mb-3">2.2 Data Collected Automatically</h3>
          <ul className="space-y-2 text-sm text-[#1A3C2F]/75 mb-6">
            <li className="flex gap-3"><span className="text-[#C4A35A] font-bold shrink-0">•</span><span><strong>Log Data:</strong> IP address, browser type, pages visited, time and date of visits</span></li>
            <li className="flex gap-3"><span className="text-[#C4A35A] font-bold shrink-0">•</span><span><strong>Session Cookies:</strong> Secure session tokens for authentication (not for advertising)</span></li>
            <li className="flex gap-3"><span className="text-[#C4A35A] font-bold shrink-0">•</span><span><strong>Download Logs:</strong> Records of which digital files have been downloaded per license</span></li>
          </ul>

          <h3 className="text-sm font-bold text-[#1A3C2F] mb-3">2.3 Data We Do NOT Collect</h3>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <ul className="space-y-1.5 text-sm text-green-800">
              <li>✓ We do NOT sell your data to any third party</li>
              <li>✓ We do NOT collect biometric data, Aadhaar numbers, or government IDs</li>
              <li>✓ We do NOT run advertising tracking or third-party retargeting pixels</li>
              <li>✓ We do NOT record audio or video without explicit consent</li>
            </ul>
          </div>
        </section>

        <section id="how-we-use">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">3. How We Use Your Data</h2>
          <div className="space-y-4">
            {[
              { purpose: 'Order Fulfillment', detail: 'To process your payment, generate your license key, and deliver the digital product to your dashboard.' },
              { purpose: 'Account Management', detail: 'To create and maintain your user account, manage sessions, and enable dashboard access.' },
              { purpose: 'Customer Support', detail: 'To respond to support tickets, investigate complaints, and resolve disputes.' },
              { purpose: 'Legal Compliance', detail: 'To maintain transaction records for GST compliance and respond to lawful government requests.' },
              { purpose: 'Security', detail: 'To detect fraudulent transactions, prevent unauthorized downloads, and protect our IP.' },
              { purpose: 'Service Improvement', detail: 'Anonymous, aggregated analytics to understand which products are popular and improve our offerings.' },
            ].map(({ purpose, detail }) => (
              <div key={purpose} className="flex gap-4 p-4 bg-[#1A3C2F]/[0.03] rounded-xl border border-[#1A3C2F]/8">
                <span className="shrink-0 w-2 h-2 rounded-full bg-[#C4A35A] mt-1.5" />
                <div>
                  <p className="text-sm font-semibold text-[#1A3C2F] mb-1">{purpose}</p>
                  <p className="text-xs text-[#1A3C2F]/65 leading-relaxed">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="data-sharing">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">4. Data Sharing with Third Parties</h2>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed mb-5">
            We share your data only with trusted third-party service providers necessary to operate the platform. We never sell, rent, or trade your personal data.
          </p>
          <div className="space-y-4">
            {[
              { name: 'Razorpay', role: 'Payment Gateway', country: 'India', data: 'Order amount, email for payment processing', link: 'https://razorpay.com/privacy/' },
              { name: 'Google', role: 'OAuth Authentication', country: 'USA (GDPR/DPDP Compliant)', data: 'Email, name, profile picture for login', link: 'https://policies.google.com/privacy' },
              { name: 'Neon Technologies', role: 'Database Hosting', country: 'Singapore (AWS)', data: 'All account and order data (encrypted at rest)', link: 'https://neon.tech/privacy-policy' },
              { name: 'Vercel', role: 'Website Hosting', country: 'USA', data: 'Access logs, IP addresses', link: 'https://vercel.com/legal/privacy-policy' },
            ].map((partner) => (
              <div key={partner.name} className="p-4 border border-[#1A3C2F]/10 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-[#1A3C2F]">{partner.name}</p>
                  <span className="text-xs bg-[#1A3C2F]/10 px-2 py-0.5 rounded-full text-[#1A3C2F]/60">{partner.country}</span>
                </div>
                <p className="text-xs text-[#1A3C2F]/60 mb-1">Role: {partner.role}</p>
                <p className="text-xs text-[#1A3C2F]/60 mb-2">Data Shared: {partner.data}</p>
                <a href={partner.link} target="_blank" rel="noreferrer" className="text-xs text-[#C4A35A] hover:underline">View their Privacy Policy →</a>
              </div>
            ))}
          </div>
        </section>

        <section id="data-retention">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">5. Data Retention</h2>
          <div className="space-y-3 text-sm text-[#1A3C2F]/75">
            <p><strong className="text-[#1A3C2F]">Account Data:</strong> Retained as long as your account is active. You may request deletion at any time by emailing <a href="mailto:creato4lab@gmail.com" className="text-[#C4A35A]">creato4lab@gmail.com</a>.</p>
            <p><strong className="text-[#1A3C2F]">Transaction Records:</strong> Retained for a minimum of <strong>7 years</strong> as required by the Income Tax Act, 1961 and GST law for audit purposes. These records cannot be deleted on request.</p>
            <p><strong className="text-[#1A3C2F]">Download Logs:</strong> Retained for <strong>3 years</strong> to enforce license agreements and detect unauthorized redistribution.</p>
            <p><strong className="text-[#1A3C2F]">Support Tickets:</strong> Retained for <strong>2 years</strong> after closure.</p>
          </div>
        </section>

        <section id="your-rights">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">6. Your Rights Under DPDP Act 2023</h2>
          <p className="text-sm text-[#1A3C2F]/75 mb-5 leading-relaxed">
            As a Data Principal under the <strong>Digital Personal Data Protection Act, 2023</strong>, you have the following rights:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { right: 'Right to Access', desc: 'Request a copy of all personal data we hold about you.' },
              { right: 'Right to Correction', desc: 'Request correction of inaccurate or incomplete data.' },
              { right: 'Right to Erasure', desc: 'Request deletion of your data (subject to legal retention requirements).' },
              { right: 'Right to Grievance Redressal', desc: 'File a complaint with our Grievance Officer within 30 days.' },
              { right: 'Right to Nominate', desc: 'Nominate another person to exercise rights on your behalf in case of death or incapacity.' },
              { right: 'Right to Withdraw Consent', desc: 'Withdraw consent at any time. This may affect your ability to use the service.' },
            ].map(({ right, desc }) => (
              <div key={right} className="p-4 bg-[#1A3C2F]/[0.03] border border-[#1A3C2F]/8 rounded-xl">
                <p className="text-xs font-bold text-[#1A3C2F] mb-1.5">{right}</p>
                <p className="text-xs text-[#1A3C2F]/65 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#1A3C2F]/50 mt-4">To exercise any of these rights, email <a href="mailto:creato4lab@gmail.com" className="text-[#C4A35A]">creato4lab@gmail.com</a> with the subject line &quot;DPDP Rights Request&quot;. We will respond within <strong>30 days</strong>.</p>
        </section>

        <section id="security">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">7. Data Security</h2>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed mb-4">
            We implement industry-standard security measures in compliance with <strong>IT (Amendment) Act, 2008 Section 43A</strong>:
          </p>
          <ul className="space-y-2.5 text-sm text-[#1A3C2F]/75">
            <li className="flex gap-3"><span className="text-[#C4A35A] font-bold shrink-0">•</span>All data transmitted over HTTPS/TLS 1.3 encryption</li>
            <li className="flex gap-3"><span className="text-[#C4A35A] font-bold shrink-0">•</span>Database encrypted at rest (AES-256) on Neon PostgreSQL</li>
            <li className="flex gap-3"><span className="text-[#C4A35A] font-bold shrink-0">•</span>Passwords hashed using bcrypt (never stored in plain text)</li>
            <li className="flex gap-3"><span className="text-[#C4A35A] font-bold shrink-0">•</span>OAuth 2.0 used for Google login (no passwords stored by us)</li>
            <li className="flex gap-3"><span className="text-[#C4A35A] font-bold shrink-0">•</span>Access to production database restricted to authorized personnel only</li>
          </ul>
          <p className="text-xs text-[#1A3C2F]/50 mt-4 leading-relaxed">
            In the event of a data breach affecting your personal data, we will notify you via email within <strong>72 hours</strong> of becoming aware of the breach, as required by applicable law.
          </p>
        </section>

        <section id="children">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">8. Children&apos;s Privacy</h2>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed">
            Our services are not directed to individuals under the age of 18. We do not knowingly collect personal data from minors. If a parent or guardian believes their child has provided us with personal information, please contact our Grievance Officer immediately and we will delete such data within 7 business days.
          </p>
        </section>

        <section id="changes">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">9. Changes to This Policy</h2>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed">
            We may update this Privacy Policy periodically. We will notify registered users via email at least <strong>15 days before</strong> any material changes take effect. Continued use of the platform after the effective date constitutes acceptance of the revised policy. The latest version will always be available at <strong>creato4lab.com/privacy-policy</strong>.
          </p>
        </section>

        <section id="grievance">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">10. Grievance Officer</h2>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed mb-5">
            As mandated by Rule 5(9) of the <strong>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</strong>, we have designated a Grievance Officer:
          </p>
          <div className="bg-[#1A3C2F] text-[#FAF8F5] rounded-2xl p-6">
            <p className="text-xs text-[#C4A35A] font-bold uppercase tracking-widest mb-4">Grievance Officer Details</p>
            <div className="space-y-2.5 text-sm">
              <p><span className="text-[#FAF8F5]/50">Name:</span> <strong>Creato4 Technologies — Legal Team</strong></p>
              <p><span className="text-[#FAF8F5]/50">Email:</span> <a href="mailto:creato4lab@gmail.com" className="text-[#C4A35A] hover:underline">creato4lab@gmail.com</a></p>
              <p><span className="text-[#FAF8F5]/50">Address:</span> Gujarat, India</p>
              <p><span className="text-[#FAF8F5]/50">Response Time:</span> <strong>30 days from receipt of complaint</strong></p>
            </div>
          </div>
          <p className="text-xs text-[#1A3C2F]/50 mt-4">
            If you are unsatisfied with our response, you may approach the Data Protection Board of India once established under the DPDP Act 2023.
          </p>
        </section>

      </div>
    </LegalLayout>
  );
}
