import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Your App
        </h1>
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          Built with Vite + React + shadcn/ui
        </p>
        <div className="space-x-4">
          <Button>Primary Button</Button>
          <Button variant="outline">Secondary Button</Button>
        </div>
      </div>
    </div>
  );
}