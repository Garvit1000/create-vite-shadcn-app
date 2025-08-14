import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useUser } from '@clerk/clerk-react';
import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from './store/theme';
import { Button } from './components/ui/button';
import { ClerkProviderWithTheme } from './lib/clerk';
import { SignInButton } from './components/auth/SignInButton';
import { SignOutButton } from './components/auth/SignOutButton';

// Lazy load route components
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Profile = lazy(() => import('./pages/Profile'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Navigation component with auth state
function Navigation() {
  const { isSignedIn, user } = useUser();

  return (
    <header className="border-b">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Your App
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            {isSignedIn && (
              <>
                <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Link to="/profile" className="text-sm font-medium hover:text-primary transition-colors">
                  Profile
                </Link>
              </>
            )}
          </nav>
          
          <div className="flex items-center gap-2">
            {isSignedIn ? (
              <>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  Hi, {user?.firstName || user?.username || 'User'}!
                </span>
                <SignOutButton />
              </>
            ) : (
              <SignInButton />
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

function AppContent() {
  const { theme } = useTheme();

  return (
    <ClerkProviderWithTheme theme={theme}>
      <div className={theme}>
        <div className="min-h-screen bg-background text-foreground">
          <Router>
            <Navigation />
            
            <main>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/sign-in" element={<SignIn />} />
                  <Route path="/sign-up" element={<SignUp />} />
                </Routes>
              </Suspense>
            </main>
            
            <footer className="border-t py-6 md:py-0">
              <div className="container mx-auto px-4 md:flex md:items-center md:justify-between md:py-6">
                <p className="text-center md:text-left text-sm text-muted-foreground">
                  © {new Date().getFullYear()} Your App. All rights reserved.
                </p>
                <div className="mt-4 md:mt-0 flex justify-center md:justify-end space-x-6">
                  <a href="https://github.com/Garvit1000/create-vite-shadcn-app" className="text-sm text-muted-foreground hover:text-primary">
                    GitHub
                  </a>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                    Documentation
                  </a>
                </div>
              </div>
            </footer>
          </Router>
        </div>
      </div>
    </ClerkProviderWithTheme>
  );
}

function App() {
  return <AppContent />;
}

export default App;