import LegalLayout from '@/components/LegalLayout';

const sections = [
  { id: 'ownership', title: 'Our IP Ownership' },
  { id: 'trademarks', title: 'Trademarks' },
  { id: 'copyright', title: 'Copyright' },
  { id: 'trade-secrets', title: 'Trade Secrets' },
  { id: 'reporting', title: 'Reporting Infringement' },
  { id: 'dmca', title: 'DMCA & Indian Law' },
  { id: 'fair-use', title: 'Fair Use Guidelines' },
  { id: 'third-party', title: 'Third-Party Content' },
];

export const metadata = {
  title: 'Intellectual Property Rights — Creato4 Lab',
  description: 'IP rights notice for Creato4 Lab. All engineering designs, source code, and brand assets are protected under Indian Copyright Act 1957 and Trademarks Act 1999.',
};

export default function IntellectualPropertyPage() {
  return (
    <LegalLayout
      title="Intellectual Property Rights"
      subtitle="All engineering designs, source code, brand assets, and platform content are the exclusive intellectual property of Creato4 Technologies, protected under Indian and international law."
      lastUpdated="July 26, 2026"
      effectiveDate="July 26, 2026"
      sections={sections}
    >
      <div className="space-y-12">

        <section id="ownership">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">1. Our IP Ownership</h2>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed mb-4">
            <strong>Creato4 Technologies</strong> (&quot;Creato4 Lab&quot;) is the sole and exclusive owner of all intellectual property rights in and to its engineering products, platform, and brand assets. This includes but is not limited to:
          </p>
          <ul className="space-y-2.5 text-sm text-[#1A3C2F]/75">
            {[
              'All Arduino, ESP32, STM32, and Raspberry Pi source code and firmware',
              'All PCB schematics, Gerber files, and electrical designs',
              'All CAD models, 3D printable files (STL/STEP), and mechanical drawings',
              'All embedded documentation, BOMs, and technical specifications',
              'Video course content, tutorials, and educational materials',
              'The Creato4 Lab website, user interface design, and platform software',
              'The Creato4 brand name, logos, logomarks, and visual identity',
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#C4A35A] font-bold shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="trademarks">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">2. Trademarks</h2>
          <div className="space-y-4">
            <div className="bg-[#1A3C2F] text-[#FAF8F5] rounded-2xl p-6">
              <p className="text-xs text-[#C4A35A] font-bold uppercase tracking-widest mb-3">Protected Trademarks</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-[#FAF8F5]/5 rounded-xl">
                  <p className="font-bold">CREATO4™</p>
                  <p className="text-xs text-[#FAF8F5]/60 mt-1">Brand name (TM pending registration)</p>
                </div>
                <div className="p-3 bg-[#FAF8F5]/5 rounded-xl">
                  <p className="font-bold">CREATO4 LAB™</p>
                  <p className="text-xs text-[#FAF8F5]/60 mt-1">Marketplace name (TM pending registration)</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-[#1A3C2F]/75 leading-relaxed">
              These marks are protected under the <strong>Trademarks Act, 1999 (India)</strong> and the Paris Convention for the Protection of Industrial Property. Unauthorized use of these marks — including in domain names, social media handles, product names, or marketing materials — is strictly prohibited and constitutes trademark infringement.
            </p>
            <p className="text-sm text-[#1A3C2F]/75">
              You may not use &quot;Creato4&quot; or &quot;Creato4 Lab&quot; in a way that falsely implies any sponsorship, endorsement, or affiliation with our company.
            </p>
          </div>
        </section>

        <section id="copyright">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">3. Copyright</h2>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed mb-4">
            All original engineering works created by Creato4 Technologies are protected under the <strong>Copyright Act, 1957 (India)</strong> from the moment of their creation. Copyright protection is automatic and does not require registration in India.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { type: 'Source Code', protection: 'Considered a literary work under Section 2(o) of the Copyright Act. Maximum protection under Indian law.' },
              { type: 'CAD / 3D Models', protection: 'Protected as artistic works under Section 2(c). The 3D design itself is copyrighted, not just the rendered image.' },
              { type: 'PCB Layouts', protection: 'Protected as original artistic works. The circuit layout is our creative expression and is fully copyrighted.' },
            ].map(({ type, protection }) => (
              <div key={type} className="p-4 bg-[#1A3C2F]/[0.03] border border-[#1A3C2F]/8 rounded-xl">
                <p className="text-xs font-bold text-[#1A3C2F] mb-2">{type}</p>
                <p className="text-xs text-[#1A3C2F]/65 leading-relaxed">{protection}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#1A3C2F]/50 mt-4">
            © 2026 Creato4 Technologies. All rights reserved. Reproduction, distribution, or creation of derivative works based on our content without explicit written authorization is a criminal offence under Section 63 of the Copyright Act, 1957.
          </p>
        </section>

        <section id="trade-secrets">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">4. Trade Secrets & Confidential Information</h2>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed mb-3">
            Certain aspects of our engineering methodologies, algorithms, design processes, and business data constitute trade secrets protected under the <strong>Indian Contract Act, 1872</strong> and common law principles of confidentiality.
          </p>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed">
            Purchasers of our commercial and enterprise products must maintain confidentiality of any proprietary methods disclosed in the design documentation. Disclosure to competitors or the public constitutes a breach of contract and misappropriation of trade secrets.
          </p>
        </section>

        <section id="reporting">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">5. Reporting IP Infringement</h2>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed mb-4">
            If you discover any unauthorized use of our intellectual property — such as our designs being resold on other platforms, our code being published on public repositories without authorization, or our brand being misused — please report it immediately.
          </p>
          <div className="bg-[#1A3C2F] text-[#FAF8F5] rounded-2xl p-6">
            <p className="text-xs text-[#C4A35A] font-bold uppercase tracking-widest mb-3">Report IP Violation</p>
            <p className="text-sm mb-4">Send an email to <a href="mailto:creato4lab@gmail.com" className="text-[#C4A35A] underline">creato4lab@gmail.com</a> with subject: <strong>&quot;IP Violation Report&quot;</strong></p>
            <p className="text-sm text-[#FAF8F5]/70 mb-2">Include in your report:</p>
            <ul className="space-y-1.5 text-xs text-[#FAF8F5]/65">
              <li>• URL or location where the infringement was found</li>
              <li>• A description of what IP was infringed</li>
              <li>• Your contact information (optional, for follow-up)</li>
              <li>• Screenshots or evidence of the infringement</li>
            </ul>
            <p className="text-xs text-[#FAF8F5]/50 mt-4">We take IP violations extremely seriously and will act within 48 hours of a verified report.</p>
          </div>
        </section>

        <section id="dmca">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">6. DMCA Takedowns & Indian Law Remedies</h2>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed mb-4">
            Creato4 Technologies will actively pursue all available legal remedies against IP infringers, including:
          </p>
          <div className="space-y-3">
            {[
              { remedy: 'DMCA Takedown (International)', desc: 'For content hosted on international platforms (GitHub, YouTube, Google Drive), we will file a DMCA takedown notice to have the content removed within 24 hours.' },
              { remedy: 'Civil Action (India)', desc: 'Under the Copyright Act, 1957, we may seek injunctions, delivery up of infringing copies, and damages up to ₹2 Crore per infringed work.' },
              { remedy: 'Criminal Action (India)', desc: 'For commercial-scale piracy, Section 63 of the Copyright Act 1957 provides for imprisonment of 6 months to 3 years and a fine of ₹50,000 to ₹2 Lakhs.' },
              { remedy: 'Trademark Infringement (India)', desc: 'Under the Trademarks Act 1999, trademark infringement is both a civil and criminal offence, with imprisonment up to 3 years.' },
            ].map(({ remedy, desc }) => (
              <div key={remedy} className="flex gap-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <span className="text-red-500 font-bold text-lg shrink-0">⚖</span>
                <div>
                  <p className="text-sm font-semibold text-[#1A3C2F] mb-1">{remedy}</p>
                  <p className="text-xs text-[#1A3C2F]/65 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="fair-use">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">7. Fair Use & Permitted References</h2>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed mb-4">
            The following uses of Creato4 Lab&apos;s content are permitted without prior written authorization:
          </p>
          <ul className="space-y-2.5 text-sm text-[#1A3C2F]/75">
            <li className="flex gap-3"><span className="text-green-600 font-bold shrink-0">✓</span>Linking to our website from a blog, article, or social media post</li>
            <li className="flex gap-3"><span className="text-green-600 font-bold shrink-0">✓</span>Sharing a screenshot of our platform for non-commercial review or critique purposes</li>
            <li className="flex gap-3"><span className="text-green-600 font-bold shrink-0">✓</span>Mentioning &quot;Creato4 Lab&quot; in academic papers with proper citation</li>
            <li className="flex gap-3"><span className="text-green-600 font-bold shrink-0">✓</span>Using product images from our website for non-commercial editorial use with attribution</li>
          </ul>
        </section>

        <section id="third-party">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">8. Third-Party Content</h2>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed">
            Some of our products may utilize open-source libraries, frameworks, or components. In such cases, the product listing clearly discloses the open-source components used and their respective licenses (e.g., MIT, GNU GPL, Apache 2.0). Our original engineering work built upon such open-source foundations remains our proprietary IP. The open-source components themselves are governed by their respective license terms.
          </p>
        </section>

      </div>
    </LegalLayout>
  );
}
