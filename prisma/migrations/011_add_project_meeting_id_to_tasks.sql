-- Add project_meeting_id column to tasks table
ALTER TABLE "tasks" ADD COLUMN "project_meeting_id" INTEGER;

-- Create index for project_meeting_id
CREATE INDEX IF NOT EXISTS "idx_tasks_project_meeting_id" ON "tasks"("project_meeting_id");
