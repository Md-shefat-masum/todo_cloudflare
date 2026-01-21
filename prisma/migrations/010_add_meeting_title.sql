-- Add title column to project_meetings table
ALTER TABLE "project_meetings" ADD COLUMN "title" TEXT NOT NULL DEFAULT 'Untitled Meeting';
