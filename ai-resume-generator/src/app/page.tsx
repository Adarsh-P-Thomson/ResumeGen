import ResumeForm from '@/components/ResumeForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                AI Resume Generator
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Harvard-style, recruiter-grade resumes in seconds
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                PDF
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                DOCX
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                TXT
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-blue-800">
                Tips for a Great Resume
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Use action verbs (Led, Built, Optimized, Increased)</li>
                  <li>Include metrics and numbers (40% faster, $1M revenue, 500+ users)</li>
                  <li>Keep it to 1 page</li>
                  <li>Tailor content to the job description</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Form */}
        <ResumeForm />

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            All data stays in your browser. No information is stored on our servers.
          </p>
          <p className="mt-1">
            Generate professional, ATS-friendly resumes in Harvard format.
          </p>
        </div>
      </main>
    </div>
  );
}
