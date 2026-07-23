ALTER TABLE "users" ALTER COLUMN "isVerified" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "verificationTokenExpires" timestamp;