/*
  Warnings:

  - The values [admin] on the enum `UserType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
ALTER TYPE "public"."TenantRole" ADD VALUE 'owner';

-- AlterEnum
BEGIN;
CREATE TYPE "public"."UserType_new" AS ENUM ('system', 'tenant');
ALTER TABLE "public"."User" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "public"."User" ALTER COLUMN "type" TYPE "public"."UserType_new" USING ("type"::text::"public"."UserType_new");
ALTER TYPE "public"."UserType" RENAME TO "UserType_old";
ALTER TYPE "public"."UserType_new" RENAME TO "UserType";
DROP TYPE "public"."UserType_old";
ALTER TABLE "public"."User" ALTER COLUMN "type" SET DEFAULT 'tenant';
COMMIT;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ALTER COLUMN "type" SET DEFAULT 'tenant';

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "public"."Session"("token");

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
