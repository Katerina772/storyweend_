-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "map_image_url" VARCHAR(500);

-- CreateTable
CREATE TABLE "map_markers" (
    "id" BIGSERIAL NOT NULL,
    "project_id" BIGINT NOT NULL,
    "location_id" BIGINT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "map_markers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "map_markers_project_id_idx" ON "map_markers"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "map_markers_location_id_key" ON "map_markers"("location_id");

-- AddForeignKey
ALTER TABLE "map_markers" ADD CONSTRAINT "map_markers_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "map_markers" ADD CONSTRAINT "map_markers_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
