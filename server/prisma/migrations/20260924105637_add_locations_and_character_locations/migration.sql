-- CreateTable
CREATE TABLE "locations" (
    "id" BIGSERIAL NOT NULL,
    "project_id" BIGINT NOT NULL,
    "parent_id" BIGINT,
    "name" VARCHAR(100) NOT NULL,
    "type" VARCHAR(50),
    "population" INTEGER,
    "image" VARCHAR(255),
    "description" TEXT,
    "history" TEXT,
    "created_by" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character_locations" (
    "id" BIGSERIAL NOT NULL,
    "character_id" BIGINT NOT NULL,
    "location_id" BIGINT NOT NULL,
    "type" VARCHAR(50),

    CONSTRAINT "character_locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "locations_project_id_idx" ON "locations"("project_id");

-- CreateIndex
CREATE INDEX "locations_parent_id_idx" ON "locations"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "character_locations_character_id_location_id_type_key" ON "character_locations"("character_id", "location_id", "type");

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_locations" ADD CONSTRAINT "character_locations_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_locations" ADD CONSTRAINT "character_locations_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
