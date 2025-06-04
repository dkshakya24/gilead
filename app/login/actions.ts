"use server";

import { signIn } from "@/auth";
import { User } from "@/lib/types";
import { AuthError } from "next-auth";
import { z } from "zod";
import { ResultCode } from "@/lib/utils";

const users = [
  {
    id: "1",
    email: "admin@chryselys.com",
    password: "Admin@chryselys123",
    name: "Deepak",
    salt: "qbc",
  },
  {
    id: "2",
    email: "Sourabh.Pandey2@gilead.com",
    password: "Admin@chryselys123",
    name: "Sourabh",
    salt: "def",
  },
  {
    id: "3",
    email: "Vaishali.Chaudhuri@gilead.com",
    password: "Admin@chryselys123",
    name: "Vaishali",
    salt: "ghi",
  },
  {
    id: "4",
    email: "admin@chryselys.com",
    password: "Admin@chryselys123",
    name: "Admin",
    salt: "jkl",
  },
  {
    id: "5",
    email: "gilead@gabiarc.com",
    password: "Admin@chryselys123",
    name: "Gilead",
    salt: "jkl",
  },

  // Add more users as needed
];

// export async function getUser(email: string) {
//   const user = await kv.hgetall<User>(`user:${email}`)
//   return user
// }

export async function getUser(
  email: string,
  password: string
): Promise<User | undefined> {
  const user = users.find(
    (user) => user.email === email && user.password === password
  );
  return user;
}

interface Result {
  type: string;
  resultCode: ResultCode;
}

export async function authenticate(
  _prevState: Result | undefined,
  formData: FormData
): Promise<Result | undefined> {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    const parsedCredentials = z
      .object({
        email: z.string().email(),
        password: z.string().min(6),
      })
      .safeParse({
        email,
        password,
      });

    if (parsedCredentials.success) {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      return {
        type: "success",
        resultCode: ResultCode.UserLoggedIn,
      };
    } else {
      return {
        type: "error",
        resultCode: ResultCode.InvalidCredentials,
      };
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            type: "error",
            resultCode: ResultCode.InvalidCredentials,
          };
        default:
          return {
            type: "error",
            resultCode: ResultCode.UnknownError,
          };
      }
    }
  }
}
