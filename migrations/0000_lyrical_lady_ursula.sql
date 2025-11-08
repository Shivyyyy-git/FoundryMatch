CREATE TABLE "admin_actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_id" uuid NOT NULL,
	"action_type" "admin_action_type" NOT NULL,
	"target_type" "admin_target_type" NOT NULL,
	"target_id" uuid NOT NULL,
	"reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requester_id" uuid NOT NULL,
	"recipient_id" uuid NOT NULL,
	"status" "connection_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"responded_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_id" uuid NOT NULL,
	"recipient_id" uuid NOT NULL,
	"content" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(160) NOT NULL,
	"headline" varchar(200),
	"bio" text,
	"skills" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"profile_image_key" varchar(255),
	"linkedin_url" varchar(255),
	"website_url" varchar(255),
	"graduation_year" integer,
	"major" varchar(120),
	"seeking_opportunities" boolean DEFAULT false,
	"department" varchar(120),
	"research_areas" text[] DEFAULT ARRAY[]::text[],
	"company_name" varchar(160),
	"industry" "company_industry",
	"employee_count" integer,
	"startup_name" varchar(160),
	"founding_year" integer,
	"profile_status" "profile_status" DEFAULT 'pending_approval' NOT NULL,
	"approved_by" uuid,
	"approved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" uuid NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"category" "project_category" NOT NULL,
	"compensation_type" "compensation_type" NOT NULL,
	"application_deadline" timestamp with time zone,
	"required_skills" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"status" "project_status" DEFAULT 'pending_approval' NOT NULL,
	"approved_by" uuid,
	"approved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" varchar(255) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"revoked_at" timestamp with time zone,
	"user_agent" varchar(255),
	"ip_address" varchar(64)
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar(255) PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "startup_showcase" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"company_name" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"founding_year" integer,
	"category" "startup_category" NOT NULL,
	"logo_key" varchar(255),
	"website_url" varchar(255),
	"linkedin_url" varchar(255),
	"status" "showcase_status" DEFAULT 'pending_approval' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"featured_until" timestamp with time zone,
	"approved_by" uuid,
	"approved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"auth_provider" "auth_provider" DEFAULT 'google_oauth' NOT NULL,
	"user_type" "user_type" NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"password_hash" varchar(255),
	"email_verified" boolean DEFAULT false NOT NULL,
	"email_verification_token" varchar(255),
	"email_verification_expires_at" timestamp with time zone,
	"reset_password_token" varchar(255),
	"reset_password_expires_at" timestamp with time zone,
	"google_id" varchar(255),
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "admin_actions" ADD CONSTRAINT "admin_actions_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connections" ADD CONSTRAINT "connections_requester_id_users_id_fk" FOREIGN KEY ("requester_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connections" ADD CONSTRAINT "connections_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "startup_showcase" ADD CONSTRAINT "startup_showcase_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "startup_showcase" ADD CONSTRAINT "startup_showcase_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_admin_actions_admin" ON "admin_actions" USING btree ("admin_id");--> statement-breakpoint
CREATE INDEX "idx_admin_actions_target" ON "admin_actions" USING btree ("target_type","target_id");--> statement-breakpoint
CREATE INDEX "idx_admin_actions_created" ON "admin_actions" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "udx_connections_pair" ON "connections" USING btree ("requester_id","recipient_id");--> statement-breakpoint
CREATE INDEX "idx_connections_status" ON "connections" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_connections_recipient_status" ON "connections" USING btree ("recipient_id","status");--> statement-breakpoint
CREATE INDEX "idx_messages_participants" ON "messages" USING btree ("sender_id","recipient_id");--> statement-breakpoint
CREATE INDEX "idx_messages_recipient_read" ON "messages" USING btree ("recipient_id","read");--> statement-breakpoint
CREATE INDEX "idx_messages_created_at" ON "messages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_profiles_status" ON "profiles" USING btree ("profile_status");--> statement-breakpoint
CREATE INDEX "idx_profiles_seeking_opportunities" ON "profiles" USING btree ("seeking_opportunities");--> statement-breakpoint
CREATE INDEX "idx_profiles_industry" ON "profiles" USING btree ("industry");--> statement-breakpoint
CREATE INDEX "idx_profiles_graduation_year" ON "profiles" USING btree ("graduation_year");--> statement-breakpoint
CREATE INDEX "idx_profiles_department" ON "profiles" USING btree ("department");--> statement-breakpoint
CREATE INDEX "idx_profiles_company_name" ON "profiles" USING btree ("company_name");--> statement-breakpoint
CREATE INDEX "idx_profiles_startup_name" ON "profiles" USING btree ("startup_name");--> statement-breakpoint
CREATE INDEX "idx_profiles_skills" ON "profiles" USING gin ("skills");--> statement-breakpoint
CREATE INDEX "idx_projects_status" ON "projects" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_projects_category" ON "projects" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_projects_creator" ON "projects" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "idx_projects_status_category" ON "projects" USING btree ("status","category");--> statement-breakpoint
CREATE INDEX "idx_projects_deadline" ON "projects" USING btree ("application_deadline");--> statement-breakpoint
CREATE INDEX "idx_projects_compensation" ON "projects" USING btree ("compensation_type");--> statement-breakpoint
CREATE INDEX "idx_projects_required_skills" ON "projects" USING gin ("required_skills");--> statement-breakpoint
CREATE INDEX "idx_refresh_tokens_hash" ON "refresh_tokens" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "idx_refresh_tokens_user" ON "refresh_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_refresh_tokens_expires" ON "refresh_tokens" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "idx_sessions_expire" ON "sessions" USING btree ("expire");--> statement-breakpoint
CREATE INDEX "idx_showcase_status" ON "startup_showcase" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_showcase_category" ON "startup_showcase" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_showcase_featured" ON "startup_showcase" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "idx_showcase_featured_until" ON "startup_showcase" USING btree ("featured_until");--> statement-breakpoint
CREATE INDEX "idx_showcase_user" ON "startup_showcase" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_showcase_status_category" ON "startup_showcase" USING btree ("status","category");--> statement-breakpoint
CREATE INDEX "idx_users_user_type" ON "users" USING btree ("user_type");--> statement-breakpoint
CREATE INDEX "idx_users_created_at" ON "users" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_users_google_id" ON "users" USING btree ("google_id") WHERE "users"."google_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_users_email_verification" ON "users" USING btree ("email_verification_token");--> statement-breakpoint
CREATE INDEX "idx_users_reset_token" ON "users" USING btree ("reset_password_token");