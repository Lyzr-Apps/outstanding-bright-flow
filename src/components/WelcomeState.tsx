import { MdChat } from 'react-icons/md'

interface WelcomeStateProps {
  companyName: string
}

export default function WelcomeState({ companyName }: WelcomeStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        <MdChat className="text-blue-600 text-3xl" />
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Hello! How can we help?
      </h3>

      <p className="text-sm text-gray-600 max-w-sm mb-6">
        I'm here to assist you with any questions about {companyName}. Ask me
        anything about our products, services, pricing, or accounts.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full max-w-sm text-left">
        <p className="text-xs font-semibold text-blue-900 mb-3">
          Popular topics:
        </p>
        <ul className="text-xs text-blue-800 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Get pricing information and plan details</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Learn about features and capabilities</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Account management and billing help</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Technical support and troubleshooting</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
