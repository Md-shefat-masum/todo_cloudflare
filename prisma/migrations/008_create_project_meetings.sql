-- Create project_meetings table
CREATE TABLE IF NOT EXISTS "project_meetings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "project_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "description" TEXT,
    "creator" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "idx_meetings_project_id" ON "project_meetings"("project_id");
CREATE INDEX IF NOT EXISTS "idx_meetings_creator" ON "project_meetings"("creator");
CREATE INDEX IF NOT EXISTS "idx_meetings_date" ON "project_meetings"("date");
CREATE UNIQUE INDEX IF NOT EXISTS "project_meetings_slug_key" ON "project_meetings"("slug");
