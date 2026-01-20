
## Table: `tasks`

### Core Identifiers

* **id**

  * Primary key (UUID or auto-increment)

* **project_id**

  * Foreign key → `projects.id`
  * Nullable if tasks can exist without a project

---

### Task Content

* **title**

  * Short task name
  * Required

* **description**

  * Detailed task description
  * Nullable

* **comment**

  * Internal notes or remarks
  * Nullable

---

### Priority & Status

* **priority**

  * Enum
  * Values:

    * `low`
    * `mid`
    * `high`
    * `urgent`

* **task_status**

  * Enum
  * Values:

    * `pending`
    * `in_progress`
    * `completed`
    * `failed`
    * `hold`

---

### Date & Time Tracking

* **date**

  * Task creation or assigned date
  * (Often overlaps with `created_at`, but can be business-specific)

* **submission_date**

  * Deadline / due date

* **execution_date**

  * Start date & time (when work begins)

* **completion_date**

  * End date & time (when work finishes)

---

### Time Calculation

* **total_duration**

  * Integer
  * Duration in **minutes**
  * Calculated as:

    ```
    completion_date - execution_date
    ```
  * Usually computed automatically (not manually entered)

---

### Recommended Additional Columns (Best Practice)

These are **strongly recommended** for real-world apps:

* **assigned_to**

  * User ID responsible for the task
  * Foreign key → `users.id`

* **created_by**

  * User who created the task
  * Foreign key → `users.id`

* **created_at**

  * Timestamp when task was created

* **updated_at**

  * Timestamp when task was last updated

* **deleted_at** (optional)

  * For soft deletes

---

### Optional / Advanced (Future-Ready)

* **order_index**

  * Integer for manual ordering (Kanban, lists)

* **progress_percentage**

  * Integer (0–100)

* **is_recurring**

  * Boolean

* **parent_task_id**

  * For sub-tasks (self-reference)

---

## Minimal Final Version (Clean & Enough)

If you want a **lean but solid schema**, this is ideal:

```
id
project_id
title
description
priority
task_status
submission_date
execution_date
completion_date
total_duration
assigned_to
comment
created_at
updated_at
```

---

If you want, I can:

* Normalize this into **SQL**
* Design **Pinia task store structure**
* Map this to **Vue forms & UI**
* Suggest **indexes for performance**

Just say what’s next 🚀


indexes

Below are **practical, production-ready index suggestions** for the `tasks` table, focused on **real task-management query patterns** (lists, filters, dashboards).
---

## 1. Primary & Foreign Key Indexes (Mandatory)

### 1.1 Primary Key

```sql
PRIMARY KEY (id)
```

* Fast lookup by task ID

---

### 1.2 Project Relationship

```sql
INDEX idx_tasks_project_id (project_id)
```

**Why**

* Fetch all tasks for a project
* Very common query

---

## 2. Status & Priority Filtering (High Impact)

### 2.1 Task Status

```sql
INDEX idx_tasks_status (task_status)
```

**Why**

* Dashboards:

  * Pending tasks
  * In-progress tasks
  * Completed tasks

---

### 2.2 Priority

```sql
INDEX idx_tasks_priority (priority)
```

**Why**

* Filter urgent or high-priority tasks
* Sorting and alerts

---

### 2.3 Combined Status + Priority (Very Useful)

```sql
INDEX idx_tasks_status_priority (task_status, priority)
```

**Why**

* Common query:

```sql
WHERE task_status = 'pending'
AND priority IN ('high', 'urgent')
```

---

## 3. User-Based Queries (Critical for Multi-User Apps)

### 3.1 Assigned User

```sql
INDEX idx_tasks_assigned_to (assigned_to)
```

**Why**

* “My Tasks”
* User dashboards

---

### 3.2 Assigned User + Status (Very Common)

```sql
INDEX idx_tasks_assigned_status (assigned_to, task_status)
```

**Why**

```sql
WHERE assigned_to = ?
AND task_status = 'in_progress'
```

---

## 4. Date-Based Queries (Scheduling & Reports)

### 4.1 Submission / Due Date

```sql
INDEX idx_tasks_submission_date (submission_date)
```

**Why**

* Overdue tasks
* Upcoming deadlines

---

### 4.2 Execution Date

```sql
INDEX idx_tasks_execution_date (execution_date)
```

**Why**

* Tasks started today / this week

---

### 4.3 Completion Date

```sql
INDEX idx_tasks_completion_date (completion_date)
```

**Why**

* Reports
* History views

---

### 4.4 Status + Due Date (Overdue Queries)

```sql
INDEX idx_tasks_status_submission_date (task_status, submission_date)
```

**Why**

```sql
WHERE task_status != 'completed'
AND submission_date < NOW()
```

---

## 5. Sorting & Pagination Optimization

### 5.1 Created Date

```sql
INDEX idx_tasks_created_at (created_at)
```

**Why**

* Default sorting
* Infinite scroll / pagination

---

### 5.2 Project + Status + Date (Heavy-Use Index)

```sql
INDEX idx_tasks_project_status_date (project_id, task_status, submission_date)
```

**Why**

* Project dashboards
* Kanban boards
* Roadmaps

---

## 6. Soft Delete Optimization (If Used)

If you use `deleted_at`:

```sql
INDEX idx_tasks_deleted_at (deleted_at)
```

or combined:

```sql
INDEX idx_tasks_active (deleted_at, task_status)
```

---

## 7. Indexes You Should NOT Add ❌

Avoid indexing:

* `description`
* `comment`
* `total_duration`

**Reason**

* Large text or calculated fields
* Low filter value
* High write overhead

---

## 8. Recommended Final Index Set (Balanced & Safe)

For most apps, this is the **best balance**:

```sql
PRIMARY KEY (id)

INDEX idx_tasks_project_id (project_id)
INDEX idx_tasks_assigned_to (assigned_to)
INDEX idx_tasks_status (task_status)
INDEX idx_tasks_priority (priority)
INDEX idx_tasks_submission_date (submission_date)

INDEX idx_tasks_assigned_status (assigned_to, task_status)
INDEX idx_tasks_status_submission_date (task_status, submission_date)
INDEX idx_tasks_project_status_date (project_id, task_status, submission_date)
```

---

## 9. Performance Tip (Important)

> **Indexes speed up reads but slow down writes.**
> Do NOT add indexes blindly.

Rule of thumb:

* Start with **7–9 indexes max**
* Add more only after observing slow queries

