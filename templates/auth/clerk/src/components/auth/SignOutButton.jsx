import { SignOutButton as ClerkSignOutButton, useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return null;
  }

  return (
    <ClerkSignOutButton>
      <Button variant="outline" size="sm">
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </ClerkSignOutButton>
  );
}