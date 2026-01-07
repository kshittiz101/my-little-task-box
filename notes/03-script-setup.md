Here are the perfect notes on **`<script setup>`** in Vue.js, structured as a comprehensive cheat sheet for modern development (Vue 3).

---

# 📚 Vue.js `<script setup>`: The Ultimate Cheat Sheet

## 1. WHAT is `<script setup>`?

- **Definition:** A compile-time syntactic sugar introduced in Vue 3 that simplifies the use of the Composition API in Single File Components (SFCs).
- **Analogy:** Think of it as a "shortcut" for writing Composition API code. Instead of manually exporting an object with `setup()`, you write code directly in a `<script setup>` block.
- **Core Concept:** All top-level bindings (variables, functions, imports) are automatically exposed to the template. No need for explicit returns or exports.

---

## 2. WHEN to use `<script setup>`?

Use `<script setup>` when:

1. **Composition API Components:** You're building components using Vue 3's Composition API (reactive refs, computed, lifecycle hooks, etc.).
2. **New Vue 3 Projects:** For all new components in Vue 3 applications, as it's the recommended and most concise way.
3. **TypeScript Support:** It provides excellent TypeScript integration with full type inference.
4. **Performance:** It enables better tree-shaking and smaller bundle sizes since unused code is automatically removed.

❌ **Do NOT use `<script setup>` when:** You're using the Options API (traditional Vue 2 style with `data()`, `methods`, etc.). Stick to regular `<script>` for those.

---

## 3. HOW to use `<script setup>`

### A. Basic Syntax

Replace the standard `<script>` tag with `<script setup>`.

```html
<!-- Traditional Composition API -->
<script>
  import { ref } from 'vue'

  export default {
    setup() {
      const count = ref(0)
      const increment = () => count.value++

      return {
        count,
        increment,
      }
    },
  }
</script>

<!-- With <script setup> (Cleaner!) -->
<script setup>
  import { ref } from 'vue'

  const count = ref(0)
  const increment = () => count.value++
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

### B. Automatic Template Exposure

Everything defined at the top level is automatically available in the template:

```html
<script setup>
  import { ref, computed } from 'vue'

  const firstName = ref('John')
  const lastName = ref('Doe')

  const fullName = computed(() => `${firstName.value} ${lastName.value}`)

  function updateName(newFirst, newLast) {
    firstName.value = newFirst
    lastName.value = newLast
  }
</script>

<template>
  <!-- All variables and functions are accessible -->
  <p>{{ fullName }}</p>
  <button @click="updateName('Jane', 'Smith')">Change Name</button>
</template>
```

### C. Integration with Composition API Features

Works seamlessly with all Composition API utilities:

```html
<script setup>
  import { ref, computed, onMounted, watch } from 'vue'

  const props = defineProps(['initialValue'])
  const emit = defineEmits(['update'])

  const value = ref(props.initialValue)

  const doubled = computed(() => value.value * 2)

  onMounted(() => {
    console.log('Component mounted')
  })

  watch(value, (newVal) => {
    emit('update', newVal)
  })
</script>
```

### D. TypeScript Support

Provides excellent TypeScript integration:

```html
<script setup lang="ts">
  import { ref } from 'vue'

  interface User {
    name: string
    age: number
  }

  const user = ref<User>({
    name: 'Alice',
    age: 30,
  })

  function updateUser(newUser: User) {
    user.value = newUser
  }
</script>
```

---

## 4. THOUGHT PURPOSE

- **Simplification:** Reduces boilerplate code. No need for `export default` or manual `return` statements.
- **Performance:** Compile-time processing allows for better optimization, tree-shaking, and smaller bundles.
- **Developer Experience:** Cleaner, more readable code. Less context switching between setup function and return object.
- **TypeScript Integration:** Automatic type inference makes TypeScript development smoother.
- **Future-Proof:** Designed as the standard way to write Vue 3 components going forward.

---

## 5. 🏆 Best Practices

### ✅ 1. Use `<script setup>` for All New Components

Always prefer `<script setup>` over traditional `<script>` for Composition API components. It's the recommended approach in Vue 3.

### ✅ 2. Keep Top-Level Code Minimal

Only define reactive data, computed properties, and functions at the top level. Move complex logic into composables.

```html
<script setup>
  // ✅ Good: Simple declarations
  const count = ref(0)

  // ❌ Avoid: Complex logic at top level
  const complexData = someComplexComputation()
</script>
```

### ✅ 3. Use Descriptive Variable Names

Since everything is auto-exposed, use clear, descriptive names:

```html
<script setup>
  // ✅ Good
  const isLoading = ref(false)
  const userProfile = ref(null)

  // ❌ Avoid
  const l = ref(false)
  const u = ref(null)
</script>
```

### ✅ 4. Combine with Other Compiler Macros

`<script setup>` works perfectly with `defineProps`, `defineEmits`, `defineExpose`, etc.:

```html
<script setup>
  const props = defineProps(['title'])
  const emit = defineEmits(['close'])

  const handleClose = () => emit('close')
</script>
```

### ✅ 5. Import Only What You Need

Be mindful of imports to keep bundles small:

```html
<script setup>
  // ✅ Import only used functions
  import { ref, computed } from 'vue'

  // ❌ Don't import everything
  import Vue from 'vue'
</script>
```

### ✅ 6. Use Composables for Reusable Logic

Extract complex logic into composables to keep components clean:

```html
<script setup>
  import { useUserData } from '@/composables/useUserData'

  const { user, loading, fetchUser } = useUserData()
</script>
```

---

## ⚡ Quick Summary Table

| Feature              | Traditional `<script>`                         | `<script setup>`          |
| :------------------- | :--------------------------------------------- | :------------------------ |
| **Setup Function**   | Required: `export default { setup() { ... } }` | Not needed                |
| **Return Statement** | Required: `return { count, increment }`        | Not needed (auto-exposed) |
| **Template Access**  | Only returned items                            | All top-level bindings    |
| **TypeScript**       | Manual types needed                            | Automatic inference       |
| **Performance**      | Good                                           | Better (compile-time)     |
| **Bundle Size**      | Standard                                       | Smaller (tree-shaking)    |

---

## 🔄 Migration from Traditional Setup

If migrating existing components:

1. Change `<script>` to `<script setup>`
2. Remove `export default { setup() { ... } }`
3. Remove the `return` statement
4. Ensure all used variables/functions are defined at top level
5. Update any TypeScript types if needed

```html
<!-- Before -->
<script>
  export default {
    setup() {
      const count = ref(0)
      return { count }
    },
  }
</script>

<!-- After -->
<script setup>
  const count = ref(0)
</script>
```
