'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'
import Avatar from '@/components/ui/Avatar'
import ResemyLogo from '@/components/ui/ResemyLogo'
import { ChevronDown, Menu, X, Home, PanelLeftClose, PanelLeftOpen, ExternalLink } from 'lucide-react'

// Public BC Registries record for Resemy Solutions — linked from the
// sidebar disclaimer so anyone can verify the registration themselves.
const ORGBOOK_URL = 'https://orgbook.gov.bc.ca/entity/FM1119584/type/registration.registries.ca'

const items = [
  { label: 'New', href: '/app' },
  { label: 'Search & Downloads', href: '/history' },
  { label: 'Credit Usage', href: '/account/credits' },
  { label: 'For HR Managers', href: '/hr' },
  { label: 'Pricing', href: '/account/plans' },
  { label: 'Help', href: '/help' },
]

// Where "Home" in the sidebar takes you — the marketing site, not the app.
const MAIN_SITE_HREF = '/welcome'

// Desktop-only collapse state, remembered across visits until the user
// shows the sidebar again. Mobile is unaffected — it keeps its existing
// open/close drawer behavior regardless of this.
const COLLAPSE_STORAGE_KEY = 'resemy_sidebar_collapsed'

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    try {
      if (localStorage.getItem(COLLAPSE_STORAGE_KEY) === 'true') setCollapsed(true)
    } catch {
      // localStorage unavailable (private browsing, blocked storage, etc.) —
      // fall back to always-expanded rather than breaking the sidebar.
    }
  }, [])

  function toggleCollapsed() {
    setCollapsed(prev => {
      const next = !prev
      try {
        localStorage.setItem(COLLAPSE_STORAGE_KEY, String(next))
      } catch {
        // Ignore — state still updates for this session even if it can't persist.
      }
      return next
    })
  }

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
        className={`fixed md:relative top-0 md:top-auto left-0 md:left-auto h-dvh z-50 md:z-0
          border-r border-gray-100 bg-paper p-4 flex flex-col justify-between
          transform transition-all duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
          ${collapsed ? 'w-64 md:w-16' : 'w-64 md:w-60'}`}
      >
        <div>
          <div
            className={`flex items-center mb-8 px-2 gap-2
              ${collapsed ? 'md:flex-col md:items-center' : 'justify-between'}`}
          >
            <Link href="/welcome" className="flex items-center gap-2" aria-label="Resemy">
              <ResemyLogo size={26} />
              <span className={`font-display text-lg font-medium text-ink ${collapsed ? 'md:hidden' : ''}`}>
                Resemy
              </span>
            </Link>

            <div className={`flex items-center gap-1 ${collapsed ? 'md:flex-col' : ''}`}>
              <Link
                href={MAIN_SITE_HREF}
                title="Go to main website"
                aria-label="Go to main website"
                className="flex items-center justify-center text-gray-400 hover:text-ink hover:bg-mist rounded-lg p-1.5 transition-colors"
              >
                <Home className="w-4 h-4" />
              </Link>
              <button
                onClick={toggleCollapsed}
                title={collapsed ? 'Show sidebar' : 'Hide sidebar'}
                aria-label={collapsed ? 'Show sidebar' : 'Hide sidebar'}
                className="hidden md:flex items-center justify-center text-gray-400 hover:text-ink hover:bg-mist rounded-lg p-1.5 transition-colors"
              >
                {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
              </button>
              <button onClick={() => setMobileOpen(false)} className="md:hidden text-gray-400 hover:text-ink">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <nav className={`space-y-1 ${collapsed ? 'md:hidden' : ''}`}>
            {items.map(i => (
              <Link key={i.href} href={i.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm text-gray-600 hover:text-ink hover:bg-mist rounded-lg px-3 py-2 transition-colors">
                {i.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className={collapsed ? 'md:hidden' : ''}>
          <AccountMenu />
          <p className="text-[10px] text-gray-400 text-left mt-2 px-2">Resemy Solutions (Resemy) is a registered business in British Columbia, Canada.</p>
          <a href={ORGBOOK_URL} target="_blank" rel="noopener noreferrer"
             className="flex items-center justify-start gap-1 text-[10px] text-gray-400 hover:text-ink mt-1 px-2 transition-colors">
            Verify business registration
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <p className="text-[10px] text-gray-400 text-left mt-2 px-2">© {new Date().getFullYear()} Resemy Solutions. All rights reserved.</p>
          <p className="text-[10px] text-gray-400 text-left mt-1 px-2">Resemy™ is a product of Resemy Solutions.</p>
        </div>
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
  const firstName = user?.user_metadata?.first_name
  const lastName = user?.user_metadata?.last_name
  const name = user?.user_metadata?.full_name || [firstName, lastName].filter(Boolean).join(' ') || null

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
              {name && (
                <div className="px-3.5 py-2 text-sm font-semibold text-ink border-b border-gray-100 mb-1 truncate">{name}</div>
              )}
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