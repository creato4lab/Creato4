import LegalLayout from '@/components/LegalLayout';

const sections = [
  { id: 'general', title: 'General Disclaimer' },
  { id: 'professional-advice', title: 'Not Professional Advice' },
  { id: 'accuracy', title: 'Accuracy of Information' },
  { id: 'external-links', title: 'External Links' },
  { id: 'product-results', title: 'Product & Project Results' },
  { id: 'student-projects', title: 'Student Project Blueprints' },
  { id: 'testimonials', title: 'Testimonials & Case Studies' },
  { id: 'limitation', title: 'Limitation of Liability' },
  { id: 'changes', title: 'Changes to Disclaimer' },
  { id: 'contact', title: 'Contact Us' },
];

export const metadata = {
  title: 'Disclaimer — Creato4 Lab',
  description: 'Legal disclaimer for Creato4 Lab website, products, and services. Read our terms regarding liability, accuracy, and external content.',
};

export default function DisclaimerPage() {
  return (
    <LegalLayout
      title="Disclaimer"
      subtitle="This disclaimer outlines the limitations and legal guidelines governing the use of the Creato4 Lab website and its content."
      lastUpdated="July 26, 2026"
      effectiveDate="July 26, 2026"
      sections={sections}
    >
      <div className="space-y-12">
        {/* 1 — General Disclaimer */}
        <section id="general">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4">1. General Disclaimer</h2>
          <p className="text-sm text-[#3a5a4a] leading-relaxed mb-3">
            The information provided on the Creato4 Lab website (<strong>creato4.com</strong>) is for general informational and educational purposes only. While we strive to keep the information current and accurate, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the website or its content.
          </p>
          <p className="text-sm text-[#3a5a4a] leading-relaxed">
            Any reliance you place on such information is strictly at your own risk. Creato4 Lab shall not be held liable for any loss or damage arising from the use of this website.
          </p>
        </section>

        {/* 2 — Not Professional Advice */}
        <section id="professional-advice">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4">2. Not Professional Advice</h2>
          <p className="text-sm text-[#3a5a4a] leading-relaxed mb-3">
            Content on this website — including project descriptions, technical specifications, engineering approaches, and product information — does not constitute professional engineering, legal, financial, or safety advice.
          </p>
          <p className="text-sm text-[#3a5a4a] leading-relaxed">
            For specific projects, always consult with qualified professionals and adhere to applicable safety standards, regulations, and local laws before implementing any design, circuit, firmware, or mechanical system.
          </p>
        </section>

        {/* 3 — Accuracy of Information */}
        <section id="accuracy">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4">3. Accuracy of Information</h2>
          <p className="text-sm text-[#3a5a4a] leading-relaxed">
            While we make every effort to ensure the accuracy of technical specifications, pricing, availability, and project outcomes listed on this website, errors may occur. Creato4 Lab reserves the right to correct any errors and to update information without prior notice. Product prices, features, and availability are subject to change at any time.
          </p>
        </section>

        {/* 4 — External Links */}
        <section id="external-links">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4">4. External Links</h2>
          <p className="text-sm text-[#3a5a4a] leading-relaxed">
            This website may contain links to external websites or third-party resources. These links are provided for convenience and informational purposes only. Creato4 Lab has no control over the content, privacy policies, or practices of these external sites and accepts no responsibility or liability for them. Inclusion of any external link does not imply endorsement.
          </p>
        </section>

        {/* 5 — Product & Project Results */}
        <section id="product-results">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4">5. Product & Project Results</h2>
          <p className="text-sm text-[#3a5a4a] leading-relaxed">
            Project outcomes, performance metrics, cost estimates, and results described on this website are based on specific prototypes, testing environments, and controlled conditions. Actual results may vary depending on implementation, components used, environmental conditions, user skill level, and other factors. Past project results do not guarantee identical outcomes for future projects.
          </p>
        </section>

        {/* 6 — Student Project Blueprints */}
        <section id="student-projects">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4">6. Student Project Blueprints</h2>
          <p className="text-sm text-[#3a5a4a] leading-relaxed mb-3">
            Digital engineering products sold through our platform (including source code, CAD files, PCB schematics, and documentation) are provided &quot;as is&quot; for educational and reference purposes.
          </p>
          <p className="text-sm text-[#3a5a4a] leading-relaxed">
            Buyers are responsible for verifying the suitability, safety, and compliance of any designs before implementation. Creato4 Lab is not liable for any damages, injuries, or losses resulting from the use or misuse of purchased blueprints.
          </p>
        </section>

        {/* 7 — Testimonials & Case Studies */}
        <section id="testimonials">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4">7. Testimonials & Case Studies</h2>
          <p className="text-sm text-[#3a5a4a] leading-relaxed">
            Testimonials, case studies, and achievement claims displayed on this website reflect the genuine experiences and outcomes of specific projects. However, individual results may vary. Achievements such as grants, awards, and recognition are accurately represented to the best of our knowledge as of the dates mentioned.
          </p>
        </section>

        {/* 8 — Limitation of Liability */}
        <section id="limitation">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4">8. Limitation of Liability</h2>
          <p className="text-sm text-[#3a5a4a] leading-relaxed">
            To the fullest extent permitted by applicable law, Creato4 Lab, its founders, team members, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill, arising from the use of or inability to use this website, its products, or services.
          </p>
        </section>

        {/* 9 — Changes to Disclaimer */}
        <section id="changes">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4">9. Changes to This Disclaimer</h2>
          <p className="text-sm text-[#3a5a4a] leading-relaxed">
            Creato4 Lab reserves the right to modify this disclaimer at any time without prior notice. Changes will be effective immediately upon posting to this page. We encourage you to review this page periodically for any updates.
          </p>
        </section>

        {/* 10 — Contact Us */}
        <section id="contact">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4">10. Contact Us</h2>
          <p className="text-sm text-[#3a5a4a] leading-relaxed mb-3">
            If you have any questions about this disclaimer, please contact us:
          </p>
          <div className="bg-[#F5F0EA] rounded-xl p-5 text-sm text-[#1A3C2F] space-y-1">
            <p><strong>Creato4 Lab</strong></p>
            <p>Email: <a href="mailto:creato4lab@gmail.com" className="underline hover:text-[#C4A35A] transition-colors">creato4lab@gmail.com</a></p>
            <p>Website: <a href="https://creato4.com" className="underline hover:text-[#C4A35A] transition-colors">creato4.com</a></p>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
