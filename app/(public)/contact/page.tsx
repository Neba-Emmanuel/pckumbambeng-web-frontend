export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-navy-900 text-center">
        Contact Us
      </h1>
      <p className="mt-4 text-center text-gray-600 max-w-2xl mx-auto">
        We would love to hear from you. Reach out to us through any of the channels below.
      </p>

      <div className="mt-12 max-w-2xl mx-auto grid gap-8 sm:grid-cols-2">
        {/* Address */}
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <svg
              className="h-6 w-6 text-navy-900 mr-3 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <h2 className="text-lg font-semibold text-gray-900">Address</h2>
          </div>
          <p className="text-gray-700">Presbyterian Church Kumba-Mbeng</p>
          <p className="text-gray-700">Kumba-Mbeng, South West Region</p>
          <p className="text-gray-700">Cameroon</p>
        </div>

        {/* Phone */}
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <svg
              className="h-6 w-6 text-navy-900 mr-3 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <h2 className="text-lg font-semibold text-gray-900">Phone</h2>
          </div>
          <p className="text-gray-700">+237 6XX XXX XXX</p>
        </div>

        {/* Email */}
        <div className="bg-white border rounded-lg p-6 shadow-sm sm:col-span-2">
          <div className="flex items-center mb-4">
            <svg
              className="h-6 w-6 text-navy-900 mr-3 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <h2 className="text-lg font-semibold text-gray-900">Email</h2>
          </div>
          <p className="text-gray-700">contact@pckumbambeng.org</p>
        </div>
      </div>
    </div>
  );
}
