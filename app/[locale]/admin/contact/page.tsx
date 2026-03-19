export default function ContactPage() {
  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-on-surface">Contact</h1>
        <p className="text-sm text-on-surface/60 mt-1">Admin support resources and platform legal documents.</p>
      </div>

      {/* Support Email */}
      <div className="bg-surface-container-lowest border border-outline/20 rounded-2xl p-6 mb-4 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">
            ✉️
          </div>
          <div>
            <h2 className="font-semibold text-on-surface text-sm">Support Email</h2>
            <p className="text-xs text-on-surface/60">Reach the platform support team</p>
          </div>
        </div>
        <a
          href="mailto:support@pawtaker.com"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
        >
          support@pawtaker.com
        </a>
      </div>

      {/* Legal Documents */}
      <div className="bg-surface-container-lowest border border-outline/20 rounded-2xl p-6 mb-4 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-10 rounded-xl bg-tertiary/10 flex items-center justify-center text-xl">
            📄
          </div>
          <div>
            <h2 className="font-semibold text-on-surface text-sm">Legal Documents</h2>
            <p className="text-xs text-on-surface/60">Platform policies and terms</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="/en/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline/30 text-sm font-medium text-on-surface hover:bg-surface-container transition-colors"
          >
            <span>🔒</span> Privacy Policy
          </a>
          <a
            href="/en/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline/30 text-sm font-medium text-on-surface hover:bg-surface-container transition-colors"
          >
            <span>📋</span> Terms of Service
          </a>
        </div>
      </div>

      {/* Contact Form (stub) */}
      <div className="bg-surface-container-lowest border border-outline/20 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-10 rounded-xl bg-secondary/10 flex items-center justify-center text-xl">
            💬
          </div>
          <div>
            <h2 className="font-semibold text-on-surface text-sm">Contact Form</h2>
            <p className="text-xs text-on-surface/60">Send a message to the platform team</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-on-surface/60 mb-1">Subject</label>
            <input
              type="text"
              disabled
              placeholder="e.g. Billing issue, technical support..."
              className="w-full bg-background-base border border-outline/20 rounded-xl px-4 py-2.5 text-sm text-on-surface/40 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-on-surface/60 mb-1">Message</label>
            <textarea
              disabled
              rows={4}
              placeholder="Describe your issue or question..."
              className="w-full bg-background-base border border-outline/20 rounded-xl px-4 py-2.5 text-sm text-on-surface/40 cursor-not-allowed resize-none"
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-on-surface/40">Contact form integration coming soon.</p>
            <button
              disabled
              className="px-5 py-2.5 rounded-xl bg-primary/30 text-on-primary/50 text-sm font-medium cursor-not-allowed"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
