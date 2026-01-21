import { defineStore } from 'pinia'
import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const useMeetingStore = defineStore('meeting', {
  state: () => ({
    meetings: [],
    currentMeeting: null,
    loading: false,
    error: null,
    lastFetch: null,
    cacheTimeout: 5 * 60 * 1000, // 5 minutes cache
    
    // Filters
    filters: {
      projectId: null,
      creator: null,
    },
  }),

  getters: {
    // Get meeting by ID
    getMeetingById: (state) => (id) => {
      return state.meetings.find((m) => m.id === parseInt(id))
    },

    // Check if cache is still valid
    isCacheValid: (state) => {
      if (!state.lastFetch) return false
      return Date.now() - state.lastFetch < state.cacheTimeout
    },
  },

  actions: {
    /**
     * List all meetings with optional filters
     * Uses caching for performance
     */
    async fetchMeetings(forceRefresh = false) {
      // Return cached data if valid and not forcing refresh
      if (this.isCacheValid && !forceRefresh && this.meetings.length > 0) {
        return { success: true, data: this.meetings }
      }

      this.loading = true
      this.error = null

      try {
        // Build query parameters
        const params = new URLSearchParams()
        
        if (this.filters.projectId !== null && this.filters.projectId !== undefined) {
          params.append('project_id', this.filters.projectId)
        }
        
        if (this.filters.creator !== null && this.filters.creator !== undefined) {
          params.append('creator', this.filters.creator)
        }

        const queryString = params.toString()
        const url = `/meeting${queryString ? `?${queryString}` : ''}`
        
        const response = await api.get(url)
        this.meetings = response.data.meetings || []
        this.lastFetch = Date.now()
        return { success: true, data: this.meetings }
      } catch (error) {
        this.error = error.response?.data?.error || error.message || 'Failed to fetch meetings'
        console.error('Fetch meetings error:', error)
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    /**
     * Get a single meeting by ID
     */
    async fetchMeetingById(id) {
      this.loading = true
      this.error = null

      try {
        const response = await api.get(`/meeting/${id}`)
        const meeting = response.data.meeting
        
        // Update in meetings array if exists
        const index = this.meetings.findIndex((m) => m.id === meeting.id)
        if (index !== -1) {
          this.meetings[index] = meeting
        } else {
          this.meetings.push(meeting)
        }
        
        this.currentMeeting = meeting
        return { success: true, data: meeting }
      } catch (error) {
        this.error = error.response?.data?.error || error.message || 'Failed to fetch meeting'
        console.error('Fetch meeting error:', error)
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    /**
     * Create a new meeting
     */
    async createMeeting(meetingData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/meeting/create', meetingData)
        const meeting = response.data.meeting
        
        // Add to meetings array
        this.meetings.unshift(meeting)
        this.currentMeeting = meeting
        
        // Update cache timestamp
        this.lastFetch = Date.now()
        
        return { success: true, data: meeting }
      } catch (error) {
        this.error = error.response?.data?.error || error.message || 'Failed to create meeting'
        console.error('Create meeting error:', error)
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    /**
     * Update an existing meeting
     */
    async updateMeeting(id, meetingData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post(`/meeting/${id}/update`, meetingData)
        const meeting = response.data.meeting
        
        // Update in meetings array
        const index = this.meetings.findIndex((m) => m.id === parseInt(id))
        if (index !== -1) {
          this.meetings[index] = meeting
        }
        
        // Update current meeting if it's the one being updated
        if (this.currentMeeting?.id === parseInt(id)) {
          this.currentMeeting = meeting
        }
        
        // Update cache timestamp
        this.lastFetch = Date.now()
        
        return { success: true, data: meeting }
      } catch (error) {
        this.error = error.response?.data?.error || error.message || 'Failed to update meeting'
        console.error('Update meeting error:', error)
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    /**
     * Delete a meeting
     */
    async deleteMeeting(id) {
      this.loading = true
      this.error = null

      try {
        await api.post(`/meeting/${id}/delete`)
        
        // Remove from meetings array
        this.meetings = this.meetings.filter((m) => m.id !== parseInt(id))
        
        // Clear current meeting if it's the one being deleted
        if (this.currentMeeting?.id === parseInt(id)) {
          this.currentMeeting = null
        }
        
        // Update cache timestamp
        this.lastFetch = Date.now()
        
        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.error || error.message || 'Failed to delete meeting'
        console.error('Delete meeting error:', error)
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    /**
     * Set filters
     */
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },

    /**
     * Clear filters
     */
    clearFilters() {
      this.filters = {
        projectId: null,
        creator: null,
      }
    },

    /**
     * Set current meeting
     */
    setCurrentMeeting(meeting) {
      this.currentMeeting = meeting
    },

    /**
     * Clear cache
     */
    clearCache() {
      this.lastFetch = null
    },
  },
})
