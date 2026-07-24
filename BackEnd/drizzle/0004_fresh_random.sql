CREATE TABLE "transaction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"description" text NOT NULL,
	"type" varchar(255) NOT NULL,
	"amount" numeric NOT NULL,
	"Date1" timestamp NOT NULL
);
