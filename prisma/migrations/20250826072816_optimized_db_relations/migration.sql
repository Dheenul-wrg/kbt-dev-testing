/*
  Warnings:

  - You are about to drop the `edge_cache` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `trip_resource` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `trip_share_history` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."TripShareStatus" AS ENUM ('created', 'revoked', 'viewed', 'expired', 'permissions_changed', 'resent', 'link_regenerated');

-- DropForeignKey
ALTER TABLE "public"."edge_cache" DROP CONSTRAINT "edge_cache_from_trip_resource_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."edge_cache" DROP CONSTRAINT "edge_cache_to_trip_resource_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."trip_experiences" DROP CONSTRAINT "trip_experiences_trip_resource_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."trip_items" DROP CONSTRAINT "trip_items_edge_cache_key_fkey";

-- DropForeignKey
ALTER TABLE "public"."trip_items" DROP CONSTRAINT "trip_items_trip_resource_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."trip_resource" DROP CONSTRAINT "trip_resource_trip_resource_type_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."trip_share_history" DROP CONSTRAINT "trip_share_history_actor_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."trip_share_history" DROP CONSTRAINT "trip_share_history_trip_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_favorites" DROP CONSTRAINT "user_favorites_trip_resource_id_fkey";

-- DropIndex
DROP INDEX "public"."trip_items_trip_day_id_position_idx";

-- DropTable
DROP TABLE "public"."edge_cache";

-- DropTable
DROP TABLE "public"."trip_resource";

-- DropTable
DROP TABLE "public"."trip_share_history";

-- CreateTable
CREATE TABLE "public"."trip_resources" (
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

    CONSTRAINT "trip_resources_pkey" PRIMARY KEY ("trip_resource_id")
);

-- CreateTable
CREATE TABLE "public"."edge_caches" (
    "cache_key" TEXT NOT NULL,
    "from_trip_resource_id" INTEGER NOT NULL,
    "to_trip_resource_id" INTEGER NOT NULL,
    "mode" "public"."TravelMode" NOT NULL,
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

    CONSTRAINT "edge_caches_pkey" PRIMARY KEY ("cache_key")
);

-- CreateTable
CREATE TABLE "public"."trip_share_histories" (
    "share_event_id" SERIAL NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "actor_user_id" INTEGER,
    "target_type" VARCHAR(50) NOT NULL,
    "target_email" VARCHAR(255),
    "url" VARCHAR(1000),
    "status" "public"."TripShareStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trip_share_histories_pkey" PRIMARY KEY ("share_event_id")
);

-- CreateIndex
CREATE INDEX "trip_resources_trip_resource_type_id_idx" ON "public"."trip_resources"("trip_resource_type_id");

-- CreateIndex
CREATE INDEX "trip_resources_wp_trip_resource_id_idx" ON "public"."trip_resources"("wp_trip_resource_id");

-- CreateIndex
CREATE INDEX "trip_resources_status_idx" ON "public"."trip_resources"("status");

-- CreateIndex
CREATE INDEX "trip_resources_is_featured_idx" ON "public"."trip_resources"("is_featured");

-- CreateIndex
CREATE INDEX "trip_resources_created_at_idx" ON "public"."trip_resources"("created_at");

-- CreateIndex
CREATE INDEX "trip_resources_trip_resource_type_id_status_idx" ON "public"."trip_resources"("trip_resource_type_id", "status");

-- CreateIndex
CREATE INDEX "trip_resources_is_featured_status_idx" ON "public"."trip_resources"("is_featured", "status");

-- CreateIndex
CREATE INDEX "trip_resources_status_created_at_idx" ON "public"."trip_resources"("status", "created_at");

-- CreateIndex
CREATE INDEX "edge_caches_from_trip_resource_id_idx" ON "public"."edge_caches"("from_trip_resource_id");

-- CreateIndex
CREATE INDEX "edge_caches_to_trip_resource_id_idx" ON "public"."edge_caches"("to_trip_resource_id");

-- CreateIndex
CREATE INDEX "edge_caches_mode_idx" ON "public"."edge_caches"("mode");

-- CreateIndex
CREATE INDEX "edge_caches_status_idx" ON "public"."edge_caches"("status");

-- CreateIndex
CREATE INDEX "edge_caches_expires_at_idx" ON "public"."edge_caches"("expires_at");

-- CreateIndex
CREATE INDEX "edge_caches_usage_count_idx" ON "public"."edge_caches"("usage_count");

-- CreateIndex
CREATE INDEX "edge_caches_from_trip_resource_id_to_trip_resource_id_mode_idx" ON "public"."edge_caches"("from_trip_resource_id", "to_trip_resource_id", "mode");

-- CreateIndex
CREATE INDEX "edge_caches_status_expires_at_idx" ON "public"."edge_caches"("status", "expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "edge_caches_from_trip_resource_id_to_trip_resource_id_mode__key" ON "public"."edge_caches"("from_trip_resource_id", "to_trip_resource_id", "mode", "provider");

-- CreateIndex
CREATE INDEX "trip_share_histories_trip_id_idx" ON "public"."trip_share_histories"("trip_id");

-- CreateIndex
CREATE INDEX "trip_share_histories_actor_user_id_idx" ON "public"."trip_share_histories"("actor_user_id");

-- CreateIndex
CREATE INDEX "trip_share_histories_target_type_idx" ON "public"."trip_share_histories"("target_type");

-- CreateIndex
CREATE INDEX "trip_share_histories_status_idx" ON "public"."trip_share_histories"("status");

-- CreateIndex
CREATE INDEX "trip_share_histories_created_at_idx" ON "public"."trip_share_histories"("created_at");

-- CreateIndex
CREATE INDEX "trip_share_histories_trip_id_status_idx" ON "public"."trip_share_histories"("trip_id", "status");

-- CreateIndex
CREATE INDEX "trip_share_histories_actor_user_id_created_at_idx" ON "public"."trip_share_histories"("actor_user_id", "created_at");

-- AddForeignKey
ALTER TABLE "public"."trip_resources" ADD CONSTRAINT "trip_resources_trip_resource_type_id_fkey" FOREIGN KEY ("trip_resource_type_id") REFERENCES "public"."trip_resource_types"("trip_resource_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trip_items" ADD CONSTRAINT "trip_items_trip_resource_id_fkey" FOREIGN KEY ("trip_resource_id") REFERENCES "public"."trip_resources"("trip_resource_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trip_items" ADD CONSTRAINT "trip_items_edge_cache_key_fkey" FOREIGN KEY ("edge_cache_key") REFERENCES "public"."edge_caches"("cache_key") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."edge_caches" ADD CONSTRAINT "edge_caches_from_trip_resource_id_fkey" FOREIGN KEY ("from_trip_resource_id") REFERENCES "public"."trip_resources"("trip_resource_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."edge_caches" ADD CONSTRAINT "edge_caches_to_trip_resource_id_fkey" FOREIGN KEY ("to_trip_resource_id") REFERENCES "public"."trip_resources"("trip_resource_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trip_experiences" ADD CONSTRAINT "trip_experiences_trip_resource_id_fkey" FOREIGN KEY ("trip_resource_id") REFERENCES "public"."trip_resources"("trip_resource_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_favorites" ADD CONSTRAINT "user_favorites_trip_resource_id_fkey" FOREIGN KEY ("trip_resource_id") REFERENCES "public"."trip_resources"("trip_resource_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trip_share_histories" ADD CONSTRAINT "trip_share_histories_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("trip_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trip_share_histories" ADD CONSTRAINT "trip_share_histories_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "public"."user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
