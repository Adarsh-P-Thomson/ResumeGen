import ResumeForm from '@/components/ResumeForm';
import Link from 'next/link';

export default function GeneratePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="text-2xl font-bold text-gray-900">ResumeGen</div>
              <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded">FREE</span>
            </Link>
            <div className="hidden sm:flex items-center space-x-2 text-xs text-gray-600">
              <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full font-medium">
                PDF
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-medium">
                DOCX
              </span>
              <span className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full font-medium">
                TXT
              </span>
              <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full font-medium">
                HTML
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                ✨ Pro Tips for a Standout Resume
              </h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p>• Use strong action verbs: Led, Built, Optimized, Increased</p>
                <p>• Quantify achievements: 40% faster, $1M revenue, 500+ users</p>
                <p>• Keep it concise: 1 page for most positions</p>
                <p>• Use AI refinement to tailor content to specific job descriptions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Form */}
        <ResumeForm />

        {/* Footer Info */}
        <div className="mt-12 text-center space-y-3">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>All data stays in your browser. Complete privacy guaranteed.</span>
          </div>
          <p className="text-xs text-gray-500">
            Professional ATS-optimized resumes in Harvard format • Export as PDF, DOCX, TXT, or HTML
          </p>
        </div>
      </main>
    </div>
  );
}
