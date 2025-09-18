'use client';

import { Button } from "@/components/ui/button";
import { signOutAction } from "@/actions/sign-out";

export function SignOutButton() {
  const handleSignOut = async () => {
    try {
      await signOutAction();
      // Force a full page reload to clear all client-side state
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Button onClick={handleSignOut} variant="outline" className="cursor-pointer">
      Sign out
    </Button>
  );
}
