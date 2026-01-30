<template>
  <div class="kanban-filters flex flex-wrap items-end gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="min-w-[180px]">
      <label class="block text-sm font-medium text-gray-700 mb-1">Project</label>
      <select
        v-model="store.selectedProjectId"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        @change="onProjectChange"
      >
        <option :value="null">Select project</option>
        <option v-for="p in store.projects" :key="p.id" :value="p.id">{{ p.title }}</option>
      </select>
    </div>
    <div v-if="store.selectedProjectId" class="min-w-[180px]">
      <label class="block text-sm font-medium text-gray-700 mb-1">Meeting (optional)</label>
      <select
        v-model="store.selectedMeetingId"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        :disabled="loadingMeetings"
      >
        <option :value="null">All meetings</option>
        <option v-for="m in store.meetings" :key="m.id" :value="m.id">{{ m.title }}</option>
      </select>
    </div>
    <div class="flex gap-2">
      <button
        type="button"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        :disabled="store.loading"
        @click="apply"
      >
        Apply
      </button>
      <button
        type="button"
        class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        @click="reset"
      >
        Reset
      </button>
    </div>
  </div>
</template>

<script>
import { useKanbanStore } from '@stores/kanban'

export default {
  name: 'KanbanFilters',
  data() {
    return { loadingMeetings: false }
  },
  computed: {
    store() {
      return useKanbanStore()
    },
  },
  methods: {
    async onProjectChange() {
      this.store.selectedMeetingId = null
      this.loadingMeetings = true
      await this.store.fetchMeetings(this.store.selectedProjectId)
      this.loadingMeetings = false
    },
    async apply() {
      await this.store.fetchTasks()
    },
    reset() {
      this.store.resetFilters()
    },
  },
}
</script>
