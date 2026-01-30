-- Add serial column for Kanban board
-- Run manually for existing DBs: npx wrangler d1 execute todo --local --file=prisma/migrations/011_add_serial_to_tasks.sql
-- Skip if serial column already exists (error will indicate)
ALTER TABLE "tasks" ADD COLUMN "serial" INTEGER DEFAULT 1;
CREATE INDEX IF NOT EXISTS "idx_tasks_task_status_serial" ON "tasks"("task_status", "serial");
