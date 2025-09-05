import React from "react";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";

export default function page() {
  return (
    <form
      action={async (formData) => {
        "use server";
        // console.log("formdata", formData);
        console.log('hit')
        await signIn("credentials", formData);
        // redirect("/profile/profile-info")
        // console.log('res', res)
      }}
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
