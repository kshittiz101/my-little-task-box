<script setup lang="ts">
import { ref } from 'vue'

const newTask = ref('')
function addTask() {
  console.log('task is added')
}
</script>

<template>
  <div class="flex items-center mt-4">
    <input type="text" placeholder="Enter your task" v-model="newTask" class="border p-2 text-base rounded-md" />
    <button @click="addTask"></button>
  </div>
</template>
