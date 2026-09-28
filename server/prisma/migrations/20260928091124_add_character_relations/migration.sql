-- CreateEnum
CREATE TYPE "RelationType" AS ENUM ('FRIEND', 'ENEMY', 'FAMILY', 'ALLY', 'RIVAL', 'MENTOR', 'ROMANTIC', 'OTHER');

-- CreateTable
CREATE TABLE "character_relations" (
    "id" BIGSERIAL NOT NULL,
    "project_id" BIGINT NOT NULL,
    "character_from_id" BIGINT NOT NULL,
    "character_to_id" BIGINT NOT NULL,
    "type" "RelationType" NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "character_relations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "character_relations_project_id_idx" ON "character_relations"("project_id");

-- CreateIndex
CREATE INDEX "character_relations_character_from_id_idx" ON "character_relations"("character_from_id");

-- CreateIndex
CREATE INDEX "character_relations_character_to_id_idx" ON "character_relations"("character_to_id");

-- CreateIndex
CREATE UNIQUE INDEX "character_relations_project_id_character_from_id_character__key" ON "character_relations"("project_id", "character_from_id", "character_to_id", "type");

-- AddForeignKey
ALTER TABLE "character_relations" ADD CONSTRAINT "character_relations_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_relations" ADD CONSTRAINT "character_relations_character_from_id_fkey" FOREIGN KEY ("character_from_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_relations" ADD CONSTRAINT "character_relations_character_to_id_fkey" FOREIGN KEY ("character_to_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
