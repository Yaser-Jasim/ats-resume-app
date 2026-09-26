import BackButton from '@/components/ui/BackButton'
import { ExternalLink, GraduationCap } from 'lucide-react'

// Add teammates here. Replace `photo: null` with an image path once you send it
// (e.g. '/team/yaser.jpg' in your /public folder), and fill in `bio` and `links`.
const TEAM = [
  {
    name: 'Yaser Jasim',
    title: 'Owner and Founder of Resemy Solutions',
    company: 'Resemy',
    email: 'admin@resemysolutions.com', // update if this isn't the right address
    photo: '/team/yaser.jpg',
    bio: [
      "Yaser Jasim holds a Master of Software Engineering from Mosul University and a Master of Administrative Science, specializing in Human Resources Administration, from Fairleigh Dickinson University in Canada.",
      "Throughout his career, Yaser has taken on diverse roles including University Lecturer, Instructor, Associate Director, Interim Director, Recruiter, and Researcher, building experience across technology, education, administration, human resources, business, and research.",
      "Today, Yaser is the Owner and Founder of Resemy Solutions, a British Columbia-based software publishing company focused on creating practical software-as-a-service tools that solve real-world problems. Resemy is the company's first software tool, with more innovative products planned for the future.",
      "Yaser combines his technical background, academic experience, and understanding of people and business to turn ideas into useful technology. His philosophy is simple: build technology that is practical, accessible, easier, and valuable to the people who use it.",
    ],
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yaser-jasim/?isSelfProfile=true', icon: 'linkedin' },
      { label: 'Google Scholar', href: 'https://scholar.google.ca/citations?user=5hjp1DoAAAAJ&hl=en', icon: 'scholar' },
    ],
  },
]

function LinkIcon({ icon }) {
  if (icon === 'scholar') return <GraduationCap className="w-4 h-4" />
  return <ExternalLink className="w-4 h-4" />
}

export default function TeamPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <BackButton />
      <h1 className="font-display text-3xl font-semibold text-ink mb-2">Our Team</h1>
      <p className="text-sm text-gray-500 mb-10">The people behind Resemy.</p>

      <div className="space-y-8">
        {TEAM.map(member => (
          <div key={member.name} className="flex flex-col sm:flex-row gap-8 border border-gray-100 rounded-2xl p-8">
            <div className="sm:w-80 flex-shrink-0">
              <div className="w-44 h-44 rounded-xl bg-mist flex items-center justify-center overflow-hidden">
                {member.photo ? (
                  <img src={member.photo} alt={member.name} className="w-full h-full object-cover object-top" />
                ) : (
                  <span className="text-gray-400 text-sm">Photo</span>
                )}
              </div>
              <div className="mt-4">
                <p className="font-display text-lg font-medium text-ink">{member.name}</p>
                <p className="text-sm text-gray-600 whitespace-nowrap">{member.title}</p>
                <p className="text-sm text-gray-500 mt-1">{member.company}</p>
                <a href={`mailto:${member.email}`} className="text-sm text-brand hover:underline mt-1 inline-block whitespace-nowrap">
                  {member.email}
                </a>
                <div className="mt-4 flex items-center gap-3">
                  <img src="/team/resemy-logo.png" alt="Resemy" className="h-8 w-auto" />
                  <img src="/team/resemy-solutions-seal.png" alt="Resemy Solutions" className="h-12 w-auto" />
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div>
                <p className="text-sm font-medium text-black uppercase tracking-wide mb-1">Bio</p>
                <div className="space-y-3">
                  {member.bio.map((paragraph, i) => (
                    <p
                      key={i}
                      className={`text-base text-gray-600 leading-relaxed text-justify ${
                        paragraph.includes('His philosophy is simple') ? 'font-bold' : ''
                      }`}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {member.links?.length > 0 && (
                <div className="mt-4 flex gap-4">
                  {member.links.map(l => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 hover:text-ink flex items-center gap-1.5"
                    >
                      <LinkIcon icon={l.icon} />
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}