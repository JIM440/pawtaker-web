import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — PawTaker',
  description: 'PawTaker Terms of Service and usage rules.',
};

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-primary mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-10">Last updated: {new Date().toLocaleDateString('en-US')}</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
        <section>
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using PawTaker (&quot;the Platform&quot;), you agree to be bound by these Terms of Service.
            If you do not agree, do not use the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">2. Description of Service</h2>
          <p>
            PawTaker is a community-based pet care platform where users exchange pet care using a points system.
            We do not process payments; care is exchanged on a non-monetary, points-based basis.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">3. Eligibility</h2>
          <p>
            You must be at least 18 years old and able to form a binding contract. You must complete identity
            verification (KYC) before offering or requesting care. You are responsible for ensuring your use of
            the Platform complies with local laws.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">4. Points and Conduct</h2>
          <p>
            Points have no cash value and cannot be exchanged for money. You must not abuse the system, harass
            other users, or misrepresent yourself or your pets. We may suspend or terminate accounts that violate
            these terms or our community guidelines.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">5. Limitation of Liability</h2>
          <p>
            PawTaker is provided &quot;as is.&quot; We are not liable for any harm to users, pets, or property arising from
            arrangements made through the Platform. Pet care is arranged directly between users; we do not
            employ or guarantee sitters.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">6. Changes</h2>
          <p>
            We may update these terms from time to time. Continued use of the Platform after changes constitutes
            acceptance. Material changes will be communicated via the app or email where possible.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">7. Contact</h2>
          <p>
            For questions about these Terms of Service, contact us at the support address provided in the app
            or on our website.
          </p>
        </section>
      </div>
    </main>
  );
}
