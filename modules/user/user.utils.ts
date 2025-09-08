import "server-only";

import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";

async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

// The finder returns either a User or null
type UserFinder = () => Promise<User | null>;

async function loginHelper(
  findUser: UserFinder,
  password: string
): Promise<User | null> {
  const user = await findUser();
  if (!user || !user.password) return null;

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) return null;

  return user;
}

export const userUtils = {
  hashPassword,
  verifyPassword,
  loginHelper,
};
