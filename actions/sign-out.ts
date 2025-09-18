'use server';

import { signOut } from "@/auth";

export async function signOutAction() {
  try {
    await signOut({ redirect: false });
    return { success: true };
  } catch (error) {
    console.error('Error during sign out:', error);
    throw new Error('Failed to sign out');
  }
}
