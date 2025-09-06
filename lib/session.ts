import type { User } from 'next-auth'
import { auth } from '@/auth'

// Helper to get the current user from NextAuth v5
export const getUserSession = async (): Promise<User | null> => {
  const s = await auth();
  return (s?.user as User) ?? null;
}