<template>
  <div class="completed-tasks-page">
    <div class="no-print controls">
      <h1 class="page-title">Completed Tasks</h1>
      <div class="date-filter">
        <label>
          From
          <input
            v-model="store.fromDate"
            type="date"
            class="date-input"
          />
        </label>
        <label>
          To
          <input
            v-model="store.toDate"
            type="date"
            class="date-input"
          />
        </label>
        <button
          type="button"
          class="btn-apply"
          :disabled="store.loading"
          @click="applyFilter"
        >
          {{ store.loading ? 'Loading...' : 'Apply' }}
        </button>
        <button
          type="button"
          class="btn-print"
          :disabled="store.loading"
          @click="printReport"
        >
          <i class="fas fa-print mr-1"></i> Print
        </button>
      </div>
      <p v-if="store.error" class="error-msg">{{ store.error }}</p>
    </div>

    <div id="print_area" class="print_area">
      <div class="report_header text-center">
        <div class="report_title text-center">Completed Tasks</div>
        <div class="report_dates text-center">
          {{ dateRangeLabel }}
        </div>
      </div>
      <div v-if="store.loading && store.tasks.length === 0" class="report_loading">
        Loading...
      </div>
      <div v-else-if="store.tasks.length === 0" class="report_empty">
        No completed tasks in this date range.
      </div>
      <div v-else class="report_list">
        <CompletedTask
          v-for="task in store.tasks"
          :key="task.id"
          :task="task"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useCompletedTaskStore } from '@stores/completedTask'
import CompletedTask from '@components/task/CompletedTask.vue'

export default {
  name: 'CompletedTasksView',
  components: { CompletedTask },
  data() {
    return {}
  },
  computed: {
    store() {
      return useCompletedTaskStore()
    },
    dateRangeLabel() {
      const from = this.formatDateReadable(this.store.fromDate)
      const to = this.formatDateReadable(this.store.toDate)
      if (!from && !to) return ''
      if (from === to) return from
      return `${from} – ${to}`
    },
  },
  async mounted() {
    await this.store.fetchCompletedTasks()
  },
  methods: {
    formatDateReadable(dateStr) {
      if (!dateStr) return ''
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`
    },
    async applyFilter() {
      await this.store.fetchCompletedTasks(this.store.fromDate, this.store.toDate)
    },
    printReport() {
      window.print()
    },
  },
}
</script>

<style scoped>
.completed-tasks-page {
  max-width: 48rem;
}
.controls {
  margin-bottom: 1.5rem;
}
.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111;
  margin-bottom: 1rem;
}
.date-filter {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1rem;
}
.date-filter label {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: #374151;
}
.date-input {
  padding: 0.375rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}
.btn-apply,
.btn-print {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.25rem;
  border: 1px solid #d1d5db;
  background: #fff;
  color: #111;
  cursor: pointer;
}
.btn-apply:hover:not(:disabled),
.btn-print:hover:not(:disabled) {
  background: #f3f4f6;
}
.btn-print {
  margin-left: 0.5rem;
}
.error-msg {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: #b91c1c;
}

/* Report / print block – B&W, minimal, todo-completion style */
.print_area {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  padding: 1rem 1.25rem;
  color: #111;
}
.report_header {
  border-bottom: 1px solid #111;
  padding-bottom: 0.4rem;
  margin-bottom: 0.5rem;
}
.report_title {
  font-size: 1rem;
  font-weight: 700;
  color: #111;
  line-height: 1.25;
}
.report_dates {
  font-size: 0.8125rem;
  color: #374151;
  margin-top: 0.15rem;
  line-height: 1.2;
}
.report_loading,
.report_empty {
  font-size: 0.875rem;
  color: #6b7280;
  padding: 0.75rem 0;
  line-height: 1.3;
}
.report_list {
  padding: 0;
}
</style>

<style>
@media print {
  header,
  aside,
  .no-print {
    display: none !important;
  }
  main {
    padding: 0 !important;
    overflow: visible !important;
  }
  .completed-tasks-page {
    max-width: none !important;
  }
  .print_area {
    border: none !important;
    padding: 0 !important;
    box-shadow: none !important;
    background: #fff !important;
  }
  .report_header {
    border-bottom: 1px solid #000 !important;
  }
  .report_title,
  .report_dates {
    color: #000 !important;
  }
  .task_item {
    border-bottom-color: #ccc !important;
  }
  .task_title,
  .task_meta {
    color: #000 !important;
  }
  .icon {
    color: #000 !important;
  }
}
</style>
