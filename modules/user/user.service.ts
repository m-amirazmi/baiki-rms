import "server-only";
import type {
  CreateUserWithEmailInput,
  CreateUserWithUsernameInput,
  CreateUserWithUsernamePasswordlessInput,
} from "./user.entity";
import { userServer } from "./user.server";
import type { User } from "@prisma/client";

export type RegisterResult = { user: User };
export type LoginResult = { user: User };

async function registerWithEmail(
  input: CreateUserWithEmailInput
): Promise<RegisterResult> {
  const user = await userServer.createUserWithEmail(input);
  return { user };
}

async function registerWithUsername(
  input: CreateUserWithUsernameInput
): Promise<RegisterResult> {
  const user = await userServer.createUserWithUsername(input);
  return { user };
}

async function registerPasswordless(
  input: CreateUserWithUsernamePasswordlessInput
): Promise<RegisterResult> {
  const user = await userServer.createUserWithUsernamePasswordless(input);
  return { user };
}

async function loginByEmail(
  email: string,
  password: string
): Promise<LoginResult> {
  const user = await userServer.loginWithEmail(email, password);
  if (!user) throw new Error("Invalid credentials");
  return { user };
}

async function loginByUsername(
  username: string,
  password: string
): Promise<LoginResult> {
  const user = await userServer.loginWithUsername(username, password);
  if (!user) throw new Error("Invalid credentials");
  return { user };
}

async function updateLastLogin(userId: string): Promise<User> {
  return userServer.updateLastLogin(userId);
}

export const userService = {
  registerWithEmail,
  registerWithUsername,
  registerPasswordless,
  loginByEmail,
  loginByUsername,
  updateLastLogin,
};
