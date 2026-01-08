<script setup lang="ts">
// 1. Import the hook 'useRouter',
import { useRouter } from 'vue-router'

// 2. Call the hook to get the router instance
const router = useRouter()

// Example of how to use it programmatically:
function navigateToAbout() {
  router.push({ name: 'about-props' })
}
</script>

<template>
  <div class="app-layout p-4">
    <!-- Navigation Menu -->
    <nav>
      <!-- Using <router-link> for declarative navigation -->
      <router-link to="/">Go to Home</router-link> |
      <!-- Using a button to trigger programmatic navigation from script -->
      <button @click="navigateToAbout">Go to About (JS)</button>
    </nav>

    <!-- The Page Content appears here -->
    <main>
      <router-view />
    </main>
  </div>
</template>
