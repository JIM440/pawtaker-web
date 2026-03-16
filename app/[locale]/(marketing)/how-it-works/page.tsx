export default function HowItWorksPage() {
  const steps = [
    { number: '01', title: 'Create your profile', desc: 'Sign up and get your identity verified to join the trusted community.' },
    { number: '02', title: 'Post or browse', desc: 'Post a care request for your pet, or offer your availability as a sitter.' },
    { number: '03', title: 'Match & agree', desc: 'Chat with potential matches, agree on terms, and sign a simple digital contract.' },
    { number: '04', title: 'Care & earn', desc: 'Provide care with real-time check-ins. Earn or spend points when it\'s done.' },
  ];

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-primary mb-4">How It Works</h1>
      <p className="text-lg text-on-surface/80 mb-12">Four simple steps to get started.</p>
      <div className="space-y-8">
        {steps.map((step) => (
          <div key={step.number} className="flex gap-6 items-start">
            <span className="text-3xl font-bold text-primary w-12 shrink-0">{step.number}</span>
            <div>
              <h3 className="text-xl font-semibold text-on-surface mb-1">{step.title}</h3>
              <p className="text-on-surface/80">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
