-- CreateEnum
CREATE TYPE "public"."GenericStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "public"."Visibility" AS ENUM ('private', 'visible', 'shared');

-- CreateEnum
CREATE TYPE "public"."TravelMode" AS ENUM ('driving', 'walking', 'cycling', 'driving_traffic');

-- CreateEnum
CREATE TYPE "public"."TwoFactorMethod" AS ENUM ('email', 'totp');

-- CreateEnum
CREATE TYPE "public"."TwoFactorPurpose" AS ENUM ('login', 'verify_email', 'reset_password', 'mfa_challenge');

-- CreateEnum
CREATE TYPE "public"."TwoFactorStatus" AS ENUM ('expired', 'success');

-- CreateTable
CREATE TABLE "public"."roles" (
    "role_id" SERIAL NOT NULL,
    "role_name" VARCHAR(100) NOT NULL,
    "status" "public"."GenericStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "public"."region_filters" (
    "region_id" SERIAL NOT NULL,
    "wp_region_id" INTEGER,
    "region_name" VARCHAR(255) NOT NULL,
    "status" "public"."GenericStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "region_filters_pkey" PRIMARY KEY ("region_id")
);

-- CreateTable
CREATE TABLE "public"."category_filters" (
    "category_id" SERIAL NOT NULL,
    "wp_category_id" INTEGER,
    "category_name" VARCHAR(255) NOT NULL,
    "status" "public"."GenericStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_filters_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "public"."trip_resource_types" (
    "trip_resource_type_id" SERIAL NOT NULL,
    "type_name" VARCHAR(100) NOT NULL,
    "status" "public"."GenericStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trip_resource_types_pkey" PRIMARY KEY ("trip_resource_type_id")
);

-- CreateTable
CREATE TABLE "public"."user" (
    "user_id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role_id" INTEGER NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."GenericStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."accounts" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "providerAccountId" VARCHAR(255) NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" VARCHAR(50),
    "scope" VARCHAR(500),
    "id_token" TEXT,
    "status" "public"."GenericStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."permissions" (
    "permission_id" SERIAL NOT NULL,
    "perm_key" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),
    "status" "public"."GenericStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("permission_id")
);

-- CreateTable
CREATE TABLE "public"."role_permissions" (
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "public"."trips" (
    "trip_id" SERIAL NOT NULL,
    "trip_name" VARCHAR(255) NOT NULL,
    "total_days" SMALLINT NOT NULL,
    "description" TEXT,
    "status" "public"."GenericStatus" NOT NULL,
    "is_recommended" BOOLEAN NOT NULL DEFAULT false,
    "recommended_by" VARCHAR(255),
    "visibility" "public"."Visibility" NOT NULL,
    "default_mode" "public"."TravelMode" NOT NULL,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("trip_id")
);

-- CreateTable
CREATE TABLE "public"."trip_days" (
    "trip_day_id" SERIAL NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "day_number" SMALLINT NOT NULL,
    "notes" TEXT,
    "status" "public"."GenericStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trip_days_pkey" PRIMARY KEY ("trip_day_id")
);

-- CreateTable
CREATE TABLE "public"."trip_resource" (
    "trip_resource_id" SERIAL NOT NULL,
    "wp_trip_resource_id" INTEGER,
    "trip_resource_type_id" INTEGER NOT NULL,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "trip_resource_title" VARCHAR(500) NOT NULL,
    "trip_resource_location" JSONB NOT NULL,
    "image_url" VARCHAR(1000),
    "status" "public"."GenericStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trip_resource_pkey" PRIMARY KEY ("trip_resource_id")
);

-- CreateTable
CREATE TABLE "public"."trip_items" (
    "trip_item_id" SERIAL NOT NULL,
    "trip_day_id" INTEGER NOT NULL,
    "trip_resource_id" INTEGER NOT NULL,
    "position" SMALLINT NOT NULL,
    "experience_id" INTEGER,
    "status" "public"."GenericStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "edge_cache_key" TEXT,

    CONSTRAINT "trip_items_pkey" PRIMARY KEY ("trip_item_id")
);

-- CreateTable
CREATE TABLE "public"."edge_cache" (
    "cache_key" TEXT NOT NULL,
    "from_trip_resource_id" INTEGER NOT NULL,
    "to_trip_resource_id" INTEGER NOT NULL,
    "mode" TEXT NOT NULL,
    "provider_params" JSONB,
    "distance_m" INTEGER,
    "duration_s" INTEGER,
    "geometry_polyline" TEXT,
    "provider" TEXT,
    "usage_count" INTEGER NOT NULL DEFAULT 0,
    "status" "public"."GenericStatus" NOT NULL,
    "computed_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "edge_cache_pkey" PRIMARY KEY ("cache_key")
);

-- CreateTable
CREATE TABLE "public"."trip_experiences" (
    "experience_id" SERIAL NOT NULL,
    "trip_item_id" INTEGER NOT NULL,
    "trip_resource_id" INTEGER NOT NULL,
    "status" "public"."GenericStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trip_experiences_pkey" PRIMARY KEY ("experience_id")
);

-- CreateTable
CREATE TABLE "public"."user_favorites" (
    "favorite_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "trip_resource_id" INTEGER NOT NULL,
    "status" "public"."GenericStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_favorites_pkey" PRIMARY KEY ("favorite_id")
);

-- CreateTable
CREATE TABLE "public"."trip_share_history" (
    "share_event_id" SERIAL NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "actor_user_id" INTEGER,
    "target_type" VARCHAR(50) NOT NULL,
    "target_email" VARCHAR(255),
    "url" VARCHAR(1000),
    "status" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trip_share_history_pkey" PRIMARY KEY ("share_event_id")
);

-- CreateTable
CREATE TABLE "public"."two_factor_codes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "method" "public"."TwoFactorMethod" NOT NULL,
    "purpose" "public"."TwoFactorPurpose" NOT NULL,
    "code_hash" VARCHAR(255) NOT NULL,
    "issued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "consumed_at" TIMESTAMP(3),
    "attempts" SMALLINT NOT NULL DEFAULT 0,
    "sent_to" VARCHAR(255) NOT NULL,
    "status" "public"."TwoFactorStatus",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "two_factor_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_name_key" ON "public"."roles"("role_name");

-- CreateIndex
CREATE INDEX "roles_status_idx" ON "public"."roles"("status");

-- CreateIndex
CREATE UNIQUE INDEX "region_filters_region_name_key" ON "public"."region_filters"("region_name");

-- CreateIndex
CREATE INDEX "region_filters_status_idx" ON "public"."region_filters"("status");

-- CreateIndex
CREATE INDEX "region_filters_wp_region_id_idx" ON "public"."region_filters"("wp_region_id");

-- CreateIndex
CREATE UNIQUE INDEX "category_filters_category_name_key" ON "public"."category_filters"("category_name");

-- CreateIndex
CREATE INDEX "category_filters_status_idx" ON "public"."category_filters"("status");

-- CreateIndex
CREATE INDEX "category_filters_wp_category_id_idx" ON "public"."category_filters"("wp_category_id");

-- CreateIndex
CREATE UNIQUE INDEX "trip_resource_types_type_name_key" ON "public"."trip_resource_types"("type_name");

-- CreateIndex
CREATE INDEX "trip_resource_types_status_idx" ON "public"."trip_resource_types"("status");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE INDEX "user_role_id_idx" ON "public"."user"("role_id");

-- CreateIndex
CREATE INDEX "user_status_idx" ON "public"."user"("status");

-- CreateIndex
CREATE INDEX "user_email_verified_idx" ON "public"."user"("email_verified");

-- CreateIndex
CREATE INDEX "user_created_at_idx" ON "public"."user"("created_at");

-- CreateIndex
CREATE INDEX "user_status_email_verified_idx" ON "public"."user"("status", "email_verified");

-- CreateIndex
CREATE INDEX "user_role_id_status_idx" ON "public"."user"("role_id", "status");

-- CreateIndex
CREATE INDEX "accounts_userId_idx" ON "public"."accounts"("userId");

-- CreateIndex
CREATE INDEX "accounts_provider_idx" ON "public"."accounts"("provider");

-- CreateIndex
CREATE INDEX "accounts_status_idx" ON "public"."accounts"("status");

-- CreateIndex
CREATE INDEX "accounts_expires_at_idx" ON "public"."accounts"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "public"."accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_perm_key_key" ON "public"."permissions"("perm_key");

-- CreateIndex
CREATE INDEX "permissions_status_idx" ON "public"."permissions"("status");

-- CreateIndex
CREATE INDEX "trips_created_by_idx" ON "public"."trips"("created_by");

-- CreateIndex
CREATE INDEX "trips_status_idx" ON "public"."trips"("status");

-- CreateIndex
CREATE INDEX "trips_visibility_idx" ON "public"."trips"("visibility");

-- CreateIndex
CREATE INDEX "trips_is_recommended_idx" ON "public"."trips"("is_recommended");

-- CreateIndex
CREATE INDEX "trips_created_at_idx" ON "public"."trips"("created_at");

-- CreateIndex
CREATE INDEX "trips_status_visibility_idx" ON "public"."trips"("status", "visibility");

-- CreateIndex
CREATE INDEX "trips_created_by_status_idx" ON "public"."trips"("created_by", "status");

-- CreateIndex
CREATE INDEX "trips_is_recommended_status_idx" ON "public"."trips"("is_recommended", "status");

-- CreateIndex
CREATE INDEX "trip_days_trip_id_idx" ON "public"."trip_days"("trip_id");

-- CreateIndex
CREATE INDEX "trip_days_status_idx" ON "public"."trip_days"("status");

-- CreateIndex
CREATE INDEX "trip_days_trip_id_day_number_idx" ON "public"."trip_days"("trip_id", "day_number");

-- CreateIndex
CREATE UNIQUE INDEX "trip_days_trip_id_day_number_key" ON "public"."trip_days"("trip_id", "day_number");

-- CreateIndex
CREATE INDEX "trip_resource_trip_resource_type_id_idx" ON "public"."trip_resource"("trip_resource_type_id");

-- CreateIndex
CREATE INDEX "trip_resource_wp_trip_resource_id_idx" ON "public"."trip_resource"("wp_trip_resource_id");

-- CreateIndex
CREATE INDEX "trip_resource_status_idx" ON "public"."trip_resource"("status");

-- CreateIndex
CREATE INDEX "trip_resource_is_featured_idx" ON "public"."trip_resource"("is_featured");

-- CreateIndex
CREATE INDEX "trip_resource_created_at_idx" ON "public"."trip_resource"("created_at");

-- CreateIndex
CREATE INDEX "trip_resource_trip_resource_type_id_status_idx" ON "public"."trip_resource"("trip_resource_type_id", "status");

-- CreateIndex
CREATE INDEX "trip_resource_is_featured_status_idx" ON "public"."trip_resource"("is_featured", "status");

-- CreateIndex
CREATE INDEX "trip_resource_status_created_at_idx" ON "public"."trip_resource"("status", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "trip_items_experience_id_key" ON "public"."trip_items"("experience_id");

-- CreateIndex
CREATE INDEX "trip_items_trip_day_id_idx" ON "public"."trip_items"("trip_day_id");

-- CreateIndex
CREATE INDEX "trip_items_trip_resource_id_idx" ON "public"."trip_items"("trip_resource_id");

-- CreateIndex
CREATE INDEX "trip_items_edge_cache_key_idx" ON "public"."trip_items"("edge_cache_key");

-- CreateIndex
CREATE INDEX "trip_items_status_idx" ON "public"."trip_items"("status");

-- CreateIndex
CREATE INDEX "trip_items_experience_id_idx" ON "public"."trip_items"("experience_id");

-- CreateIndex
CREATE INDEX "trip_items_trip_day_id_position_idx" ON "public"."trip_items"("trip_day_id", "position");

-- CreateIndex
CREATE INDEX "trip_items_trip_day_id_status_idx" ON "public"."trip_items"("trip_day_id", "status");

-- CreateIndex
CREATE INDEX "trip_items_trip_resource_id_status_idx" ON "public"."trip_items"("trip_resource_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "trip_items_trip_day_id_position_key" ON "public"."trip_items"("trip_day_id", "position");

-- CreateIndex
CREATE INDEX "edge_cache_from_trip_resource_id_idx" ON "public"."edge_cache"("from_trip_resource_id");

-- CreateIndex
CREATE INDEX "edge_cache_to_trip_resource_id_idx" ON "public"."edge_cache"("to_trip_resource_id");

-- CreateIndex
CREATE INDEX "edge_cache_mode_idx" ON "public"."edge_cache"("mode");

-- CreateIndex
CREATE INDEX "edge_cache_status_idx" ON "public"."edge_cache"("status");

-- CreateIndex
CREATE INDEX "edge_cache_expires_at_idx" ON "public"."edge_cache"("expires_at");

-- CreateIndex
CREATE INDEX "edge_cache_usage_count_idx" ON "public"."edge_cache"("usage_count");

-- CreateIndex
CREATE INDEX "edge_cache_from_trip_resource_id_to_trip_resource_id_mode_idx" ON "public"."edge_cache"("from_trip_resource_id", "to_trip_resource_id", "mode");

-- CreateIndex
CREATE INDEX "edge_cache_status_expires_at_idx" ON "public"."edge_cache"("status", "expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "edge_cache_from_trip_resource_id_to_trip_resource_id_mode_p_key" ON "public"."edge_cache"("from_trip_resource_id", "to_trip_resource_id", "mode", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "trip_experiences_trip_item_id_key" ON "public"."trip_experiences"("trip_item_id");

-- CreateIndex
CREATE INDEX "trip_experiences_trip_resource_id_idx" ON "public"."trip_experiences"("trip_resource_id");

-- CreateIndex
CREATE INDEX "trip_experiences_status_idx" ON "public"."trip_experiences"("status");

-- CreateIndex
CREATE INDEX "trip_experiences_created_at_idx" ON "public"."trip_experiences"("created_at");

-- CreateIndex
CREATE INDEX "trip_experiences_trip_resource_id_status_idx" ON "public"."trip_experiences"("trip_resource_id", "status");

-- CreateIndex
CREATE INDEX "user_favorites_user_id_idx" ON "public"."user_favorites"("user_id");

-- CreateIndex
CREATE INDEX "user_favorites_trip_resource_id_idx" ON "public"."user_favorites"("trip_resource_id");

-- CreateIndex
CREATE INDEX "user_favorites_status_idx" ON "public"."user_favorites"("status");

-- CreateIndex
CREATE INDEX "user_favorites_created_at_idx" ON "public"."user_favorites"("created_at");

-- CreateIndex
CREATE INDEX "user_favorites_user_id_status_idx" ON "public"."user_favorites"("user_id", "status");

-- CreateIndex
CREATE INDEX "user_favorites_trip_resource_id_status_idx" ON "public"."user_favorites"("trip_resource_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "user_favorites_user_id_trip_resource_id_key" ON "public"."user_favorites"("user_id", "trip_resource_id");

-- CreateIndex
CREATE INDEX "trip_share_history_trip_id_idx" ON "public"."trip_share_history"("trip_id");

-- CreateIndex
CREATE INDEX "trip_share_history_actor_user_id_idx" ON "public"."trip_share_history"("actor_user_id");

-- CreateIndex
CREATE INDEX "trip_share_history_target_type_idx" ON "public"."trip_share_history"("target_type");

-- CreateIndex
CREATE INDEX "trip_share_history_status_idx" ON "public"."trip_share_history"("status");

-- CreateIndex
CREATE INDEX "trip_share_history_created_at_idx" ON "public"."trip_share_history"("created_at");

-- CreateIndex
CREATE INDEX "trip_share_history_trip_id_status_idx" ON "public"."trip_share_history"("trip_id", "status");

-- CreateIndex
CREATE INDEX "trip_share_history_actor_user_id_created_at_idx" ON "public"."trip_share_history"("actor_user_id", "created_at");

-- CreateIndex
CREATE INDEX "two_factor_codes_user_id_idx" ON "public"."two_factor_codes"("user_id");

-- CreateIndex
CREATE INDEX "two_factor_codes_purpose_idx" ON "public"."two_factor_codes"("purpose");

-- CreateIndex
CREATE INDEX "two_factor_codes_expires_at_idx" ON "public"."two_factor_codes"("expires_at");

-- CreateIndex
CREATE INDEX "two_factor_codes_method_idx" ON "public"."two_factor_codes"("method");

-- CreateIndex
CREATE INDEX "two_factor_codes_status_idx" ON "public"."two_factor_codes"("status");

-- CreateIndex
CREATE INDEX "two_factor_codes_user_id_purpose_idx" ON "public"."two_factor_codes"("user_id", "purpose");

-- CreateIndex
CREATE INDEX "two_factor_codes_user_id_method_idx" ON "public"."two_factor_codes"("user_id", "method");

-- CreateIndex
CREATE INDEX "two_factor_codes_expires_at_status_idx" ON "public"."two_factor_codes"("expires_at", "status");

-- AddForeignKey
ALTER TABLE "public"."user" ADD CONSTRAINT "user_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("permission_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trips" ADD CONSTRAINT "trips_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trip_days" ADD CONSTRAINT "trip_days_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("trip_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trip_resource" ADD CONSTRAINT "trip_resource_trip_resource_type_id_fkey" FOREIGN KEY ("trip_resource_type_id") REFERENCES "public"."trip_resource_types"("trip_resource_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trip_items" ADD CONSTRAINT "trip_items_trip_day_id_fkey" FOREIGN KEY ("trip_day_id") REFERENCES "public"."trip_days"("trip_day_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trip_items" ADD CONSTRAINT "trip_items_trip_resource_id_fkey" FOREIGN KEY ("trip_resource_id") REFERENCES "public"."trip_resource"("trip_resource_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trip_items" ADD CONSTRAINT "trip_items_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "public"."trip_experiences"("experience_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trip_items" ADD CONSTRAINT "trip_items_edge_cache_key_fkey" FOREIGN KEY ("edge_cache_key") REFERENCES "public"."edge_cache"("cache_key") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."edge_cache" ADD CONSTRAINT "edge_cache_from_trip_resource_id_fkey" FOREIGN KEY ("from_trip_resource_id") REFERENCES "public"."trip_resource"("trip_resource_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."edge_cache" ADD CONSTRAINT "edge_cache_to_trip_resource_id_fkey" FOREIGN KEY ("to_trip_resource_id") REFERENCES "public"."trip_resource"("trip_resource_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trip_experiences" ADD CONSTRAINT "trip_experiences_trip_item_id_fkey" FOREIGN KEY ("trip_item_id") REFERENCES "public"."trip_items"("trip_item_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trip_experiences" ADD CONSTRAINT "trip_experiences_trip_resource_id_fkey" FOREIGN KEY ("trip_resource_id") REFERENCES "public"."trip_resource"("trip_resource_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_favorites" ADD CONSTRAINT "user_favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_favorites" ADD CONSTRAINT "user_favorites_trip_resource_id_fkey" FOREIGN KEY ("trip_resource_id") REFERENCES "public"."trip_resource"("trip_resource_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trip_share_history" ADD CONSTRAINT "trip_share_history_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("trip_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trip_share_history" ADD CONSTRAINT "trip_share_history_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "public"."user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."two_factor_codes" ADD CONSTRAINT "two_factor_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
