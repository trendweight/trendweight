import { Link } from '@tanstack/react-router'

export function InfoButtons() {
  // TODO: Add auth logic when implemented
  const isInitializing = false
  const isLoggedIn = false
  const visibility = isInitializing ? 'invisible' : 'visible'

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center w-full">
      <Link 
        to="/about" 
        className="w-full md:w-80 bg-green-600 text-white px-6 py-6 md:py-7 rounded hover:bg-green-700 transition-colors text-center text-xl lg:text-2xl font-normal"
      >
        Learn More
      </Link>
      {isLoggedIn ? (
        <Link 
          to="/dashboard" 
          className={`w-full md:w-80 bg-brand-600 text-white px-6 py-6 md:py-7 rounded hover:bg-brand-700 transition-colors text-center text-xl lg:text-2xl font-normal ${visibility}`}
        >
          Go To Dashboard
        </Link>
      ) : (
        <>
          <Link 
            to="/signup" 
            className={`w-full md:w-80 bg-brand-600 text-white px-6 py-6 md:py-7 rounded hover:bg-brand-700 transition-colors text-center text-xl lg:text-2xl font-normal ${visibility}`}
          >
            Create an Account
          </Link>
          <Link 
            to="/login" 
            className={`w-full md:w-80 bg-brand-600 text-white px-6 py-6 md:py-7 rounded hover:bg-brand-700 transition-colors text-center text-xl lg:text-2xl font-normal ${visibility}`}
          >
            Log In
          </Link>
        </>
      )}
    </div>
  )
}