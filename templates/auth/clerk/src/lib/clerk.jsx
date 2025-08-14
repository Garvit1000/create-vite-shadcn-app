import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

// Helper to get resolved CSS variable value
function getCssVariable(variableName) {
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}

// Clerk configuration
export const clerkConfig = {
  appearance: {
    baseTheme: undefined,
    variables: {
      // Static fallback colors—replace with your actual colors
      colorPrimary: "hsl(220, 90%, 50%)",
      colorBackground: "hsl(0, 0%, 100%)",
      colorInputBackground: "hsl(0, 0%, 100%)",
      colorInputText: "hsl(220, 15%, 20%)",
      colorText: "hsl(220, 15%, 20%)",
      colorTextSecondary: "hsl(220, 10%, 50%)",
      colorDanger: "hsl(0, 85%, 60%)",
      borderRadius: "4px",
      fontFamily: "inherit",
    },
    elements: {
      card: "shadow-lg border-border",
      headerTitle: "text-foreground",
      headerSubtitle: "text-muted-foreground",
      socialButtonsBlockButton: "border-border hover:bg-accent",
      formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
      formFieldInput: "border-border bg-background",
      footerActionLink: "text-primary hover:text-primary/80",
    },
  },
};

// Provider wrapper with theme support
export function ClerkProviderWithTheme({ children, theme }) {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error("Missing Publishable Key");
  }

  // Optional: Dynamically resolve CSS variables (must be inside useEffect or effectful code)
  /*
  useEffect(() => {
    clerkConfig.appearance.variables.colorPrimary = getCssVariable("primary") || "hsl(220, 90%, 50%)";
    // Repeat for other variables as needed
  }, [theme]);
  */

  const themeConfig = {
    ...clerkConfig,
    appearance: {
      ...clerkConfig.appearance,
      baseTheme: theme === "dark" ? dark : undefined,
    },
  };

  return (
    <ClerkProvider publishableKey={publishableKey} {...themeConfig}>
      {children}
    </ClerkProvider>
  );
}

export const clerkRoutes = {
  signInUrl: "/sign-in",
  signUpUrl: "/sign-up",
  afterSignInUrl: "/dashboard",
  afterSignUpUrl: "/dashboard",
  userProfileUrl: "/profile",
};
