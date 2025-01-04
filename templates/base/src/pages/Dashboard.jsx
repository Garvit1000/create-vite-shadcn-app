import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Card Title</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This is a sample card component from shadcn/ui.
          </p>
          <Button className="w-full">Action</Button>
        </Card>
        {/* Add more cards as needed */}
      </div>
    </div>
  );
}
