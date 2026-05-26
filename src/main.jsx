import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import './index.css'
import App from './App.jsx'

function Fallback({ error }) {
  return (
    <div role="alert" className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 p-6">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-2xl w-full border-t-4 border-red-500">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <div className="bg-red-50 p-4 rounded-lg overflow-auto border border-red-100">
          <pre className="text-sm text-red-600 font-mono">{error.message}</pre>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-sm"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={Fallback}>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
