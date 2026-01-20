# Task Management – Home Page UI

## 1. Overall Page Structure

```
<div class="h-screen flex flex-col relative">
  <TopBar />
  <TaskList />
  <QuickAddBar />
  <FilterModal />
  <TaskFormModal />
</div>
```

---

## 2. Top Bar (Filter + Context)

### Purpose

* Always accessible filters
* Minimal distraction

### Layout

```
<div class="h-[56px] flex items-center justify-between px-4 border-b">
  <div class="font-semibold">
    Tasks
  </div>

  <button class="text-xl">
    <filter icon />
  </button>
</div>
```

### Behavior

* Filter icon is **fixed / sticky at top**
* On click → opens **Filter Modal**
* Shows active filter count (optional badge)

✅ Works well on mobile & desktop

---

## 3. Task List Section (Main Content)

### Layout

```
<div class="flex-1 overflow-y-auto px-3 py-2">
  <TaskCard v-for="task in tasks" />
</div>
```

### Rules

* Height = `100vh - top - bottom`
* Scrollable
* Latest tasks first (DESC by created_at or execution_date)

### Task Card UI (Suggested)

```
<div class="p-3 rounded-lg shadow-sm border mb-2">
  <div class="flex justify-between items-start">
    <h3 class="font-medium">Task Title</h3>
    <priority badge />
  </div>

  <p class="text-sm text-gray-500">Project Name</p>

  <div class="flex justify-between items-center mt-2 text-xs">
    <status badge />
    <due date />
  </div>
  <div>
    if pending ( new task)
        checkbox start work
    if has execution_date ( define as in progress )
        checkbox make complete
  </div>
</div>
```

---

## 4. Bottom Quick Add Bar (Chat-Style)

### Height

* Fixed: **~73px**

### Layout

```
<div class="h-[73px] border-t flex items-center gap-2 px-3 bg-white">
  
  <select class="w-28">
    Project
  </select>

  <input 
    type="text"
    placeholder="Add a task..."
    class="flex-1"
  />

  <button>
    Send / Add icon
  </button>

  <button>
    Expand form icon
  </button>

</div>
```

### Behavior

* Fast task creation (title + project only)
* Press enter or click send → creates task
* Expand icon → opens **Full Task Form Modal**

✅ Feels like chat
✅ Extremely fast task entry

---

## 5. Full Task Form Modal (Expanded Add)

### Trigger

* Click **form icon** in bottom bar

### UI Style

* **Full-page modal** on mobile
* **Centered modal** on desktop

### Inputs

```
Title
Description
Project
Priority
Status
Submission Date
Execution Date
Completion Date
Comment
Save / Cancel
```

### UX Notes

* Auto-focus title
* Save closes modal and updates list
* Uses same Pinia store as quick add

---

## 6. Filter Modal

### Trigger

* Filter icon (top right)

### Layout

```
Status (multi-select)
Priority (multi-select)
Project
Date range
Assigned to
Apply / Reset
```

### Behavior

* Slide-up modal on mobile
* Side modal or centered on desktop
* Apply filters → refresh task list

---

## 7. Responsive Behavior Summary

### Mobile (<768px)

* Full-height layout
* Sidebar hidden (from your main layout)
* Modals = full screen
* Bottom bar always visible

### Desktop (≥768px)

* Wider task cards
* Modals centered
* Sidebar visible

---

## 8. Why This UI Works Well

✅ **Fast task creation** (chat-style input)
✅ **Powerful filters without clutter**
✅ **Scales for future features** (projects, tags, subtasks)
✅ **Excellent mobile UX**
✅ Matches modern apps (Linear, Notion, ClickUp vibes)
