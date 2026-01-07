<script setup lang="ts">
//
const Props = defineProps({
  title: String,
})

// define emits
const emits = defineEmits(['delete'])
</script>
<template>
  <section class="flex justify-center items-center gap-3 mt-2">
    <p>{{ Props.title }}</p>

    <button @click="emits('delete')" class="broder bg-red-600 p-2 text-white rounded-md">
      Delete
    </button>
  </section>
</template>
