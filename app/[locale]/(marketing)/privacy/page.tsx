import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — PawTaker',
  description: 'PawTaker Privacy Policy and data practices.',
};

export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-primary mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-10">Last updated: {new Date().toLocaleDateString('en-US')}</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
        <section>
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">1. Information We Collect</h2>
          <p>
            We collect information you provide when you sign up (email, name, profile details), when you add pets
            or post care requests, and when you communicate with other users. We also collect identity verification
            (KYC) documents and related data to maintain a trusted community.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">2. How We Use Your Information</h2>
          <p>
            We use your information to operate the Platform, match you with other users, process KYC, enforce our
            terms, and send service-related communications. We do not sell your personal data to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">3. Sharing With Others</h2>
          <p>
            Your profile (name, photo, general location if you choose) may be visible to other verified users to
            facilitate care arrangements. We may share data with service providers (e.g. hosting, analytics) under
            strict agreements. We may disclose information when required by law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">4. Data Security</h2>
          <p>
            We use industry-standard measures to protect your data. Identity documents and sensitive data are
            stored securely and used only for verification and safety purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">5. Your Rights</h2>
          <p>
            Depending on your location, you may have the right to access, correct, delete, or port your data, and
            to object to or restrict certain processing. Contact us to exercise these rights.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">6. Cookies and Similar Technologies</h2>
          <p>
            We use cookies and similar technologies for authentication, preferences, and analytics on our website
            and in our apps, in line with this policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of material changes via the
            Platform or email where appropriate.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">8. Contact</h2>
          <p>
            For privacy-related questions or requests, contact us at the support address provided in the app or
            on our website.
          </p>
        </section>
      </div>
    </main>
  );
}
