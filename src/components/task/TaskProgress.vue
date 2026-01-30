<template>
  <div class="task-progress flex items-center gap-4">
    <div v-if="loading" class="text-gray-500 text-sm">Loading...</div>
    <template v-else-if="!error">
    <div class="circle_progress" style="width: 150px; flex-shrink: 0">
      <svg viewBox="0 0 100 100" class="w-full h-auto">
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="#e5e7eb"
          stroke-width="12"
        />
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="#7c3aed"
          stroke-width="12"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="strokeDashoffset"
          stroke-linecap="round"
          transform="rotate(-90 50 50)"
          class="transition-all duration-500"
        />
      </svg>
      <div class="circle_label">
        <span class="percent">{{ incompletePercent }}%</span>
        <span class="of_total">of total</span>
      </div>
    </div>
    <div class="counts text-gray-700">
      <span class="text-2xl font-bold">{{ incomplete }}/{{ total }}</span>
      <span class="text-sm text-gray-500 ml-1">remaining</span>
    </div>
    </template>
    <div v-else class="text-red-600 text-sm">{{ error }}</div>
  </div>
</template>

<script>
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

const radius = 42
const circumference = 2 * Math.PI * radius

export default {
  name: 'TaskProgress',
  data() {
    return {
      total: 0,
      incomplete: 0,
      loading: false,
      error: null,
      circumference,
    }
  },
  computed: {
    incompletePercent() {
      if (this.total === 0) return 0
      return Math.round((this.incomplete / this.total) * 100)
    },
    strokeDashoffset() {
      if (this.total === 0) return this.circumference
      const pct = this.incomplete / this.total
      return this.circumference - pct * this.circumference
    },
  },
  async mounted() {
    await this.fetchStats()
  },
  methods: {
    async fetchStats() {
      this.loading = true
      this.error = null
      try {
        const res = await api.get('/task/stats')
        this.total = res.data.total ?? 0
        this.incomplete = res.data.incomplete ?? 0
      } catch (err) {
        this.error = err.response?.data?.error || err.message || 'Failed to load'
        this.total = 0
        this.incomplete = 0
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.circle_progress {
  position: relative;
}
.circle_progress svg {
  display: block;
}
.circle_label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}
.circle_label .percent {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}
.circle_label .of_total {
  display: block;
  font-size: 0.65rem;
  color: #6b7280;
}
</style>
