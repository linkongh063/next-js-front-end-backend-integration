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

export async function doCredentialLogin(formData) {
  console.log("formData", formData);

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: '/profile/profileinfo',
    });
    revalidatePath("/");
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials.", success: false };
        default:
          return { error: 'give valid email and password credentials', success: false };
      }
    }
    throw err;
  }
}