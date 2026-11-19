import type { DefaultSession } from "next-auth";
import type { Role, AccountStatus } from "@prisma/client";

declare module "next-auth" {
  interface User {
    role: Role;
    accountStatus: AccountStatus;
  }
  interface Session {
    user: {
      id: string;
      role: Role;
      accountStatus: AccountStatus;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    accountStatus: AccountStatus;
  }
}
