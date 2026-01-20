<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Edit Task</h1>
      <router-link
        :to="{ name: 'task-view', params: { id: taskId } }"
        class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
      >
        <i class="fas fa-arrow-left mr-2"></i>
        Back
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !task" class="text-center py-12">
      <p class="text-gray-500">Loading task...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error && !task" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-600">{{ error }}</p>
      <button
        @click="fetchTask"
        class="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Retry
      </button>
    </div>

    <!-- Form -->
    <div v-else-if="task" class="bg-white rounded-lg shadow-md p-6">
      <TaskForm
        :task="task"
        :loading="updateLoading"
        :error="updateError"
        submit-text="Update"
        @submit="handleUpdate"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>

<script>
import { useTaskStore } from '@stores/task'
import TaskForm from '@components/task/form.vue'

export default {
  name: 'TaskEditView',
  components: {
    TaskForm,
  },
  data() {
    return {
      loading: false,
      updateLoading: false,
      error: '',
      updateError: '',
    }
  },
  computed: {
    taskId() {
      return parseInt(this.$route.params.id)
    },
    taskStore() {
      return useTaskStore()
    },
    task() {
      return this.taskStore.currentTask || this.taskStore.getTaskById(this.taskId)
    },
  },
  async mounted() {
    await this.fetchTask()
  },
  methods: {
    async fetchTask() {
      this.loading = true
      this.error = ''

      const result = await this.taskStore.fetchTaskById(this.taskId)

      if (!result.success) {
        this.error = result.error
      }

      this.loading = this.taskStore.loading
    },
    async handleUpdate(taskData) {
      this.updateLoading = true
      this.updateError = ''

      const result = await this.taskStore.updateTask(this.taskId, taskData)

      if (result.success) {
        // Redirect to task view
        this.$router.push({ name: 'task-view', params: { id: this.taskId } })
      } else {
        this.updateError = result.error || 'Failed to update task'
        this.updateLoading = false
      }
    },
    handleCancel() {
      this.$router.push({ name: 'task-view', params: { id: this.taskId } })
    },
  },
}
</script>
