<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Edit Meeting</h1>
      <router-link
        :to="{ name: 'meeting-view', params: { id: meetingId } }"
        class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
      >
        <i class="fas fa-arrow-left mr-2"></i>
        Back
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !meeting" class="text-center py-12">
      <p class="text-gray-500">Loading meeting...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error && !meeting" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-600">{{ error }}</p>
      <button
        @click="fetchMeeting"
        class="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Retry
      </button>
    </div>

    <!-- Form -->
    <div v-else-if="meeting" class="bg-white rounded-lg shadow-md p-6">
      <MeetingForm
        :meeting="meeting"
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
import { useMeetingStore } from '@stores/meeting'
import MeetingForm from '@components/meeting/MeetingForm.vue'

export default {
  name: 'MeetingEditView',
  components: {
    MeetingForm,
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
    meetingId() {
      return parseInt(this.$route.params.id)
    },
    meetingStore() {
      return useMeetingStore()
    },
    meeting() {
      return this.meetingStore.currentMeeting || this.meetingStore.getMeetingById(this.meetingId)
    },
  },
  async mounted() {
    await this.fetchMeeting()
  },
  methods: {
    async fetchMeeting() {
      this.loading = true
      this.error = ''

      const result = await this.meetingStore.fetchMeetingById(this.meetingId)

      if (!result.success) {
        this.error = result.error
      }

      this.loading = this.meetingStore.loading
    },
    async handleUpdate(meetingData) {
      this.updateLoading = true
      this.updateError = ''

      const result = await this.meetingStore.updateMeeting(this.meetingId, meetingData)

      if (result.success) {
        // Redirect to meeting view
        this.$router.push({ name: 'meeting-view', params: { id: this.meetingId } })
      } else {
        this.updateError = result.error || 'Failed to update meeting'
        this.updateLoading = false
      }
    },
    handleCancel() {
      this.$router.push({ name: 'meeting-view', params: { id: this.meetingId } })
    },
  },
}
</script>
