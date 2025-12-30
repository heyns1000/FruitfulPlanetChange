CREATE TABLE "admin_panel_brands" (
	"id" serial PRIMARY KEY NOT NULL,
	"sector_key" text NOT NULL,
	"sector_name" text NOT NULL,
	"sector_emoji" text NOT NULL,
	"brand_name" text NOT NULL,
	"sub_nodes" jsonb DEFAULT '[]'::jsonb,
	"is_core" boolean DEFAULT true,
	"status" text DEFAULT 'active' NOT NULL,
	"metadata" jsonb,
	"created_at" text DEFAULT 'now()'
);
--> statement-breakpoint
CREATE TABLE "artwork_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"emoji" text,
	"color" text,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "artwork_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "artwork_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" varchar NOT NULL,
	"artwork_id" integer,
	"customer_email" varchar,
	"customer_name" varchar,
	"amount" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'USD',
	"payment_provider" text,
	"payment_id" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"notes" text,
	"delivery_method" text DEFAULT 'digital',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "artwork_orders_order_id_unique" UNIQUE("order_id")
);
--> statement-breakpoint
CREATE TABLE "artworks" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image_url" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"category" text NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"medium" text,
	"is_available" boolean DEFAULT true,
	"sales_count" integer DEFAULT 0,
	"featured" boolean DEFAULT false,
	"artist_id" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "banimal_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"transaction_id" varchar NOT NULL,
	"product_name" varchar NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"distribution_rules" jsonb NOT NULL,
	"child_beneficiary" varchar,
	"status" varchar DEFAULT 'pending',
	"vault_signature" varchar,
	"sonic_validation" boolean DEFAULT false,
	"user_id" varchar,
	"created_at" text DEFAULT 'now()',
	"updated_at" text DEFAULT 'now()',
	CONSTRAINT "banimal_transactions_transaction_id_unique" UNIQUE("transaction_id")
);
--> statement-breakpoint
CREATE TABLE "brands" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"sector_id" integer,
	"integration" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"is_core" boolean DEFAULT true,
	"parent_id" integer,
	"metadata" jsonb,
	"created_at" text DEFAULT 'now()'
);
--> statement-breakpoint
CREATE TABLE "charitable_distributions" (
	"id" serial PRIMARY KEY NOT NULL,
	"transaction_id" varchar,
	"beneficiary_type" varchar NOT NULL,
	"beneficiary_name" varchar NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"percentage" integer NOT NULL,
	"distribution_date" text DEFAULT 'now()',
	"vault_action_id" varchar,
	"status" varchar DEFAULT 'pending',
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "codenest_repositories" (
	"id" serial PRIMARY KEY NOT NULL,
	"repo_id" varchar NOT NULL,
	"repo_name" varchar NOT NULL,
	"github_repo_id" varchar,
	"subdomain" varchar,
	"status" varchar DEFAULT 'active',
	"last_sync_at" timestamp,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"commit_count" integer DEFAULT 0,
	"contributor_count" integer DEFAULT 0,
	"star_count" integer DEFAULT 0,
	"forks_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "codenest_repositories_repo_id_unique" UNIQUE("repo_id")
);
--> statement-breakpoint
CREATE TABLE "ecosystem_pulses" (
	"id" serial PRIMARY KEY NOT NULL,
	"pulse_id" varchar NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"vault_ids" jsonb DEFAULT '[]'::jsonb,
	"active_sectors" jsonb DEFAULT '[]'::jsonb,
	"brand_health" jsonb DEFAULT '[]'::jsonb,
	"codenest_digest" jsonb DEFAULT '[]'::jsonb,
	"signal_strength" integer DEFAULT 100,
	"seedwave_metadata" jsonb,
	"network_graph_data" jsonb,
	"pulse_source" varchar DEFAULT 'banimal-connector',
	"status" varchar DEFAULT 'active',
	"forwarded_to_github" boolean DEFAULT false,
	"github_update_status" varchar,
	"metadata" jsonb,
	CONSTRAINT "ecosystem_pulses_pulse_id_unique" UNIQUE("pulse_id")
);
--> statement-breakpoint
CREATE TABLE "family_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"event_name" text NOT NULL,
	"event_date" date NOT NULL,
	"event_time" text,
	"description" text,
	"participants" jsonb DEFAULT '[]'::jsonb,
	"is_recurring" boolean DEFAULT false,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "family_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"name" text NOT NULL,
	"relationship" text,
	"date_of_birth" date,
	"date_of_death" date,
	"current_location" text,
	"birth_location" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "global_logic_configs" (
	"id" serial PRIMARY KEY NOT NULL,
	"config_id" varchar NOT NULL,
	"omnilevel_mode" varchar DEFAULT 'standard',
	"neural_network_depth" integer DEFAULT 7,
	"quantum_entanglement" boolean DEFAULT false,
	"cosmic_alignment" boolean DEFAULT false,
	"dimensional_bridging" boolean DEFAULT false,
	"processing_clusters" integer DEFAULT 12,
	"data_compression_ratio" integer DEFAULT 85,
	"security_protocols" jsonb DEFAULT '[]',
	"sync_frequency" numeric DEFAULT '2.5',
	"autonomous_learning" boolean DEFAULT true,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "global_logic_configs_config_id_unique" UNIQUE("config_id")
);
--> statement-breakpoint
CREATE TABLE "heritage_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"family_member_id" integer,
	"title" text NOT NULL,
	"description" text,
	"content_type" text NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"file_url" text,
	"ancestor_name" text,
	"date_recorded" date,
	"location" text,
	"cultural_significance" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "heritage_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"total_tags" integer DEFAULT 0,
	"unique_ancestors" integer DEFAULT 0,
	"documents_tagged" integer DEFAULT 0,
	"oral_histories" integer DEFAULT 0,
	"rituals_tagged" integer DEFAULT 0,
	"artifacts_preserved" integer DEFAULT 0,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "integration_deployments" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"brand_id" integer NOT NULL,
	"integration_type" varchar(50) NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"error_message" text,
	"deployment_url" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "interstellar_nodes" (
	"id" serial PRIMARY KEY NOT NULL,
	"node_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"type" varchar NOT NULL,
	"status" varchar DEFAULT 'dormant',
	"coordinates" jsonb NOT NULL,
	"connections" integer DEFAULT 0,
	"processing_power" integer DEFAULT 0,
	"data_volume" varchar,
	"last_sync" timestamp DEFAULT now(),
	"configuration" jsonb,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "interstellar_nodes_node_id_unique" UNIQUE("node_id")
);
--> statement-breakpoint
CREATE TABLE "legal_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"url" text NOT NULL,
	"icon" text DEFAULT '📄',
	"category" text DEFAULT 'legal' NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"created_at" text DEFAULT 'now()'
);
--> statement-breakpoint
CREATE TABLE "media_projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"type" varchar NOT NULL,
	"status" varchar DEFAULT 'draft',
	"progress" integer DEFAULT 0,
	"description" text,
	"tags" jsonb DEFAULT '[]',
	"user_id" varchar NOT NULL,
	"file_url" text,
	"processing_settings" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "media_projects_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"plan_name" text NOT NULL,
	"amount" text NOT NULL,
	"currency" text DEFAULT 'USD',
	"paypal_order_id" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"metadata" jsonb,
	"created_at" text DEFAULT 'now()'
);
--> statement-breakpoint
CREATE TABLE "portfolio_projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image_url" text NOT NULL,
	"category" text NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"medium" text,
	"style" text,
	"theme" text,
	"client_name" text,
	"project_year" integer,
	"featured" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"artist_id" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "processing_engines" (
	"id" serial PRIMARY KEY NOT NULL,
	"engine_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"type" varchar NOT NULL,
	"status" varchar DEFAULT 'active',
	"usage" integer DEFAULT 0,
	"last_activity" timestamp DEFAULT now(),
	"configuration" jsonb,
	"capabilities" jsonb,
	CONSTRAINT "processing_engines_engine_id_unique" UNIQUE("engine_id")
);
--> statement-breakpoint
CREATE TABLE "pulse_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"pulse_id" varchar NOT NULL,
	"event_type" varchar NOT NULL,
	"event_timestamp" timestamp DEFAULT now(),
	"event_data" jsonb,
	"error_message" text,
	"processing_time_ms" integer
);
--> statement-breakpoint
CREATE TABLE "repositories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"description" text,
	"category" text DEFAULT 'documentation' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" text DEFAULT 'now()'
);
--> statement-breakpoint
CREATE TABLE "sector_mapping_cache" (
	"id" serial PRIMARY KEY NOT NULL,
	"cache_key" varchar(255) NOT NULL,
	"cache_data" jsonb NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "sector_mapping_cache_cache_key_unique" UNIQUE("cache_key")
);
--> statement-breakpoint
CREATE TABLE "sector_relationships" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_id" integer NOT NULL,
	"target_id" integer NOT NULL,
	"strength" numeric(3, 2) NOT NULL,
	"relationship_type" varchar(20) NOT NULL,
	"description" text,
	"bidirectional" boolean DEFAULT false,
	"weight" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sectors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"emoji" text NOT NULL,
	"description" text,
	"brand_count" integer DEFAULT 0,
	"subnode_count" integer DEFAULT 0,
	"price" text DEFAULT '29.99',
	"currency" text DEFAULT 'USD',
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sonic_grid_connections" (
	"id" serial PRIMARY KEY NOT NULL,
	"connection_name" varchar NOT NULL,
	"connection_type" varchar NOT NULL,
	"status" varchar DEFAULT 'active',
	"documents_processed" integer DEFAULT 0,
	"confidence_score" numeric(5, 2) DEFAULT '0.00',
	"last_activity" text DEFAULT 'now()',
	"configuration" jsonb
);
--> statement-breakpoint
CREATE TABLE "studio_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"studio_name" text DEFAULT 'SamFox Creative Studio',
	"studio_description" text,
	"studio_logo" text,
	"artist_name" text DEFAULT 'SamFox',
	"artist_bio" text,
	"artist_image" text,
	"contact_email" text,
	"social_links" jsonb DEFAULT '{}'::jsonb,
	"business_settings" jsonb DEFAULT '{"currency":"USD"}'::jsonb,
	"theme_settings" jsonb DEFAULT '{"primaryColor":"#8b5cf6","secondaryColor":"#ec4899","accentColor":"#06b6d4","fontFamily":"Inter"}'::jsonb,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "system_status" (
	"id" serial PRIMARY KEY NOT NULL,
	"service" text NOT NULL,
	"status" text NOT NULL,
	"last_checked" text DEFAULT 'now()',
	CONSTRAINT "system_status_service_unique" UNIQUE("service")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vault_actions" (
	"id" serial PRIMARY KEY NOT NULL,
	"action_id" varchar NOT NULL,
	"action_type" varchar NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"beneficiary" varchar NOT NULL,
	"transaction_id" varchar,
	"vault_signature" varchar NOT NULL,
	"sonic_validation" boolean DEFAULT false,
	"status" varchar DEFAULT 'pending',
	"executed_at" text DEFAULT 'now()',
	"metadata" jsonb,
	CONSTRAINT "vault_actions_action_id_unique" UNIQUE("action_id")
);
--> statement-breakpoint
CREATE TABLE "vault_trace_network" (
	"id" serial PRIMARY KEY NOT NULL,
	"node_id" varchar NOT NULL,
	"node_type" varchar NOT NULL,
	"node_name" varchar NOT NULL,
	"connections" jsonb DEFAULT '[]'::jsonb,
	"trace_layer" varchar NOT NULL,
	"claqtneqt_enabled" boolean DEFAULT true,
	"position" jsonb,
	"metadata" jsonb,
	"is_active" boolean DEFAULT true,
	"last_activity" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "vault_trace_network_node_id_unique" UNIQUE("node_id")
);
--> statement-breakpoint
ALTER TABLE "artwork_orders" ADD CONSTRAINT "artwork_orders_artwork_id_artworks_id_fk" FOREIGN KEY ("artwork_id") REFERENCES "public"."artworks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artworks" ADD CONSTRAINT "artworks_artist_id_users_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brands" ADD CONSTRAINT "brands_sector_id_sectors_id_fk" FOREIGN KEY ("sector_id") REFERENCES "public"."sectors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "charitable_distributions" ADD CONSTRAINT "charitable_distributions_transaction_id_banimal_transactions_transaction_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."banimal_transactions"("transaction_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "family_events" ADD CONSTRAINT "family_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "family_members" ADD CONSTRAINT "family_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "heritage_documents" ADD CONSTRAINT "heritage_documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "heritage_documents" ADD CONSTRAINT "heritage_documents_family_member_id_family_members_id_fk" FOREIGN KEY ("family_member_id") REFERENCES "public"."family_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "heritage_metrics" ADD CONSTRAINT "heritage_metrics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integration_deployments" ADD CONSTRAINT "integration_deployments_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_projects" ADD CONSTRAINT "portfolio_projects_artist_id_users_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pulse_history" ADD CONSTRAINT "pulse_history_pulse_id_ecosystem_pulses_pulse_id_fk" FOREIGN KEY ("pulse_id") REFERENCES "public"."ecosystem_pulses"("pulse_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sector_relationships" ADD CONSTRAINT "sector_relationships_source_id_sectors_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sectors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sector_relationships" ADD CONSTRAINT "sector_relationships_target_id_sectors_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."sectors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_integration_deployments_user_id" ON "integration_deployments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_integration_deployments_brand_id" ON "integration_deployments" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX "idx_integration_deployments_status" ON "integration_deployments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_integration_deployments_created_at" ON "integration_deployments" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");