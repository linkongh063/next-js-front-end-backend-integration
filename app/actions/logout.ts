// app/actions/logout.ts
"use server";

import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";

export async function logout() {
  await signOut();
  redirect("/");
}

