import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to Your App
        </h1>
        <p className="mb-6 text-xl text-gray-600 dark:text-gray-300">
          Built with Vite + React + shadcn/ui + Tailwind CSS
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-6 border rounded-lg shadow-sm bg-card text-card-foreground">
            <h3 className="text-lg font-medium mb-2">Fast Development</h3>
            <p className="text-sm text-muted-foreground">
              Powered by Vite for lightning-fast HMR and optimized builds.
            </p>
          </div>
          
          <div className="p-6 border rounded-lg shadow-sm bg-card text-card-foreground">
            <h3 className="text-lg font-medium mb-2">Beautiful UI</h3>
            <p className="text-sm text-muted-foreground">
              Styled with Tailwind CSS and shadcn/ui components.
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild>
            <Link to="/dashboard">View Dashboard</Link>
          </Button>
          <Button variant="outline">Secondary Button</Button>
          <Button variant="secondary">Tertiary Button</Button>
        </div>
        
        <div className="mt-12 text-sm text-muted-foreground">
          <p>
            Edit <code className="bg-muted px-1 py-0.5 rounded">src/pages/Home.jsx</code> to customize this page
          </p>
        </div>
      </div>
    </div>
  );
}