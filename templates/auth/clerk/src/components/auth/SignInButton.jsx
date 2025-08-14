import { SignInButton as ClerkSignInButton, useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

export function SignInButton() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return null;
  }

  return (
    <ClerkSignInButton mode="modal">
      <Button variant="default">
        Sign In
      </Button>
    </ClerkSignInButton>
  );
}