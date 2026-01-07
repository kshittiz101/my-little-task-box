<script setup lang="ts">
import { ref, computed } from 'vue'
import TaskInput from '@/components/TaskInput.vue'
import TaskList from '@/components/TaskList.vue'
import { useTasks } from '@/Composable/useTasks'

// Using the useTasks composable for state management
// This demonstrates the "Logic Reuse with Composables" pattern
const {
  tasks,
  completedTasks,
  pendingTasks,
  totalTasks,
  addTask,
  updateTask,
  deleteTask,
  toggleTaskComplete,
  clearCompletedTasks,
  clearAllTasks,
} = useTasks()

// Reactive state for UI
const username = ref('Kshittiz')
const currentFilter = ref<'all' | 'pending' | 'completed'>('all')

// Event handlers for TaskInput component
// Demonstrates defineEmits usage
const handleAddTask = (title: string, description: string) => {
  addTask(title, description)
}

// Event handlers for TaskList/TaskItem components
const handleDeleteTask = (id: number) => {
  deleteTask(id)
}

const handleToggleComplete = (id: number) => {
  toggleTaskComplete(id)
}

const handleUpdateTask = (id: number, title: string, description: string) => {
  updateTask(id, { title, description })
}

// Filter methods
const setFilter = (filter: 'all' | 'pending' | 'completed') => {
  currentFilter.value = filter
}

// Computed property for filtered tasks display
const filteredTasks = computed(() => {
  switch (currentFilter.value) {
    case 'pending':
      return pendingTasks.value
    case 'completed':
      return completedTasks.value
    default:
      return tasks.value
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Header -->
      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">
          Welcome to My Little Task Box, {{ username }}!
        </h1>
        <p class="text-gray-600">A Vue 3 Composition API demonstration with full CRUD operations</p>
      </header>

      <!-- Task Input -->
      <div class="mb-8">
        <TaskInput @add="handleAddTask" />
      </div>

      <!-- Task Statistics -->
      <div v-if="totalTasks > 0" class="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div class="p-3 bg-blue-50 rounded-md">
            <div class="text-2xl font-bold text-blue-600">{{ totalTasks }}</div>
            <div class="text-sm text-blue-800">Total Tasks</div>
          </div>
          <div class="p-3 bg-green-50 rounded-md">
            <div class="text-2xl font-bold text-green-600">{{ pendingTasks.length }}</div>
            <div class="text-sm text-green-800">Pending</div>
          </div>
          <div class="p-3 bg-purple-50 rounded-md">
            <div class="text-2xl font-bold text-purple-600">{{ completedTasks.length }}</div>
            <div class="text-sm text-purple-800">Completed</div>
          </div>
        </div>
      </div>

      <!-- Filters and Actions -->
      <div v-if="totalTasks > 0" class="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-6">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
          <!-- Filter Buttons -->
          <div class="flex gap-2">
            <button @click="setFilter('all')" :class="[
              'px-4 py-2 rounded-md transition-colors',
              currentFilter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ]">
              All ({{ totalTasks }})
            </button>
            <button @click="setFilter('pending')" :class="[
              'px-4 py-2 rounded-md transition-colors',
              currentFilter === 'pending'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ]">
              Pending ({{ pendingTasks.length }})
            </button>
            <button @click="setFilter('completed')" :class="[
              'px-4 py-2 rounded-md transition-colors',
              currentFilter === 'completed'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ]">
              Completed ({{ completedTasks.length }})
            </button>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2">
            <button v-if="completedTasks.length > 0" @click="clearCompletedTasks"
              class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
              Clear Completed
            </button>
            <button v-if="totalTasks > 0" @click="clearAllTasks"
              class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
              Clear All
            </button>
          </div>
        </div>
      </div>

      <!-- Task List -->
      <TaskList :tasks="filteredTasks" :filter="currentFilter" @delete="handleDeleteTask"
        @toggle-complete="handleToggleComplete" @update="handleUpdateTask" />

      <!-- Footer -->
      <footer class="text-center mt-12 text-gray-500 text-sm">
        <p>
          Built with Vue 3 Composition API • Demonstrating CRUD operations and component
          communication
        </p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* Additional custom styles can be added here if needed */
</style>
