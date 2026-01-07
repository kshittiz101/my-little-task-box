<script setup lang="ts">
import { ref } from 'vue'

// import components
import TaskInput from '@/components/TaskInput.vue'
import TaskItem from '@/components/TaskItem.vue'
const username = ref('Kshittiz')
</script>

<template>
  <section class="w-full h-[100vh] bg-gray-300 flex justify-center items-center flex-col">
    <h2 class="text-2xl font-bold">Hello, {{ username }}!</h2>
    <TaskInput />
    <TaskItem title="Clean your room" />
  </section>
</template>

<style scoped></style>
