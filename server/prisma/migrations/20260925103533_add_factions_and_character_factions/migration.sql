-- CreateTable
CREATE TABLE "factions" (
    "id" BIGSERIAL NOT NULL,
    "project_id" BIGINT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "symbol" VARCHAR(255),
    "description" TEXT,
    "history" TEXT,
    "leader" VARCHAR(150),
    "territory" VARCHAR(150),
    "created_by" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "factions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character_factions" (
    "id" BIGSERIAL NOT NULL,
    "character_id" BIGINT NOT NULL,
    "faction_id" BIGINT NOT NULL,
    "role" VARCHAR(50),

    CONSTRAINT "character_factions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "factions_project_id_idx" ON "factions"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "character_factions_character_id_faction_id_key" ON "character_factions"("character_id", "faction_id");

-- AddForeignKey
ALTER TABLE "factions" ADD CONSTRAINT "factions_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factions" ADD CONSTRAINT "factions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_factions" ADD CONSTRAINT "character_factions_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_factions" ADD CONSTRAINT "character_factions_faction_id_fkey" FOREIGN KEY ("faction_id") REFERENCES "factions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
