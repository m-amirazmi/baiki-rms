import "server-only";

import { UserType } from "@prisma/client";
import { z } from "zod";

/**
 * createWithEmail() - For creating system level users (admins)
 * && tenant owners
 * Makes email is required
 *
 * createWithUsername() - For creating tenant users
 * (admin, outlet, technician)
 * except owners
 * Makes username is required
 *
 * createWithUsernamePasswordless() - For creating tenant frontdesk users
 * who can login with username only (POS)
 * Makes username is required
 */

const baseUserSchema = z.object({
  name: z.string().min(2).max(100),
  type: z.enum(UserType).default(UserType.TENANT),
});

export const userSchemas = {
  createWithEmail: baseUserSchema.extend({
    email: z.string().email().max(100),
    password: z.string().min(6),
  }),
  createWithUsername: baseUserSchema.extend({
    username: z.string().min(3),
    password: z.string().min(6),
  }),
  createWithUsernamePasswordless: baseUserSchema.extend({
    username: z.string().min(3),
  }),
};

export type CreateUserWithEmailInput = z.infer<
  typeof userSchemas.createWithEmail
>;
export type CreateUserWithUsernameInput = z.infer<
  typeof userSchemas.createWithUsername
>;
export type CreateUserWithUsernamePasswordlessInput = z.infer<
  typeof userSchemas.createWithUsernamePasswordless
>;
