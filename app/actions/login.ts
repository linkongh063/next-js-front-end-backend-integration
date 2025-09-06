'use server'

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { revalidatePath } from "next/cache";

// export async function doSocialLogin(formData) {
//     const action = formData.get('action');
//     await signIn(action, { redirectTo: "/" });
// }

export async function doLogout() {
  await signOut({ redirectTo: "/" });
}

export async function doCredentialLogin(formData: FormData) {
  console.log("formData", formData);

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    // If we get here, sign-in did not redirect and no error was thrown
    return { success: true } as const;
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials.", success: false };
        default:
          return { error: "Something went wrong.", success: false };
      }
    }
    throw err;
  }
}