import BackButton from '@/components/ui/BackButton'

export default function PrivacyPage() {
  return (
      <div className="max-w-3xl mx-auto px-6 py-16 prose-sm text-justify">
      <BackButton />
      <h1 className="text-3xl font-semibold mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: September/2026 </p>

      <p className="mb-4">
        This Privacy Policy explains how Resemy Solutions ("we," "us," "our") collects, uses, and shares
        information when you use Resemy (the "Service").
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">1. Information We Collect</h2>
      <p className="mb-2 font-medium">Account information</p>
      <p className="mb-4">Email address, name, and (if you sign in with Google) basic profile information from your Google account.</p>

      <p className="mb-2 font-medium">Content you submit</p>
      <p className="mb-4">
        Resume and cover letter files or text, job descriptions, position titles, organization names, and any
        location, phone, or contact details you enter. If you use the HR evaluation feature, this also includes
        the resume and cover letter of the candidate you are evaluating, and any information in those documents
        about that candidate.
      </p>

      <p className="mb-2 font-medium">Generated content</p>
      <p className="mb-4">Tailored resumes, cover letters, application emails, interview preparation content, reference letter drafts, scores, and evaluation results we generate for you, which we store so you can access your history.</p>

      <p className="mb-2 font-medium">Billing information</p>
      <p className="mb-4">
        We do not store your full payment card details ourselves. Payment is processed by Stripe, which collects
        and stores billing information under its own privacy policy.
      </p>

      <p className="mb-2 font-medium">Usage information</p>
      <p className="mb-4">Basic technical information such as login timestamps and general usage of features, for security and product improvement purposes.</p>

      <h2 className="text-xl font-semibold mt-8 mb-2">2. How We Use Information</h2>
      <ul className="list-disc ml-6 mb-4 space-y-1">
        <li>To provide, operate, and maintain the Service, including generating tailored resumes, cover letters, emails, interview preparation content, reference letter drafts, and evaluations;</li>
        <li>To process payments and manage subscriptions;</li>
        <li>To communicate with you about your account or the Service;</li>
        <li>To maintain security and prevent abuse of free-tier usage;</li>
        <li>To improve and troubleshoot the Service.</li>
      </ul>
      <p className="mb-4">We do not sell your personal information.</p>

      <h2 className="text-xl font-semibold mt-8 mb-2">3. AI Processing</h2>
      <p className="mb-4">
        To generate tailored content and evaluations, resume text, cover letter text, and job description text you
        submit are sent to the provider of the AI models we use for processing. This processing is
        used to generate a response to your request and is subject to Anthropic's own data handling terms as our
        service provider.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">4. Service Providers We Use</h2>
      <p className="mb-4">We share information with the following service providers, solely to operate the Service:</p>
        <ul className="list-disc ml-6 mb-4 space-y-1">
        <li><strong>Supabase</strong> — database, authentication, and file storage;</li>
        <li><strong>Anthropic</strong> — AI processing of submitted resume, cover letter, and job description text;</li>
        <li><strong>Stripe</strong> — payment processing and subscription billing;</li>
        <li><strong>Google</strong> — optional sign-in authentication, if you choose to use "Continue with Google," and Google Analytics for website usage analytics;</li>
        <li><strong>Vercel</strong> — application hosting, and Vercel Analytics / Speed Insights for website usage and performance analytics.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">5. If You Are a Candidate Evaluated by an HR User</h2>
      <p className="mb-4">
        If someone else (an employer, recruiter, or hiring manager using the Service) submits your resume or cover
        letter for evaluation, your information is processed on that user's instructions, as described above.
        We require HR users of the Service to confirm they have a lawful basis to submit a candidate's information.
        If you are a candidate and have questions about information submitted about you, we recommend contacting
        the organization that evaluated you directly; you may also contact us at info@getresemy.com.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">6. Data Retention</h2>
      <p className="mb-4">
        We retain your account information and generation history for as long as your account is active, so you
        can access your past resumes, cover letters, interview preparation content, reference letter drafts, and evaluations. You can request deletion of your account and
        associated data at any time by contacting us at info@getresemy.com.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">7. Your Rights</h2>
      <p className="mb-4">
        Depending on where you live, you may have rights to access, correct, or delete your personal information,
        or to object to certain processing. To exercise these rights, contact us at info@getresemy.com. We will
        respond in accordance with applicable law.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">8. Cookies</h2>
      <p className="mb-4">
        We use essential cookies required for login and core functionality (managed through Supabase
        authentication). We also use Google Analytics and Vercel Analytics to understand how visitors use the
        Service and to monitor site performance. These analytics tools may set cookies or use similar tracking
        technologies. If we add marketing cookies in the future, we will update this policy accordingly.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">9. Children's Privacy</h2>
      <p className="mb-4">
        The Service is not directed to individuals under 18, and we do not knowingly collect personal information
        from children.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">10. International Users</h2>
      <p className="mb-4">
        Our service providers may process and store information in countries other than your own, including the
        United States and Canada. By using the Service, you consent to this transfer and processing.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">11. Security</h2>
      <p className="mb-4">
        We use reasonable technical measures, including database access controls (row-level security) and
        encrypted connections, to protect your information. No method of transmission or storage is 100% secure,
        and we cannot guarantee absolute security.
      </p>
      <p className="mb-4">
        If we become aware of a security breach that creates a real risk of significant harm to you, we will
        notify affected users and any applicable regulatory authorities without unreasonable delay, as required
        by applicable law.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">12. Changes to This Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. Material changes will be communicated as described in
        our Terms of Service.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">13. Contact</h2>
      <p className="mb-4">Questions about this policy can be sent to info@getresemy.com.</p>
    </div>
  )
}