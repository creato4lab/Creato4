import LegalLayout from '@/components/LegalLayout';

const sections = [
  { id: 'what-is-eula', title: 'What This EULA Covers' },
  { id: 'license-tiers', title: 'License Tiers' },
  { id: 'permitted', title: 'Permitted Uses' },
  { id: 'prohibited', title: 'Prohibited Uses' },
  { id: 'watermarking', title: 'Digital Watermarking' },
  { id: 'enforcement', title: 'Enforcement & Violations' },
  { id: 'attribution', title: 'Attribution' },
  { id: 'termination', title: 'License Termination' },
  { id: 'no-warranty', title: 'No Warranty' },
];

export const metadata = {
  title: 'End User License Agreement (EULA) — Creato4 Lab',
  description: 'License terms for all digital engineering products purchased from Creato4 Lab. Protected under Indian Copyright Act 1957.',
};

export default function EulaPage() {
  return (
    <LegalLayout
      title="End User License Agreement"
      subtitle="This EULA governs your use of all digital products purchased from Creato4 Lab. All products are LICENSED, not sold. Read this document before downloading any file."
      lastUpdated="July 26, 2026"
      effectiveDate="July 26, 2026"
      sections={sections}
    >
      <div className="space-y-12">

        <div className="bg-[#1A3C2F] text-[#FAF8F5] rounded-2xl p-6">
          <p className="text-xs text-[#C4A35A] font-bold uppercase tracking-widest mb-3">⚠ Critical Notice</p>
          <p className="text-sm leading-relaxed">
            All digital engineering products available on Creato4 Lab — including source code, PCB schematics, CAD files, 3D models, firmware, documentation, and video courses — are <strong>original intellectual property of Creato4 Technologies</strong> and are protected under the <strong>Copyright Act, 1957</strong> (India) and applicable international copyright treaties. Purchasing a product does NOT transfer ownership; it grants a limited, non-exclusive, non-transferable license as defined herein.
          </p>
        </div>

        <section id="what-is-eula">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">1. What This EULA Covers</h2>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed mb-4">
            This End User License Agreement (&quot;EULA&quot;) is a legal agreement between you (&quot;Licensee&quot;) and Creato4 Technologies (&quot;Licensor&quot;) for the use of digital engineering products (&quot;Product&quot;) purchased through the Creato4 Lab marketplace.
          </p>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed">
            By downloading, accessing, or using any Product, you accept the terms of this EULA. If you do not agree, you must not download or use the Product and must contact us within <strong>24 hours of purchase</strong> for a refund consideration per our Refund Policy.
          </p>
        </section>

        <section id="license-tiers">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">2. License Tiers</h2>
          <p className="text-sm text-[#1A3C2F]/75 mb-6">Each product listing clearly states which license tier applies. Your rights are strictly limited to the tier purchased.</p>

          <div className="space-y-5">
            {/* Student License */}
            <div className="border-2 border-[#1A3C2F]/15 rounded-2xl overflow-hidden">
              <div className="bg-[#1A3C2F]/8 px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#1A3C2F]">Student License</p>
                  <p className="text-xs text-[#1A3C2F]/55">For personal learning & academic projects</p>
                </div>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">STUDENT</span>
              </div>
              <div className="px-5 py-4 space-y-2 text-sm text-[#1A3C2F]/70">
                <p className="flex gap-2"><span className="text-green-600">✓</span> 1 personal project use</p>
                <p className="flex gap-2"><span className="text-green-600">✓</span> Use on personal hardware only (not company/client hardware)</p>
                <p className="flex gap-2"><span className="text-green-600">✓</span> Include in academic reports with attribution to Creato4 Lab</p>
                <p className="flex gap-2"><span className="text-green-600">✓</span> 2 authorized device downloads</p>
                <p className="flex gap-2"><span className="text-red-500">✗</span> No commercial use of any kind</p>
                <p className="flex gap-2"><span className="text-red-500">✗</span> No sharing, gifting, or transferring the file to another person</p>
                <p className="flex gap-2"><span className="text-red-500">✗</span> No derivative products for sale</p>
              </div>
            </div>

            {/* Commercial License */}
            <div className="border-2 border-[#C4A35A]/30 rounded-2xl overflow-hidden">
              <div className="bg-[#C4A35A]/10 px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#1A3C2F]">Commercial License</p>
                  <p className="text-xs text-[#1A3C2F]/55">For startups, freelancers & small businesses</p>
                </div>
                <span className="bg-[#C4A35A] text-[#1A3C2F] text-xs font-bold px-3 py-1 rounded-full">COMMERCIAL</span>
              </div>
              <div className="px-5 py-4 space-y-2 text-sm text-[#1A3C2F]/70">
                <p className="flex gap-2"><span className="text-green-600">✓</span> Up to 3 commercial projects within 1 company</p>
                <p className="flex gap-2"><span className="text-green-600">✓</span> Use in client deliverables (end product, not the source file itself)</p>
                <p className="flex gap-2"><span className="text-green-600">✓</span> Internal team use (max 5 team members)</p>
                <p className="flex gap-2"><span className="text-green-600">✓</span> 5 authorized device downloads</p>
                <p className="flex gap-2"><span className="text-red-500">✗</span> No redistribution of the source files to clients</p>
                <p className="flex gap-2"><span className="text-red-500">✗</span> No creating competing products based on our design</p>
                <p className="flex gap-2"><span className="text-red-500">✗</span> No sublicensing to other companies</p>
              </div>
            </div>

            {/* Enterprise License */}
            <div className="border-2 border-[#1A3C2F]/30 rounded-2xl overflow-hidden">
              <div className="bg-[#1A3C2F] px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#FAF8F5]">Enterprise License</p>
                  <p className="text-xs text-[#FAF8F5]/55">For large organizations & unlimited projects</p>
                </div>
                <span className="bg-[#FAF8F5] text-[#1A3C2F] text-xs font-bold px-3 py-1 rounded-full">ENTERPRISE</span>
              </div>
              <div className="px-5 py-4 space-y-2 text-sm text-[#1A3C2F]/70">
                <p className="flex gap-2"><span className="text-green-600">✓</span> Unlimited projects within 1 legal organization</p>
                <p className="flex gap-2"><span className="text-green-600">✓</span> Unlimited team members within that organization</p>
                <p className="flex gap-2"><span className="text-green-600">✓</span> May modify the design for internal use</p>
                <p className="flex gap-2"><span className="text-green-600">✓</span> Use in multiple client deliverables</p>
                <p className="flex gap-2"><span className="text-green-600">✓</span> Unlimited device downloads</p>
                <p className="flex gap-2"><span className="text-red-500">✗</span> No redistribution of source files externally</p>
                <p className="flex gap-2"><span className="text-red-500">✗</span> License is non-transferable to a parent/subsidiary company without written consent</p>
              </div>
            </div>
          </div>
        </section>

        <section id="permitted">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">3. Permitted Uses (All Licenses)</h2>
          <ul className="space-y-2.5 text-sm text-[#1A3C2F]/75">
            {[
              'Using the design to build physical hardware prototypes for your own use',
              'Referencing the design for educational demonstration, with attribution',
              'Modifying the design for your own internal project (within license scope)',
              'Creating portfolio screenshots of your completed hardware build (not the source file)',
            ].map((item) => (
              <li key={item} className="flex gap-3"><span className="text-green-600 font-bold shrink-0">✓</span><span>{item}</span></li>
            ))}
          </ul>
        </section>

        <section id="prohibited">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">4. Strictly Prohibited Uses (All Licenses)</h2>
          <ul className="space-y-2.5 text-sm text-[#1A3C2F]/75">
            {[
              'Selling, renting, leasing, or sublicensing the Product to any third party',
              'Publishing the source files on GitHub, GitLab, or any public/private repository accessible to others',
              'Uploading to file-sharing platforms, torrents, or cloud storage shared with others',
              'Creating a product that directly competes with the Creato4 Lab marketplace using our designs',
              'Removing or altering any copyright notices, watermarks, or attribution embedded in the files',
              'Using in military applications, weapons development, or surveillance systems',
              'Using in products that violate any Indian law or international treaty',
            ].map((item) => (
              <li key={item} className="flex gap-3"><span className="text-red-500 font-bold shrink-0">✗</span><span>{item}</span></li>
            ))}
          </ul>
        </section>

        <section id="watermarking">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">5. Digital Watermarking</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800 space-y-2">
            <p className="font-bold">Our files may contain invisible digital watermarks tied to your account ID and purchase transaction.</p>
            <p>If a file is found to have been redistributed without authorization, the watermark allows us to trace it back to the original purchaser. The original purchaser will be held legally liable for any unauthorized distribution of their licensed copy, even if the distribution was done by a third party who obtained the file from them.</p>
            <p>Attempting to remove or alter watermarks is itself a violation of the Copyright Act 1957 and this EULA.</p>
          </div>
        </section>

        <section id="enforcement">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">6. Enforcement & Violations</h2>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed mb-4">
            Creato4 Technologies actively monitors the internet for unauthorized distribution of our designs. Upon discovery of a violation:
          </p>
          <div className="space-y-3">
            {[
              { step: 'Step 1', desc: 'We issue a formal Cease & Desist notice via email/registered post.' },
              { step: 'Step 2', desc: 'If not complied with within 7 days, we file a DMCA takedown and/or report to Indian authorities.' },
              { step: 'Step 3', desc: 'We pursue civil remedies under Copyright Act 1957 — including damages up to ₹50 lakhs per infringed work.' },
              { step: 'Step 4', desc: 'In cases of commercial-scale piracy, we may pursue criminal proceedings under Section 63 of the Copyright Act (imprisonment up to 3 years).' },
            ].map(({ step, desc }) => (
              <div key={step} className="flex gap-4 p-4 bg-[#1A3C2F]/[0.03] rounded-xl border border-[#1A3C2F]/8">
                <span className="shrink-0 text-xs font-bold text-[#C4A35A] bg-[#C4A35A]/15 px-2 py-1 rounded h-fit">{step}</span>
                <p className="text-sm text-[#1A3C2F]/70">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="attribution">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">7. Attribution</h2>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed mb-3">
            When permitted to reference our designs publicly (e.g., in academic papers, blog posts, or portfolio), attribution must read:
          </p>
          <div className="bg-[#1A3C2F]/5 border border-[#1A3C2F]/10 rounded-xl p-4 font-mono text-xs text-[#1A3C2F]">
            Design based on [Product Name] by Creato4 Technologies (creato4lab.com). Used under [License Type] License.
          </div>
        </section>

        <section id="termination">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">8. License Termination</h2>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed mb-3">
            This license is effective until terminated. It will terminate automatically, without notice, if you violate any term of this EULA. Upon termination:
          </p>
          <ul className="space-y-2 text-sm text-[#1A3C2F]/75">
            <li className="flex gap-3"><span className="text-[#C4A35A] font-bold shrink-0">•</span>You must destroy all copies of the Product in your possession</li>
            <li className="flex gap-3"><span className="text-[#C4A35A] font-bold shrink-0">•</span>Your access to downloads is immediately revoked</li>
            <li className="flex gap-3"><span className="text-[#C4A35A] font-bold shrink-0">•</span>No refund will be issued for a license terminated due to violation</li>
          </ul>
        </section>

        <section id="no-warranty">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">9. No Warranty on Engineering Designs</h2>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed">
            All Products are provided &quot;as is&quot; for the stated application context. Creato4 Technologies makes no warranty that any design is certified for industrial safety standards (e.g., IEC, UL, CE, BIS). It is the Licensee&apos;s sole responsibility to verify the design&apos;s fitness for any regulatory or safety-critical application before deployment.
          </p>
        </section>

      </div>
    </LegalLayout>
  );
}
