"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/database/prisma";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: "Please check your input",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    // Determine redirect path based on role BEFORE signing in
    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email.toLowerCase() }
    });

    const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ELECTION_ADMIN";
    const redirectTo = isAdmin ? "/admin/dashboard" : "/dashboard";

    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo,
    });
    return null;
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password, or account is not active." };
        default:
          return { error: "Something went wrong. Please try again." };
      }
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
