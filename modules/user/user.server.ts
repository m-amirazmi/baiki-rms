import "server-only";
import db from "@/lib/prisma";
import type {
  CreateUserWithEmailInput,
  CreateUserWithUsernameInput,
  CreateUserWithUsernamePasswordlessInput,
} from "./user.entity";
import { userUtils } from "./user.utils";
import type { User } from "@prisma/client";

async function createUserWithEmail(
  data: CreateUserWithEmailInput
): Promise<User> {
  const hashedPassword = await userUtils.hashPassword(data.password);
  return db.user.create({ data: { ...data, password: hashedPassword } });
}

async function createUserWithUsername(
  data: CreateUserWithUsernameInput
): Promise<User> {
  const hashedPassword = await userUtils.hashPassword(data.password);
  return db.user.create({ data: { ...data, password: hashedPassword } });
}

async function createUserWithUsernamePasswordless(
  data: CreateUserWithUsernamePasswordlessInput
): Promise<User> {
  return db.user.create({ data });
}

async function getUserById(id: string): Promise<User | null> {
  return db.user.findUnique({ where: { id } });
}

async function getUserByEmail(email: string): Promise<User | null> {
  return db.user.findUnique({ where: { email } });
}

async function getUserByUsername(username: string): Promise<User | null> {
  return db.user.findUnique({ where: { username } });
}

async function loginWithEmail(
  email: string,
  password: string
): Promise<User | null> {
  return userUtils.loginHelper(() => getUserByEmail(email), password);
}

async function loginWithUsername(
  username: string,
  password: string
): Promise<User | null> {
  return userUtils.loginHelper(() => getUserByUsername(username), password);
}

async function updateLastLogin(userId: string): Promise<User> {
  return db.user.update({
    where: { id: userId },
    data: { lastLoginAt: new Date() },
  });
}

export const userServer = {
  createUserWithEmail,
  createUserWithUsername,
  createUserWithUsernamePasswordless,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  loginWithEmail,
  loginWithUsername,
  updateLastLogin,
};
