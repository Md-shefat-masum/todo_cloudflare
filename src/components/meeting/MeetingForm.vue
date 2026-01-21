<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
        Title <span class="text-red-500">*</span>
      </label>
      <input
        id="title"
        v-model="formData.title"
        type="text"
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        placeholder="Enter meeting title"
      />
      <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
    </div>

    <div>
      <label for="projectId" class="block text-sm font-medium text-gray-700 mb-1">
        Project <span class="text-red-500">*</span>
      </label>
      <select
        id="projectId"
        v-model="formData.projectId"
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      >
        <option :value="null" disabled>Select a project</option>
        <option v-for="project in projects" :key="project.id" :value="project.id">
          {{ project.title }}
        </option>
      </select>
      <p v-if="errors.projectId" class="mt-1 text-sm text-red-600">{{ errors.projectId }}</p>
    </div>

    <div>
      <label for="date" class="block text-sm font-medium text-gray-700 mb-1">
        Date & Time <span class="text-red-500">*</span>
      </label>
      <input
        id="date"
        v-model="formData.date"
        type="datetime-local"
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />
      <p v-if="errors.date" class="mt-1 text-sm text-red-600">{{ errors.date }}</p>
    </div>

    <div>
      <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
        Description
      </label>
      <textarea
        id="description"
        v-model="formData.description"
        rows="4"
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        placeholder="Enter meeting description (optional)"
      ></textarea>
    </div>

    <div v-if="error" class="text-red-600 text-sm bg-red-50 p-3 rounded-md">
      {{ error }}
    </div>

    <div class="flex gap-3">
      <button
        type="submit"
        :disabled="loading"
        class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span v-if="loading">{{ submitText === 'Create' ? 'Creating...' : 'Updating...' }}</span>
        <span v-else>{{ submitText }}</span>
      </button>
      
      <button
        v-if="showCancel"
        type="button"
        @click="$emit('cancel')"
        :disabled="loading"
        class="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Cancel
      </button>
    </div>
  </form>
</template>

<script>
import { useProjectStore } from '@stores/project'

export default {
  name: 'MeetingForm',
  props: {
    meeting: {
      type: Object,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: '',
    },
    submitText: {
      type: String,
      default: 'Create',
    },
    showCancel: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['submit', 'cancel'],
  data() {
    return {
      formData: {
        title: '',
        projectId: null,
        date: '',
        description: '',
      },
      errors: {},
    }
  },
  computed: {
    projectStore() {
      return useProjectStore()
    },
    projects() {
      return this.projectStore.projects
    },
  },
  watch: {
    meeting: {
      immediate: true,
      handler(newMeeting) {
        if (newMeeting) {
          this.formData = {
            title: newMeeting.title || '',
            projectId: newMeeting.projectId || null,
            date: this.formatDateTimeLocal(newMeeting.date),
            description: newMeeting.description || '',
          }
        } else {
          // Reset form for new meeting
          this.formData = {
            title: '',
            projectId: null,
            date: '',
            description: '',
          }
        }
      },
    },
  },
  async mounted() {
    // Fetch projects if not loaded
    if (this.projects.length === 0) {
      await this.projectStore.fetchProjects()
    }
  },
  methods: {
    handleSubmit() {
      // Validate
      this.errors = {}
      
      if (!this.formData.title || this.formData.title.trim() === '') {
        this.errors.title = 'Title is required'
      }
      
      if (!this.formData.projectId) {
        this.errors.projectId = 'Project is required'
      }
      
      if (!this.formData.date) {
        this.errors.date = 'Date is required'
      }
      
      if (Object.keys(this.errors).length > 0) {
        return
      }
      
      // Emit submit with form data
      const submitData = {
        title: this.formData.title.trim(),
        projectId: parseInt(this.formData.projectId),
        date: this.formData.date,
        description: this.formData.description || null,
      }
      
      this.$emit('submit', submitData)
    },
    formatDateTimeLocal(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      // Format as YYYY-MM-DDTHH:mm for datetime-local input
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day}T${hours}:${minutes}`
    },
  },
}
</script>
