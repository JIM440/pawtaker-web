export default function LandingPage() {
  return (
    <main>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold text-primary mb-6 leading-tight">
          Pet Care, Powered by Community
        </h1>
        <p className="text-xl text-on-surface/80 mb-10 max-w-2xl mx-auto">
          Connect with trusted pet sitters in your neighbourhood. Earn and spend points — no money involved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="#"
            className="bg-primary text-on-primary px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity"
          >
            Get Started Free
          </a>
          <a
            href="/how-it-works"
            className="border border-primary text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-container/50 transition-colors"
          >
            How it works
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="bg-background-base py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">Why PawTaker?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🛡️',
                title: 'Verified Community',
                desc: 'Every sitter is ID-verified before they can offer care.',
              },
              {
                icon: '⭐',
                title: 'Points, Not Money',
                desc: 'A fair barter system where everyone helps each other.',
              },
              {
                icon: '📸',
                title: 'Real-time Check-ins',
                desc: 'Get photo updates while your pet is being cared for.',
              },
            ].map((f) => (
              <div key={f.title} className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-frame-stroke">
                <span className="text-4xl mb-4 block">{f.icon}</span>
                <h3 className="text-xl font-semibold text-on-surface mb-2">{f.title}</h3>
                <p className="text-on-surface/80">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
