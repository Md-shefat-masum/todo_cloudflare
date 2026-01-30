import { defineStore } from 'pinia'
import axios from 'axios'

const api = axios.create({
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const COLUMNS = [
  { key: 'pending', label: 'Pending', color: 'bg-amber-50 border-amber-200' },
  { key: 'in_progress', label: 'In Progress', color: 'bg-blue-50 border-blue-200' },
  { key: 'completed', label: 'Completed', color: 'bg-green-50 border-green-200' },
  { key: 'failed', label: 'Failed', color: 'bg-red-50 border-red-200' },
  { key: 'hold', label: 'Hold', color: 'bg-gray-50 border-gray-200' },
]

export const useKanbanStore = defineStore('kanban', {
  state: () => ({
    tasks: {},
    projects: [],
    meetings: [],
    selectedProjectId: null,
    selectedMeetingId: null,
    loading: false,
    error: null,
  }),

  getters: {
    tasksByStatus: (state) => (status) => state.tasks[status] || [],
    selectedProject: (state) =>
      state.projects.find((p) => String(p.id) === String(state.selectedProjectId)),
  },

  actions: {
    async fetchProjects() {
      try {
        const res = await api.get('/project')
        this.projects = res.data?.projects || []
        return this.projects
      } catch (err) {
        this.projects = []
        throw err
      }
    },

    async fetchMeetings(projectId) {
      if (!projectId) {
        this.meetings = []
        return []
      }
      try {
        const res = await api.get('/meeting', { params: { project_id: projectId } })
        this.meetings = res.data?.meetings || []
        return this.meetings
      } catch (err) {
        this.meetings = []
        return []
      }
    },

    setFilters(projectId, meetingId) {
      this.selectedProjectId = projectId
      this.selectedMeetingId = meetingId || null
    },

    resetFilters() {
      this.selectedProjectId = this.projects[0]?.id ?? null
      this.selectedMeetingId = null
      this.fetchTasks()
    },

    async fetchTasks() {
      this.loading = true
      this.error = null
      try {
        const params = new URLSearchParams()
        if (this.selectedProjectId) params.set('project_id', this.selectedProjectId)
        if (this.selectedMeetingId) params.set('meeting_id', this.selectedMeetingId)
        const res = await api.get(`/kanban-tasks?${params}`)
        this.tasks = res.data || {}
        return this.tasks
      } catch (err) {
        this.error = err.response?.data?.error || err.message || 'Failed to load tasks'
        this.tasks = {}
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateTask(taskId, payload) {
      const res = await api.patch('/kanban-update-task', {
        task_id: taskId,
        serial: payload.serial,
        task_status: payload.taskStatus,
      })
      return res.data
    },

    moveTaskLocally(task, fromStatus, toStatus, toIndex) {
      const fromList = [...(this.tasks[fromStatus] || [])]
      const toList = fromStatus === toStatus ? [...fromList] : [...(this.tasks[toStatus] || [])]
      const fromIdx = fromList.findIndex((t) => t.id === task.id)
      if (fromIdx < 0) return false

      fromList.splice(fromIdx, 1)
      if (fromStatus === toStatus) {
        toList.splice(toIndex, 0, { ...task, taskStatus: toStatus, serial: toIndex + 1 })
      } else {
        toList.splice(toIndex, 0, { ...task, taskStatus: toStatus, serial: toIndex + 1 })
      }

      this.tasks = { ...this.tasks, [fromStatus]: fromList, [toStatus]: toList }
      return true
    },

    reorderLocally(status, tasks) {
      this.tasks = { ...this.tasks, [status]: tasks }
    },
  },
})
