<script setup lang="ts">
import { computed } from 'vue'
import TaskItem from './TaskItem.vue'
import type { Task } from '@/Composable/useTasks'

// Define props for the task list
interface TaskListProps {
  tasks: readonly Task[]
  filter?: 'all' | 'pending' | 'completed'
}

const props = withDefaults(defineProps<TaskListProps>(), {
  filter: 'all',
})

// Define emits for parent communication
const emit = defineEmits<{
  delete: [id: number]
  toggleComplete: [id: number]
  update: [id: number, title: string, description: string]
}>()

// Computed property to filter tasks based on the filter prop
const filteredTasks = computed(() => {
  switch (props.filter) {
    case 'pending':
      return props.tasks.filter((task) => !task.completed)
    case 'completed':
      return props.tasks.filter((task) => task.completed)
    default:
      return props.tasks
  }
})

// Event handlers that forward to parent
const handleDelete = (id: number) => {
  emit('delete', id)
}

const handleToggleComplete = (id: number) => {
  emit('toggleComplete', id)
}

const handleUpdate = (id: number, title: string, description: string) => {
  emit('update', id, title, description)
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto space-y-3">
    <!-- Empty state -->
    <div v-if="filteredTasks.length === 0" class="text-center py-8">
      <div class="text-gray-400 mb-2">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4">
          </path>
        </svg>
      </div>
      <p class="text-gray-500 text-lg">
        {{
          filter === 'all'
            ? 'No tasks yet. Add your first task!'
            : filter === 'pending'
              ? 'No pending tasks. Great job!'
              : 'No completed tasks yet.'
        }}
      </p>
    </div>

    <!-- Task list -->
    <div v-else class="space-y-3">
      <TaskItem v-for="task in filteredTasks" :key="task.id" :id="task.id" :title="task.title"
        :description="task.description" :completed="task.completed" @delete="handleDelete"
        @toggle-complete="handleToggleComplete" @update="handleUpdate" />
    </div>

    <!-- Task count -->
    <div v-if="filteredTasks.length > 0" class="text-center text-sm text-gray-500 mt-4">
      {{ filteredTasks.length }} task{{ filteredTasks.length !== 1 ? 's' : '' }}
      {{ filter === 'pending' ? 'pending' : filter === 'completed' ? 'completed' : 'total' }}
    </div>
  </div>
</template>
