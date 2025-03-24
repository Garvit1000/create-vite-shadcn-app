import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeToggle } from './components/ThemeToggle';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { useTheme } from './store/theme';
import { Button } from './components/ui/button';

function App() {
  const { theme } = useTheme();

  return (
    <div className={theme}>
      <div className="min-h-screen bg-background text-foreground">
        <Router>
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
                  <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                </nav>
                <ThemeToggle />
              </div>
            </div>
          </header>
          
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
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
  );
}

export default App;