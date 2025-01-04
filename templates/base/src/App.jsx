import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeToggle } from './components/ThemeToggle';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { useTheme } from './store/theme';

function App() {
  const { theme } = useTheme();

  return (
    <div className={theme}>
      <div className="min-h-screen bg-background text-foreground">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
          <ThemeToggle />
        </Router>
      </div>
    </div>
  );
}

export default App;