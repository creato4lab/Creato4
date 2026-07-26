import LegalLayout from '@/components/LegalLayout';

const sections = [
  { id: 'what-are-cookies', title: 'What Are Cookies' },
  { id: 'types', title: 'Cookies We Use' },
  { id: 'no-tracking', title: 'What We Don\'t Track' },
  { id: 'third-party', title: 'Third-Party Cookies' },
  { id: 'control', title: 'Your Cookie Controls' },
  { id: 'changes', title: 'Changes to This Policy' },
];

export const metadata = {
  title: 'Cookie Policy — Creato4 Lab',
  description: 'How Creato4 Lab uses cookies. We use only essential cookies for authentication and security. No advertising or tracking cookies.',
};

export default function CookiePolicyPage() {
  return (
    <LegalLayout
      title="Cookie Policy"
      subtitle="We believe in transparency about how we use cookies. Spoiler: we use very few, and none of them are for advertising or tracking your behaviour across the internet."
      lastUpdated="July 26, 2026"
      effectiveDate="July 26, 2026"
      sections={sections}
    >
      <div className="space-y-12">

        <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-sm text-green-800">
          <p className="font-bold mb-2">✓ Our Cookie Commitment</p>
          <p className="leading-relaxed">
            We use only <strong>essential cookies</strong> required for the platform to function. We do not use advertising cookies, cross-site tracking pixels, or third-party behavioural analytics. Your browsing habits outside of Creato4 Lab are none of our business.
          </p>
        </div>

        <section id="what-are-cookies">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">1. What Are Cookies</h2>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed">
            Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work more efficiently and to provide a better user experience. Cookies cannot run programs, deliver viruses, or access other information on your device. They simply store small pieces of data that the website reads on your next visit.
          </p>
        </section>

        <section id="types">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">2. Cookies We Use</h2>
          <p className="text-sm text-[#1A3C2F]/75 mb-5">We use only the following categories of cookies:</p>

          <div className="space-y-4">
            {[
              {
                name: 'Authentication Session Cookie',
                type: 'Strictly Necessary',
                purpose: 'Keeps you logged into your account as you navigate between pages. Without this cookie, you would need to log in on every page.',
                duration: 'Session (expires when you close the browser) or 30 days if you choose "Stay Logged In"',
                canDisable: false,
              },
              {
                name: 'CSRF Protection Token',
                type: 'Strictly Necessary',
                purpose: 'Protects your account from Cross-Site Request Forgery attacks — a security measure that prevents malicious websites from performing actions on your behalf.',
                duration: 'Session',
                canDisable: false,
              },
              {
                name: 'UI Preference Cookie',
                type: 'Functional',
                purpose: 'Remembers your preferences such as dark/light mode selection (if available) to improve your experience.',
                duration: '1 year',
                canDisable: true,
              },
            ].map((cookie) => (
              <div key={cookie.name} className="border border-[#1A3C2F]/10 rounded-2xl overflow-hidden">
                <div className="bg-[#1A3C2F]/5 px-5 py-3 flex items-center justify-between">
                  <p className="text-sm font-bold text-[#1A3C2F]">{cookie.name}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      cookie.type === 'Strictly Necessary'
                        ? 'bg-[#1A3C2F] text-[#FAF8F5]'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {cookie.type}
                    </span>
                    {!cookie.canDisable && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Required</span>
                    )}
                  </div>
                </div>
                <div className="px-5 py-4 space-y-2 text-sm">
                  <p className="text-[#1A3C2F]/70 leading-relaxed">{cookie.purpose}</p>
                  <p className="text-xs text-[#1A3C2F]/50">Duration: {cookie.duration}</p>
                  <p className="text-xs text-[#1A3C2F]/50">
                    Can be disabled: {cookie.canDisable
                      ? <span className="text-green-600">Yes</span>
                      : <span className="text-red-500">No — disabling this cookie will break site functionality</span>
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="no-tracking">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">3. What We Don&apos;t Track</h2>
          <div className="bg-[#1A3C2F] text-[#FAF8F5] rounded-2xl p-6 space-y-2">
            <p className="text-xs text-[#C4A35A] font-bold uppercase tracking-widest mb-3">We actively choose NOT to use:</p>
            {[
              'Google Analytics or similar third-party behavioral tracking',
              'Facebook Pixel or any social media retargeting pixels',
              'Advertising cookies or interest-based targeting',
              'Cross-site tracking that follows you around the internet',
              'Fingerprinting or device identification beyond session management',
              'Third-party chatbot cookies (e.g., Intercom, Drift)',
            ].map((item) => (
              <p key={item} className="text-sm flex gap-3">
                <span className="text-red-400">✗</span>
                <span className="text-[#FAF8F5]/80">{item}</span>
              </p>
            ))}
          </div>
        </section>

        <section id="third-party">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">4. Third-Party Cookies</h2>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed mb-4">
            When you interact with third-party services integrated into our platform, those services may set their own cookies:
          </p>
          <div className="space-y-3">
            {[
              {
                service: 'Google (OAuth Login)',
                purpose: 'If you sign in with Google, Google may set cookies to manage your Google session. These are governed by Google\'s Cookie Policy.',
                link: 'https://policies.google.com/technologies/cookies',
              },
              {
                service: 'Razorpay (Payment)',
                purpose: 'When you proceed to payment, Razorpay may set cookies for fraud prevention and session management on their payment page.',
                link: 'https://razorpay.com/privacy/',
              },
            ].map(({ service, purpose, link }) => (
              <div key={service} className="p-4 border border-[#1A3C2F]/10 rounded-xl">
                <p className="text-sm font-semibold text-[#1A3C2F] mb-1">{service}</p>
                <p className="text-xs text-[#1A3C2F]/65 mb-2 leading-relaxed">{purpose}</p>
                <a href={link} target="_blank" rel="noreferrer" className="text-xs text-[#C4A35A] hover:underline">View their Cookie Policy →</a>
              </div>
            ))}
          </div>
        </section>

        <section id="control">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">5. Your Cookie Controls</h2>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed mb-4">
            You have full control over cookies through your browser settings. Most browsers allow you to:
          </p>
          <ul className="space-y-2 text-sm text-[#1A3C2F]/75 mb-5">
            <li className="flex gap-3"><span className="text-[#C4A35A]">•</span>View all cookies stored by websites you visit</li>
            <li className="flex gap-3"><span className="text-[#C4A35A]">•</span>Delete specific or all cookies</li>
            <li className="flex gap-3"><span className="text-[#C4A35A]">•</span>Block third-party cookies</li>
            <li className="flex gap-3"><span className="text-[#C4A35A]">•</span>Set preferences for specific websites</li>
          </ul>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
            ⚠ Note: Disabling our essential cookies (authentication session and CSRF token) will prevent you from logging in and using the platform. We recommend only disabling non-essential cookies.
          </div>
        </section>

        <section id="changes">
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-4 pb-2 border-b border-[#1A3C2F]/10">6. Changes to This Policy</h2>
          <p className="text-sm text-[#1A3C2F]/75 leading-relaxed">
            We will update this Cookie Policy if we change our use of cookies. We will notify registered users via email before any changes take effect. The current version of this policy is always available at <strong>creato4lab.com/cookie-policy</strong>. If you have questions about our use of cookies, email us at <a href="mailto:creato4lab@gmail.com" className="text-[#C4A35A]">creato4lab@gmail.com</a>.
          </p>
        </section>

      </div>
    </LegalLayout>
  );
}
