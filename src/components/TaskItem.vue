<script setup lang="ts">
// creating props, props can be define like
// option1: array of string (simple and no validations)
// const propsInArray = defineProps(['title', 'likes'])

// option2: object with types and validation (Recommended)
// const Props = defineProps({
//   title: { types: String, required: true },
// })

// option 3: using ts
// This provides IntelliSense and strict type checking.
interface TaskProps {
  title: string
  description?: string // ? make it optional
}
// now we can use generic syntax and use withDefaults if you have defaults values
const props = withDefaults(defineProps<TaskProps>(), {
  description: 'Description is not provided',
})

// define emits using array in  simple js
// const emit = defineEmits(['delete'])
// const handleDelete = () => {
//   emit('delete')
//   console.log('Delete Clicked from Child Taskitem')
// }

// using ts
const emit = defineEmits<{
  delete: [id: number] // events delete expects a number
  'update-title': [newTitle: string]
}>()

const handleDelete = () => {
  emit('delete', 1)
  console.log('Delete Clicked from Child Taskitem')
}
</script>
<template>
  <section class="flex justify-center items-center gap-3 mt-2">
    <div class="">
      <h3 class="text-base">{{ props.title }}</h3>
      <p class="text-gray-600 text-xs">{{ props.description }}</p>
    </div>

    <button @click="handleDelete" class="broder bg-red-600 p-2 text-white rounded-md">
      Delete
    </button>
  </section>
</template>
