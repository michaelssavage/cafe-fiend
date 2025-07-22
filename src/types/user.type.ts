import { ReactNode } from "react";

export type UserI = { email: string } | null;

export interface RootUserI {
  children: ReactNode;
  user: UserI;
}

export interface LoginUserI {
  email: string;
  password: string;
}
