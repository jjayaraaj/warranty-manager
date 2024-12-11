CREATE TYPE "public"."plan_type" AS ENUM('free', 'basic', 'full');--> statement-breakpoint
CREATE TYPE "public"."warranty_status" AS ENUM('active', 'expiring', 'expired');--> statement-breakpoint
CREATE TABLE "claims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"warranty_id" text NOT NULL,
	"status" text NOT NULL,
	"description" text NOT NULL,
	"reference" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"warranty_id" text NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"size" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"email_alerts" boolean DEFAULT true NOT NULL,
	"in_app_alerts" boolean DEFAULT true NOT NULL,
	"reminder_days" integer[] DEFAULT '{30,7,1}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" text NOT NULL,
	"email" text NOT NULL,
	"plan" "plan_type" DEFAULT 'free' NOT NULL,
	"plan_updated_at" timestamp DEFAULT now() NOT NULL,
	"storage_used" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "warranties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"product_name" text NOT NULL,
	"brand" text NOT NULL,
	"model_number" text NOT NULL,
	"serial_number" text NOT NULL,
	"purchase_date" timestamp NOT NULL,
	"expiry_date" timestamp NOT NULL,
	"warranty_period" integer NOT NULL,
	"purchase_price" numeric(10, 2) DEFAULT '0',
	"retailer_name" text NOT NULL,
	"retailer_contact" text,
	"notes" text,
	"status" "warranty_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "warranty_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"warranty_id" text NOT NULL,
	"type" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "claims" ADD CONSTRAINT "claims_warranty_id_warranties_id_fk" FOREIGN KEY ("warranty_id") REFERENCES "public"."warranties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_warranty_id_warranties_id_fk" FOREIGN KEY ("warranty_id") REFERENCES "public"."warranties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warranties" ADD CONSTRAINT "warranties_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warranty_events" ADD CONSTRAINT "warranty_events_warranty_id_warranties_id_fk" FOREIGN KEY ("warranty_id") REFERENCES "public"."warranties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "claims_warranty_id_idx" ON "claims" USING btree ("warranty_id");--> statement-breakpoint
CREATE INDEX "claims_status_idx" ON "claims" USING btree ("status");--> statement-breakpoint
CREATE INDEX "claims_warranty_status_idx" ON "claims" USING btree ("warranty_id","status");--> statement-breakpoint
CREATE INDEX "documents_user_id_idx" ON "documents" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "documents_warranty_id_idx" ON "documents" USING btree ("warranty_id");--> statement-breakpoint
CREATE INDEX "documents_user_type_idx" ON "documents" USING btree ("user_id","type");--> statement-breakpoint
CREATE INDEX "user_settings_user_id_idx" ON "user_settings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "clerk_id_idx" ON "users" USING btree ("clerk_id");--> statement-breakpoint
CREATE INDEX "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "plan_idx" ON "users" USING btree ("plan");--> statement-breakpoint
CREATE INDEX "warranties_user_id_idx" ON "warranties" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "warranties_user_status_idx" ON "warranties" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "warranties_expiry_idx" ON "warranties" USING btree ("expiry_date");--> statement-breakpoint
CREATE INDEX "warranties_brand_idx" ON "warranties" USING btree ("brand");--> statement-breakpoint
CREATE INDEX "warranties_serial_number_idx" ON "warranties" USING btree ("serial_number");--> statement-breakpoint
CREATE INDEX "warranties_user_expiry_idx" ON "warranties" USING btree ("user_id","expiry_date");--> statement-breakpoint
CREATE INDEX "warranty_events_warranty_id_idx" ON "warranty_events" USING btree ("warranty_id");--> statement-breakpoint
CREATE INDEX "warranty_events_warranty_type_idx" ON "warranty_events" USING btree ("warranty_id","type");--> statement-breakpoint
CREATE INDEX "warranty_events_created_at_idx" ON "warranty_events" USING btree ("created_at");