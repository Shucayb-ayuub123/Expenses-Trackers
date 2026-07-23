ALTER TABLE "users" ADD COLUMN "isVerified" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "verificationToken" varchar(255);