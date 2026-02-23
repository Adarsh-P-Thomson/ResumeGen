import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200/50 sticky top-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl font-extrabold bg-gradient-to-r from-sky-500 to-blue-500 bg-clip-text text-transparent">
                ResumeGen
              </div>
              <span className="px-2.5 py-1 text-xs font-bold bg-gradient-to-r from-sky-400 to-cyan-400 text-white rounded-full shadow-sm">
                FREE
              </span>
            </div>
            <Link 
              href="/generate"
              className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg btn-hover-lift"
            >
              Create Resume
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-sky-50/30 to-white">
        {/* Animated background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-sky-300/20 to-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-cyan-300/20 to-sky-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 sm:pt-28 sm:pb-36 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="animate-slideInUp">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-sky-500/10 to-blue-500/10 backdrop-blur-sm border border-sky-200/50 px-4 py-2 rounded-full text-sm font-semibold mb-8 shadow-sm">
                <span className="text-xl">✨</span>
                <span className="gradient-text">AI-Powered Resume Builder</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight">
                Build a resume<br />that gets you
                <span className="block mt-2 gradient-text"> hired faster</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed font-medium">
                Create a professional Harvard-format resume in minutes.<br />
                <span className="text-gray-500">Optimized for recruiters, powered by AI, completely free.</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link
                  href="/generate"
                  className="group px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-500 text-white text-lg font-semibold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center btn-hover-lift"
                >
                  Create Resume — It&apos;s Free
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="#features"
                  className="px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-xl hover:bg-gray-50 transition-all border-2 border-gray-200 hover:border-gray-300 inline-flex items-center justify-center"
                >
                  Learn More
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center space-x-2 text-gray-700">
                  <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium">No sign up required</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium">100% free forever</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium">ATS-optimized</span>
                </div>
              </div>
            </div>

            {/* Right Visual - Resume Preview Mockup */}
            <div className="relative lg:block hidden">
              <div className="relative animate-slideInUp" style={{ animationDelay: '0.2s' }}>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-80 h-80 bg-gradient-to-br from-sky-300/30 to-blue-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-80 animate-pulse"></div>
                <div className="absolute -bottom-8 -left-4 w-80 h-80 bg-gradient-to-br from-cyan-300/30 to-sky-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-80 animate-pulse" style={{ animationDelay: '1s' }}></div>

                {/* Resume mockup */}
                <div className="relative bg-white rounded-3xl shadow-2xl p-10 border border-gray-200/50 transform rotate-2 hover:rotate-0 transition-all duration-500 hover:shadow-sky-200/50 hover:scale-105">
                  <div className="space-y-5">
                    <div className="h-8 bg-gradient-to-r from-gray-900 to-gray-700 rounded-lg w-3/4 shadow-sm"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-400 to-gray-300 rounded w-1/2"></div>
                    <div className="pt-6 space-y-2.5">
                      <div className="h-2.5 bg-gradient-to-r from-gray-300 to-gray-200 rounded-full w-full"></div>
                      <div className="h-2.5 bg-gradient-to-r from-gray-300 to-gray-200 rounded-full w-11/12"></div>
                      <div className="h-2.5 bg-gradient-to-r from-gray-300 to-gray-200 rounded-full w-4/6"></div>
                    </div>
                    <div className="pt-8 space-y-2.5">
                      <div className="h-4 bg-gradient-to-r from-sky-500 to-blue-500 rounded w-1/3 shadow-sm"></div>
                      <div className="h-2.5 bg-gradient-to-r from-gray-300 to-gray-200 rounded-full w-full"></div>
                      <div className="h-2.5 bg-gradient-to-r from-gray-300 to-gray-200 rounded-full w-full"></div>
                      <div className="h-2.5 bg-gradient-to-r from-gray-300 to-gray-200 rounded-full w-3/4"></div>
                    </div>
                  </div>

                  {/* Floating badge */}
                  <div className="absolute -right-4 -top-4 bg-gradient-to-r from-sky-400 to-cyan-400 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg rotate-12 hover:rotate-0 transition-transform">
                    ATS-Ready ✓
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-24" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-sky-100 text-sky-700 rounded-full text-sm font-semibold mb-4">
              Features
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Everything you need to stand out
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
              Professional tools to help you create a resume that recruiters love and ATS systems approve
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 card-hover group">
              <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-sky-200">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Harvard Format</h3>
              <p className="text-gray-600 leading-relaxed">
                Professional formatting used by top universities and trusted by recruiters worldwide
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 card-hover group">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-sky-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-200">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered</h3>
              <p className="text-gray-600 leading-relaxed">
                Refine and optimize your resume content using advanced AI to match any job description
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 card-hover group">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-200">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Multiple Formats</h3>
              <p className="text-gray-600 leading-relaxed">
                Export as PDF, DOCX, TXT, or HTML with one click. Perfect for any application
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 card-hover group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-blue-200">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Privacy First</h3>
              <p className="text-gray-600 leading-relaxed">
                Your data never leaves your browser. No accounts, no tracking, complete privacy
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 card-hover group">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-orange-200">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">ATS-Optimized</h3>
              <p className="text-gray-600 leading-relaxed">
                Designed to pass Applicant Tracking Systems and get your resume in front of recruiters
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 card-hover group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-sky-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-blue-200">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Save & Reuse</h3>
              <p className="text-gray-600 leading-relaxed">
                Export your data as JSON and import it anytime. Perfect for multiple job applications
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Create your resume in 3 simple steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fill in your details</h3>
              <p className="text-gray-600">
                Enter your information or import from a previous resume. Takes just a few minutes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI refines for the job</h3>
              <p className="text-gray-600">
                Paste the job description and let AI optimize your resume to match perfectly.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-sky-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Download & apply</h3>
              <p className="text-gray-600">
                Export in your preferred format and start applying with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to land your dream job?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands creating professional resumes. No credit card required.
          </p>
          <Link
            href="/generate"
            className="inline-block px-8 py-4 bg-white text-gray-900 text-lg font-semibold rounded-full hover:bg-gray-100 transition-all"
          >
            Create Your Resume Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-3xl font-extrabold bg-gradient-to-r from-sky-500 to-blue-500 bg-clip-text text-transparent mb-3">
              ResumeGen
            </div>
            <p className="text-gray-600 text-base mb-6 font-medium">
              Professional Harvard-format resumes. AI-powered. Always free.
            </p>
            <div className="flex items-center justify-center space-x-6 mb-8">
              <a href="#features" className="text-gray-600 hover:text-sky-600 transition-colors font-medium">
                Features
              </a>
              <span className="text-gray-300">•</span>
              <a href="/generate" className="text-gray-600 hover:text-sky-600 transition-colors font-medium">
                Get Started
              </a>
              <span className="text-gray-300">•</span>
              <a href="https://github.com" className="text-gray-600 hover:text-sky-600 transition-colors font-medium">
                GitHub
              </a>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>100% Free</span>
              <span className="text-gray-300">•</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No Sign Up</span>
              <span className="text-gray-300">•</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Privacy Focused</span>
            </div>
            <p className="text-gray-400 text-xs">
              © 2026 ResumeGen. Built with ❤️ for job seekers everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
