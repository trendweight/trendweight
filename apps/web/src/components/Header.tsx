import { Link } from '@tanstack/react-router'
import { Logo } from './Logo'
import { Container } from './Container'
import { useAuth } from '../lib/auth/UnifiedAuthContext'

export function Header() {
  const { isInitializing, isLoggedIn, signOut } = useAuth()
  const visibility = isInitializing ? 'invisible' : 'visible'

  return (
    <header className="bg-brand-500 text-white">
      <Container>
        <nav className="flex items-stretch justify-between">
          <div className="flex items-center gap-2 py-3">
            <Link to="/" className="font-logo text-3xl font-bold leading-tight">
              TrendWeight
            </Link>
            <Logo className="h-8 w-auto" />
          </div>
          <div className="hidden md:flex items-stretch">
            <NavLink to="/" visibility={visibility}>
              Home
            </NavLink>
            {isLoggedIn && (
              <>
                <NavLink to="/dashboard" visibility={visibility}>
                  Dashboard
                </NavLink>
                <NavLink to="/settings" visibility={visibility}>
                  Settings
                </NavLink>
              </>
            )}
            <NavLink to="/about" visibility={visibility}>
              Learn
            </NavLink>
            {!isLoggedIn ? (
              <NavLink to="/login" visibility={visibility}>
                Log In
              </NavLink>
            ) : (
              <button 
                className={`flex items-center px-3 hover:bg-white hover:text-brand-800 transition-colors ${visibility}`}
                onClick={() => signOut()}
              >
                Log Out
              </button>
            )}
          </div>
        </nav>
      </Container>
    </header>
  )
}

interface NavLinkProps {
  to: string
  children: React.ReactNode
  visibility?: string
}

function NavLink({ to, children, visibility = 'visible' }: NavLinkProps) {
  return (
    <Link 
      to={to} 
      className={`flex items-center px-3 hover:bg-white hover:text-brand-800 transition-colors ${visibility}`}
      activeProps={{
        className: "bg-brand-400"
      }}
    >
      {children}
    </Link>
  )
}