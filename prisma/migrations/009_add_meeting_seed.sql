-- Insert 3 demo meetings for project_id = 1
INSERT INTO "project_meetings" (
  "project_id",
  "title",
  "date",
  "description",
  "creator",
  "slug",
  "created_at",
  "updated_at"
) VALUES
  (1, 'Q1 2026 Review Meeting', '2026-02-15 10:00:00', 'Quarterly review meeting - Q1 2026 planning and strategy discussion', 1, '1-q1-review-2026-1736934000000', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 'Team Standup', '2026-02-20 14:30:00', 'Team standup meeting - Daily progress update and blockers discussion', 1, '1-team-standup-2026-1737271800000', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 'Project Kickoff', '2026-02-25 09:00:00', 'Project kickoff meeting - Initial planning and resource allocation', 1, '1-project-kickoff-2026-1737608400000', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
