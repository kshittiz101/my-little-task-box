<script setup lang="ts">
import { ref } from 'vue'

// Define emits for parent communication
// This explicitly declares what events this component can emit
const emit = defineEmits<{
  add: [title: string, description: string] // Emit add event with task data
}>()

// Reactive state for form inputs
const title = ref('')
const description = ref('')
const isExpanded = ref(false)

// Methods
const addTask = () => {
  if (!title.value.trim()) return

  // Emit the add event to parent with task data
  emit('add', title.value.trim(), description.value.trim())

  // Reset form
  title.value = ''
  description.value = ''
  isExpanded.value = false
}

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

const cancelAdd = () => {
  title.value = ''
  description.value = ''
  isExpanded.value = false
}
</script>

<template>
  <div class="w-full max-w-md mx-auto bg-white p-4 rounded-lg shadow-md border border-gray-200">
    <!-- Compact Add Task Button -->
    <div v-if="!isExpanded" class="flex justify-center">
      <button @click="toggleExpanded"
        class="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Add New Task
      </button>
    </div>

    <!-- Expanded Add Task Form -->
    <div v-else class="space-y-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Task Title *</label>
        <input v-model="title" type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter task title" @keyup.enter="addTask" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea v-model="description" rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter task description (optional)"></textarea>
      </div>

      <div class="flex gap-2">
        <button @click="addTask" :disabled="!title.trim()"
          class="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
          Add Task
        </button>
        <button @click="cancelAdd"
          class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>
