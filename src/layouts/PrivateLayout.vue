<template>
  <div class="min-h-screen bg-gray-50 app_container">
    <!-- Header -->
    <HeaderComponent />
    
    <!-- Body Layout -->
    <div class="flex h-[calc(100vh-73px)]">
      <!-- Sidebar -->
      <SidebarComponent />
      
      <!-- Main Content -->
      <main class="flex-1 p-2 lg:p-6 w-full md:w-[calc(100%-256px)]">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import HeaderComponent from '@components/layout/HeaderComponent.vue'
import SidebarComponent from '@components/layout/SidebarComponent.vue'

export default {
  name: 'PrivateLayout',
  components: {
    HeaderComponent,
    SidebarComponent,
  },
}
</script>

<style scoped>
@media print {
  .app_container {
    background-color: #fff !important;
  }
}
</style>