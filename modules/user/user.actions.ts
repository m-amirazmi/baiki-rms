"use server";

import type {
  CreateUserWithEmailInput,
  CreateUserWithUsernameInput,
} from "./user.entity";
import { userSchemas } from "./user.entity";
import { userService } from "./user.service";

type UserResponse = {
  userId: string;
};

async function registerWithEmailAction(
  input: CreateUserWithEmailInput
): Promise<UserResponse> {
  const validated = userSchemas.createWithEmail.parse(input);
  const { user } = await userService.registerWithEmail(validated);
  return { userId: user.id };
}

async function registerWithUsernameAction(
  input: CreateUserWithUsernameInput
): Promise<UserResponse> {
  const validated = userSchemas.createWithUsername.parse(input);
  const { user } = await userService.registerWithUsername(validated);
  return { userId: user.id };
}

async function registerPasswordlessAction(
  input: CreateUserWithUsernameInput
): Promise<UserResponse> {
  const validated = userSchemas.createWithUsernamePasswordless.parse(input);
  const { user } = await userService.registerPasswordless(validated);
  return { userId: user.id };
}

async function loginByEmailAction(input: {
  email: string;
  password: string;
}): Promise<UserResponse> {
  const { user } = await userService.loginByEmail(input.email, input.password);
  return { userId: user.id };
}

async function loginByUsernameAction(input: {
  username: string;
  password: string;
}): Promise<UserResponse> {
  const { user } = await userService.loginByUsername(
    input.username,
    input.password
  );
  return { userId: user.id };
}

async function updateLastLoginAction(userId: string) {
  await userService.updateLastLogin(userId);
}

export const userActions = {
  registerWithEmailAction,
  registerWithUsernameAction,
  registerPasswordlessAction,
  loginByEmailAction,
  loginByUsernameAction,
  updateLastLoginAction,
};
