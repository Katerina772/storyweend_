-- CreateEnum
CREATE TYPE "Alignment" AS ENUM ('POSITIVE', 'NEGATIVE', 'NEUTRAL');

-- CreateTable
CREATE TABLE "characters" (
    "id" BIGSERIAL NOT NULL,
    "project_id" BIGINT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "portrait" VARCHAR(255),
    "description" TEXT,
    "biography" TEXT,
    "role" VARCHAR(50),
    "alignment" "Alignment" NOT NULL DEFAULT 'NEUTRAL',
    "created_by" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "characters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "characters_project_id_idx" ON "characters"("project_id");

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
