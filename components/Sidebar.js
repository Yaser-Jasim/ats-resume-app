'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'
import Avatar from '@/components/ui/Avatar'
import ResemyLogo from '@/components/ui/ResemyLogo'
import { ChevronDown, Menu, X } from 'lucide-react'

const items = [
  { label: 'New', href: '/app' },
  { label: 'Search & Downloads', href: '/history' },
  { label: 'Credit Usage', href: '/account/credits' },
  { label: 'For HR Managers', href: '/hr' },
  { label: 'Pricing', href: '/account/plans' },
  { label: 'Help', href: '/help' },
]

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <>
      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden fixed top-4 left-4 z-50 bg-white rounded-lg p-2 shadow-[0_2px_8px_-2px_rgba(20,36,61,0.25)] border border-gray-100"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-ink" />
        </button>
      )}

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/30 z-40"
        />
      )}

      <aside
        className={`fixed md:relative top-0 md:top-auto left-0 md:left-auto h-screen w-64 md:w-60 z-50 md:z-0
          border-r border-gray-100 bg-paper p-4 flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div>
          <div className="flex items-center justify-between mb-8 px-2">
          <Link href="/welcome" className="flex items-center gap-2">
          <ResemyLogo size={26} />
          <span className="font-display text-lg font-medium text-ink">Resemy</span>
          </Link>
            <button onClick={() => setMobileOpen(false)} className="md:hidden text-gray-400 hover:text-ink">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="space-y-1">
            {items.map(i => (
              <Link key={i.href} href={i.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm text-gray-600 hover:text-ink hover:bg-mist rounded-lg px-3 py-2 transition-colors">
                {i.label}
              </Link>
            ))}
          </nav>
        </div>
        <AccountMenu />
      </aside>
    </>
  )
}

function AccountMenu() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState(null)
  const router = useRouter()
  const supabase = createClient()
  const menuRef = useRef(null)

    useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null))
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const { data: profile } = await supabase.from('profiles').select('terms_accepted_at').eq('id', session.user.id).single()
        if (profile && !profile.terms_accepted_at) {
          await supabase.from('profiles').update({ terms_accepted_at: new Date().toISOString() }).eq('id', session.user.id)
        }
      }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function logout() {
    await supabase.auth.signOut()
    setOpen(false)
    router.push('/login')
  }

  const email = user?.email
  const photoUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture
  const name = user?.user_metadata?.full_name

  return (
    <div className="relative border-t border-gray-100 pt-3" ref={menuRef}>
      <button onClick={() => setOpen(!open)}
              className="flex items-center gap-2 w-full text-left rounded-lg px-2 py-2 hover:bg-mist transition-colors">
        <Avatar email={email} photoUrl={photoUrl} name={name} size={28} />
        <span className="text-sm text-ink truncate flex-1">{email || 'Not logged in'}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute bottom-14 left-0 bg-white border border-gray-100 rounded-xl shadow-[0_8px_24px_-8px_rgba(20,36,61,0.2)] w-52 py-1.5 text-sm z-10">
          {email ? (
            <>
              <a href="/account" className="block px-3.5 py-2 hover:bg-mist rounded-lg mx-1.5">Account Information</a>
              <a href="/account/plans" className="block px-3.5 py-2 hover:bg-mist rounded-lg mx-1.5">Subscription Plans</a>
              <a href="/account#location" className="block px-3.5 py-2 hover:bg-mist rounded-lg mx-1.5">Location (Address)</a>
              <a href="/help" className="block px-3.5 py-2 hover:bg-mist rounded-lg mx-1.5">Help Center</a>
              <a href="/feedback" className="block px-3.5 py-2 hover:bg-mist rounded-lg mx-1.5">Send Feedback</a>
              <button onClick={logout} className="block w-full text-left px-3.5 py-2 hover:bg-red-50 rounded-lg mx-1.5 text-red-600">Logout</button>
            </>
          ) : (
            <>
              <a href="/help" className="block px-3.5 py-2 hover:bg-mist rounded-lg mx-1.5">Help Center</a>
              <a href="/login" className="block px-3.5 py-2 hover:bg-mist rounded-lg mx-1.5 font-medium text-brand">Log in / Register</a>
            </>
          )}
        </div>
      )}
    </div>
  )
}