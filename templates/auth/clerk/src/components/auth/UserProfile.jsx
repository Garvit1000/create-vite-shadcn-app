import { UserButton, useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Calendar } from "lucide-react";

export function UserProfile() {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-16 h-16"
              }
            }}
          />
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          <User className="w-5 h-5" />
          {user.firstName || user.username || "User"}
        </CardTitle>
        <CardDescription>
          Member since {new Date(user.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
          <Mail className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{user.primaryEmailAddress?.emailAddress}</span>
        </div>
        
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">
            Last sign in: {new Date(user.lastSignInAt).toLocaleDateString()}
          </span>
        </div>

        <div className="pt-4">
          <UserButton 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "w-full"
              }
            }}
            userProfileMode="modal"
          >
            <Button variant="outline" className="w-full">
              Manage Account
            </Button>
          </UserButton>
        </div>
      </CardContent>
    </Card>
  );
}