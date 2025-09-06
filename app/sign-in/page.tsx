'use client'
import React from "react";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { doCredentialLogin } from "../actions/login";
import { Router } from "next/router";


export default function page() {
  


  const onSubmitLoginForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    console.log("email", email);
    console.log("password", password);
    const response = await doCredentialLogin(formData);
    console.log('response from login', response)
    if (response?.error) {
      throw new Error(response.error);
    }
    
    console.log('go somewhere', response)
    redirect("/profile");
   
  };

  return (
    <form
     onSubmit={onSubmitLoginForm}
    >
      <label>
        Email
        <input name="email" type="email" />
      </label>
      <label>
        Password
        <input name="password" type="password" />
      </label>
      <button>Sign In</button>
    </form>
  );
}

// import { signIn } from "@/auth"

// export function SignIn() {
//   return (
//     <form
//       action={async (formData) => {
//           "use server"
//         console.log('formdata', formData)
//         await signIn("credentials", formData)
//       }}
//     >
//       <label>
//         Email
//         <input name="email" type="email" />
//       </label>
//       <label>
//         Password
//         <input name="password" type="password" />
//       </label>
//       <button>Sign In</button>
//     </form>
//   )
// }
