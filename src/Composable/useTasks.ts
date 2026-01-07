import { ref, computed, readonly } from 'vue'

// Define the Task interface for type safety
export interface Task {
  id: number
  title: string
  description: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

// Reactive state for tasks
const tasks = ref<Task[]>([])

// Auto-increment ID counter
let nextId = 1

// Computed properties for different task views
const completedTasks = computed(() => tasks.value.filter((task) => task.completed))
const pendingTasks = computed(() => tasks.value.filter((task) => !task.completed))
const totalTasks = computed(() => tasks.value.length)

// CRUD Operations
export function useTasks() {
  // Create: Add a new task
  const addTask = (title: string, description: string = '') => {
    if (!title.trim()) return

    const newTask: Task = {
      id: nextId++,
      title: title.trim(),
      description: description.trim(),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    tasks.value.push(newTask)
  }

  // Read: Get all tasks (already available via tasks ref)
  // Additional getters are provided via computed properties

  // Update: Update an existing task
  const updateTask = (
    id: number,
    updates: Partial<Pick<Task, 'title' | 'description' | 'completed'>>,
  ) => {
    const taskIndex = tasks.value.findIndex((task) => task.id === id)
    if (taskIndex === -1) return

    // Update the task with new values
    const existingTask = tasks.value[taskIndex]!
    tasks.value[taskIndex] = {
      ...existingTask,
      ...updates,
      updatedAt: new Date(),
    }
  }

  // Delete: Remove a task
  const deleteTask = (id: number) => {
    const taskIndex = tasks.value.findIndex((task) => task.id === id)
    if (taskIndex === -1) return

    tasks.value.splice(taskIndex, 1)
  }

  // Toggle completion status
  const toggleTaskComplete = (id: number) => {
    const task = tasks.value.find((task) => task.id === id)
    if (task) {
      updateTask(id, { completed: !task.completed })
    }
  }

  // Clear all completed tasks
  const clearCompletedTasks = () => {
    tasks.value = tasks.value.filter((task) => !task.completed)
  }

  // Clear all tasks
  const clearAllTasks = () => {
    tasks.value = []
    nextId = 1
  }

  // Get a specific task by ID
  const getTaskById = (id: number) => {
    return tasks.value.find((task) => task.id === id)
  }

  return {
    // State
    tasks: readonly(tasks),

    // Computed
    completedTasks,
    pendingTasks,
    totalTasks,

    // Methods
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    clearCompletedTasks,
    clearAllTasks,
    getTaskById,
  }
}
