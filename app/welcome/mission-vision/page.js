import BackButton from '@/components/ui/BackButton'

const VALUES = [
  { title: 'Honesty', desc: "We'll show you a real gap before we'll give you a fake score." },
  { title: 'Authenticity', desc: 'We rewrite what\'s true about you. We never invent what isn\'t.' },
  { title: 'Transparency', desc: 'You see exactly what changed and why. Nothing is a black box.' },
  { title: 'Empathy', desc: 'Passing the ATS matters because a human being is waiting on the other side of it.' },
]

export default function MissionVisionPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <BackButton />
      <h1 className="font-display text-3xl font-semibold text-ink mb-2">Mission & Vision</h1>
      <p className="text-sm text-gray-500 mb-10">What we're building, and why.</p>

      <section className="mb-10">
        <h2 className="font-display text-xl font-semibold text-ink mb-3">Our Mission</h2>
        <p className="text-gray-600 leading-relaxed text-justify">
          Somewhere between hitting "apply" and never hearing back, a real person who could do the job
          gets filtered out by software that never really looked at them. We built Resemy to close that
          gap, not by gaming the system, but by helping you say what's true about you in the language
          the system is actually listening for.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-xl font-semibold text-ink mb-3">Our Vision</h2>
        <p className="text-gray-600 leading-relaxed text-justify">
          We believe in a future where no qualified person goes unseen, where the résumé that gets read
          is the honest one, not just the optimized one. Good people keep getting missed over formatting
          and phrasing, and we don't accept that as the cost of hiring. We're betting on transparency to
          fix it, not tricks.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-xl font-semibold text-ink mb-3">Our Objective</h2>
        <p className="text-gray-600 leading-relaxed text-justify">
          Right now, that means one thing: every résumé, cover letter, and application that goes through
          Resemy should leave you more visible to a hiring manager than you were before without a
          single invented skill, job, or achievement in it. We measure ourselves by your before-and-after
          score, not by promises. If we can't honestly close a gap, we'll tell you it's still open.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-4">Our Values</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {VALUES.map(v => (
            <div key={v.title} className="border border-gray-100 rounded-xl p-4">
              <p className="font-medium text-ink mb-1">{v.title}</p>
              <p className="text-sm text-gray-600">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}