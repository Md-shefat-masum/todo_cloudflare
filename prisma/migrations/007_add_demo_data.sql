-- Insert 10 demo tasks with project_id = 1
INSERT INTO "users" (
  "name",
  "email",
  "password",
  "created_at",
  "updated_at"
) VALUES
  ('shefat', 'myphoto288@gmail.com', '11221122', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
  
INSERT INTO "projects" (
  "id",
  "title",
  "description",
  "creator",
  "created_at",
  "updated_at"
) VALUES
  (1, 'Project 1', 'Description 1', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "projects" (
  "id",
  "title",
  "description",
  "creator",
  "created_at",
  "updated_at"
) VALUES
  (2, 'Project 2', 'Description 2', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "tasks" (
  "project_id",
  "project_meeting_id",
  "parent_task_id",
  "title",
  "description",
  "priority",
  "task_status",
  "submission_date",
  "assigned_to",
  "created_at",
  "updated_at"
) VALUES
  (1, 1, NULL, 'Design User Interface', 'Create mockups and wireframes for the main dashboard', 'high', 'in_progress', datetime('now', '-5 days'), (SELECT id FROM users WHERE email = 'myphoto288@gmail.com'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 1, NULL, 'Implement Authentication', 'Set up JWT-based authentication system', 'urgent', 'pending', datetime('now', '-6 days'), (SELECT id FROM users WHERE email = 'myphoto288@gmail.com'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 2, NULL, 'Database Schema Design', 'Design and implement database schema for all entities', 'high', 'completed', datetime('now', '-7 days'), (SELECT id FROM users WHERE email = 'myphoto288@gmail.com'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 2, NULL, 'API Endpoints Development', 'Create RESTful API endpoints for all features', 'mid', 'in_progress', datetime('now', '-8 days'), (SELECT id FROM users WHERE email = 'myphoto288@gmail.com'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 3, NULL, 'Frontend Components', 'Build reusable Vue components for the UI', 'mid', 'pending', datetime('now', '-9 days'), (SELECT id FROM users WHERE email = 'myphoto288@gmail.com'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 3, NULL, 'Testing Suite', 'Write unit and integration tests for all modules', 'low', 'pending', datetime('now', '-10 days'), (SELECT id FROM users WHERE email = 'myphoto288@gmail.com'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 1, NULL, 'Deployment Configuration', 'Set up CI/CD pipeline and deployment scripts', 'mid', 'pending', datetime('now', '-5 days'), (SELECT id FROM users WHERE email = 'myphoto288@gmail.com'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 2, NULL, 'Documentation', 'Write comprehensive documentation for the project', 'low', 'pending', datetime('now', '-6 days'), (SELECT id FROM users WHERE email = 'myphoto288@gmail.com'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 3, NULL, 'Performance Optimization', 'Optimize database queries and API response times', 'high', 'pending', datetime('now', '-7 days'), (SELECT id FROM users WHERE email = 'myphoto288@gmail.com'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 1, NULL, 'Security Audit', 'Review and fix security vulnerabilities', 'urgent', 'pending', datetime('now', '-8 days'), (SELECT id FROM users WHERE email = 'myphoto288@gmail.com'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 1, NULL, 'User Profile Module', 'Create user profile view and edit functionality', 'mid', 'pending', datetime('now', '-11 days'), (SELECT id FROM users WHERE email = 'myphoto288@gmail.com'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 2, NULL, 'Role Management', 'Implement role-based access control system', 'high', 'in_progress', datetime('now', '-12 days'), (SELECT id FROM users WHERE email = 'myphoto288@gmail.com'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 3, NULL, 'Notification System', 'Build in-app notification service', 'mid', 'pending', datetime('now', '-13 days'), (SELECT id FROM users WHERE email = 'myphoto288@gmail.com'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 1, NULL, 'Audit Logs', 'Track and store user activity logs', 'low', 'pending', datetime('now', '-14 days'), (SELECT id FROM users WHERE email = 'myphoto288@gmail.com'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 2, NULL, 'File Upload Feature', 'Implement secure file upload and storage', 'high', 'pending', datetime('now', '-15 days'), (SELECT id FROM users WHERE email = 'myphoto288@gmail.com'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 3, NULL, 'Search Functionality', 'Add full-text search across key entities', 'mid', 'in_progress', datetime('now', '-16 days'), (SELECT id FROM users WHERE email = 'myphoto288@gmail.com'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 1, NULL, 'Email Integration', 'Configure transactional email service', 'mid', 'pending', datetime('now', '-17 days'), (SELECT id FROM users WHERE email = 'myphoto288@gmail.com'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 2, NULL, 'Error Handling', 'Standardize API error responses', 'high', 'completed', datetime('now', '-18 days'), (SELECT id FROM users WHERE email = 'myphoto288@gmail.com'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 3, NULL, 'Logging System', 'Set up centralized application logging', 'low', 'pending', datetime('now', '-19 days'), (SELECT id FROM users WHERE email = 'myphoto288@gmail.com'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 1, NULL, 'Password Recovery', 'Implement forgot-password and reset flow', 'urgent', 'pending', datetime('now', '-20 days'), (SELECT id FROM users WHERE email = 'myphoto288@gmail.com'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 2, NULL, 'Data Seeding', 'Create seed data for development and testing', 'low', 'completed', datetime('now', '-21 days'), (SELECT id FROM users WHERE email = 'myphoto288@gmail.com'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 3, NULL, 'Pagination Support', 'Add pagination to list API endpoints', 'mid', 'in_progress', datetime('now', '-22 days'), (SELECT id FROM users WHERE email = 'myphoto288@gmail.com'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 1, NULL, 'Caching Layer', 'Introduce Redis caching for frequent queries', 'high', 'pending', datetime('now', '-23 days'), (SELECT id FROM users WHERE email = 'myphoto288@gmail.com'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 2, NULL, 'Rate Limiting', 'Apply API rate limiting to prevent abuse', 'urgent', 'pending', datetime('now', '-24 days'), (SELECT id FROM users WHERE email = 'myphoto288@gmail.com'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 3, NULL, 'Localization Support', 'Prepare app for multi-language support', 'low', 'pending', datetime('now', '-25 days'), (SELECT id FROM users WHERE email = 'myphoto288@gmail.com'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 1, NULL, 'Mobile Responsiveness', 'Optimize UI for mobile and tablet screens', 'mid', 'pending', datetime('now', '-26 days'), (SELECT id FROM users WHERE email = 'myphoto288@gmail.com'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 2, NULL, 'Webhook Integration', 'Implement outgoing webhooks for key events', 'mid', 'pending', datetime('now', '-27 days'), (SELECT id FROM users WHERE email = 'myphoto288@gmail.com'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 3, NULL, 'Background Jobs', 'Set up queue for background task processing', 'high', 'in_progress', datetime('now', '-28 days'), (SELECT id FROM users WHERE email = 'myphoto288@gmail.com'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 1, NULL, 'System Monitoring', 'Add health checks and uptime monitoring', 'high', 'pending', datetime('now', '-29 days'), (SELECT id FROM users WHERE email = 'myphoto288@gmail.com'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 2, NULL, 'Release Preparation', 'Prepare release notes and version tagging', 'mid', 'pending', datetime('now', '-30 days'), (SELECT id FROM users WHERE email = 'myphoto288@gmail.com'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

