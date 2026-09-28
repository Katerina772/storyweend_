-- CreateTable
CREATE TABLE "lore_entries" (
    "id" BIGSERIAL NOT NULL,
    "project_id" BIGINT NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "category" VARCHAR(50),
    "content" TEXT,
    "created_by" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lore_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lore_entries_project_id_idx" ON "lore_entries"("project_id");

-- CreateIndex
CREATE INDEX "lore_entries_category_idx" ON "lore_entries"("category");

-- AddForeignKey
ALTER TABLE "lore_entries" ADD CONSTRAINT "lore_entries_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lore_entries" ADD CONSTRAINT "lore_entries_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
