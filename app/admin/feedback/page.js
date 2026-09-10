import { createServerClient } from '@/lib/supabaseServer'
import { createRouteClient } from '@/lib/supabaseRouteClient'

export default async function AdminFeedbackPage() {
  const routeClient = await createRouteClient()
  const { data: { user } } = await routeClient.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return <div className="p-8 text-sm">Not authorized.</div>
  }

  const supabase = createServerClient()
  const { data: feedback } = await supabase.from('feedback').select('*').order('created_at', { ascending: false })

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-4">
      <h1 className="text-2xl font-semibold">User Feedback</h1>
      <div className="divide-y">
        {feedback?.length === 0 && <p className="text-sm text-gray-500">No feedback yet.</p>}
        {feedback?.map(f => (
          <div key={f.id} className="py-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{f.user_email || 'Unknown user'}</span>
              <span>{new Date(f.created_at).toLocaleString()}</span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{f.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}