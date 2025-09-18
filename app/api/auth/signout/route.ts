import { signOut } from "@/auth"

export async function POST() {
  try {
    await signOut({ redirect: false });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error during sign out:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Error signing out' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
