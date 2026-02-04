<template>
  <div
    class="kanban-card group cursor-grab active:cursor-grabbing bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-all duration-200 hover:border-blue-300"
    :class="{ 'opacity-50 ring-2 ring-blue-400': isDragging }"
    draggable="true"
    :data-task-id="task.id"
    :data-task-serial="task.serial"
    @dragover.prevent
    @drop="onDrop"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <div class="text-sm font-medium text-gray-800 line-clamp-2">
      {{ task.title }}
    </div>
    <div v-if="task.priority" class="mt-1">
      <span
        class="inline-block px-1.5 py-0.5 text-xs rounded"
        :class="priorityClass"
      >
        {{ task.priority }}
      </span>
      <span class="inline-block px-1.5 ml-1 py-0.5 text-xs rounded" v-if="task.taskStatus == 'completed'" :class="statusClass">
        {{ new Date(task.completionDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ').toLowerCase() }}
      </span>
      <span class="inline-block px-1.5 ml-1 py-0.5 text-xs rounded" v-if="task.taskStatus == 'in_progress'" :class="statusClass">
        {{ new Date(task.executionDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ').toLowerCase() }}
      </span>
      <span class="inline-block px-1.5 ml-1 py-0.5 text-xs rounded" v-if="task.taskStatus == 'pending'" :class="statusClass">
        {{ new Date(task.submissionDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ').toLowerCase() }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KanbanCard',
  props: {
    task: { type: Object, required: true },
    status: { type: String, required: true },
    isDragging: { type: Boolean, default: false },
  },
  computed: {
    priorityClass() {
      const m = { high: 'bg-red-100 text-red-700', urgent: 'bg-orange-100 text-orange-700', mid: 'bg-blue-100 text-blue-700', low: 'bg-gray-100 text-gray-600' }
      return m[this.task.priority] || 'bg-gray-100 text-gray-600'
    },
    statusClass() {
      const m = { completed: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', in_progress: 'bg-blue-100 text-blue-700', partially_completed: 'bg-purple-100 text-purple-700' }
      return m[this.task.taskStatus] || 'bg-gray-100 text-gray-600'
    },
  },
  methods: {
    onDragStart(e) {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('application/json', JSON.stringify({
        taskId: this.task.id,
        task: this.task,
        fromStatus: this.status,
      }))
      e.dataTransfer.setData('text/plain', String(this.task.id))
      this.$emit('drag-start', this.task)
    },
    onDrop(e) {
      e.preventDefault()
      e.stopPropagation()
      this.$emit('drop', e, this.task.id)
    },
    onDragEnd() {
      this.$emit('drag-end')
    },
  },
}
</script>
