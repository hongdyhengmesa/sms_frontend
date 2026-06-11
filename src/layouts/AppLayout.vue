<template>
  <div class="min-h-screen flex bg-gray-100">

    <!-- Sidebar -->
    <AppSidebar />

    <!-- Main Content -->
    <div class="flex flex-col flex-1 overflow-hidden">

      <!-- Topbar -->
      <AppTopbar />

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-6">

        <!-- Router Page -->
        <RouterView />

      </main>

    </div>

  </div>
</template>

<script setup>
import AppSidebar from '../components/AppSidebar.vue'

import AppTopbar from '../components/AppTopbar.vue'
</script>