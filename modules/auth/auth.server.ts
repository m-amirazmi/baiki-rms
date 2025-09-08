import "server-only";

import jwt from "jsonwebtoken";
import db from "@/lib/prisma";
import type { TenantRole, UserType } from "@prisma/client";
import type { Secret, SignOptions } from "jsonwebtoken";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "";
const JWT_EXPIRES_IN: number = 86400; // 1 day in seconds

export type JwtPayload = {
  userId: string;
  userType: UserType;
  tenantId?: string;
  tenantRole?: TenantRole;
};

function createToken(payload: JwtPayload) {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
  return jwt.sign(payload, JWT_SECRET, options);
}

function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

async function createSession(userId: string, token: string) {
  return db.session.create({
    data: {
      userId,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });
}

async function getSession(token: string) {
  return db.session.findUnique({ where: { token } });
}

async function deleteSession(token: string) {
  return db.session.delete({ where: { token } });
}

export const authServer = {
  createToken,
  verifyToken,
  createSession,
  getSession,
  deleteSession,
};
