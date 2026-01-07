Here are the perfect notes on **`defineExpose`** in Vue.js, structured as a comprehensive cheat sheet for modern development (Vue 3).

---

# 📚 Vue.js `defineExpose`: The Ultimate Cheat Sheet

## 1. WHAT is `defineExpose`?

- **Definition:** A compiler macro in Vue 3's `<script setup>` that explicitly controls what properties and methods are exposed to parent components when accessing the child via a template ref.
- **Analogy:** Think of components as black boxes. By default, `<script setup>` hides everything inside. `defineExpose` is like creating a small "window" or "API" that lets the parent peek inside and interact with specific parts.
- **Core Concept:** In `<script setup>`, nothing is exposed by default for encapsulation. `defineExpose` allows selective exposure of internal state and methods.

---

## 2. WHEN to use `defineExpose`?

Use `defineExpose` when:

1. **Parent Needs Access:** The parent component needs to call methods on the child or access its reactive data via a template ref.
2. **Controlled API:** You want to provide a clean, intentional API for parent-child interaction, rather than exposing everything.
3. **Imperative Operations:** For operations that can't be handled through props/emits, like focusing an input or triggering animations.
4. **Library Components:** When building reusable component libraries where parents need programmatic access.

❌ **Do NOT use `defineExpose` when:** The interaction can be handled through props (down) and emits (up). Overusing it breaks component encapsulation.

---

## 3. HOW to use `defineExpose`

### A. Basic Usage

In `<script setup>`, use `defineExpose` to specify what to expose:

```html
<!-- Child Component -->
<script setup>
  import { ref } from 'vue'

  const count = ref(0)
  const isVisible = ref(true)

  function increment() {
    count.value++
  }

  function reset() {
    count.value = 0
  }

  // Only expose specific methods and properties
  defineExpose({
    increment,
    reset,
    count: readonly(count), // Expose as read-only if desired
  })
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">+</button>
    <button @click="reset">Reset</button>
  </div>
</template>
```

### B. Parent Accessing Exposed API

The parent uses a template ref to access the exposed members:

```html
<!-- Parent Component -->
<script setup>
  import { ref } from 'vue'
  import Counter from './Counter.vue'

  const counterRef = ref()

  function handleExternalIncrement() {
    // Access exposed method
    counterRef.value?.increment()
  }

  function getCurrentCount() {
    // Access exposed property
    return counterRef.value?.count
  }
</script>

<template>
  <Counter ref="counterRef" />
  <button @click="handleExternalIncrement">Increment from Parent</button>
  <p>Current count: {{ getCurrentCount() }}</p>
</template>
```

### C. TypeScript Support

Provides full type safety:

```html
<script setup lang="ts">
  import { ref, readonly } from 'vue'

  interface ExposedAPI {
    increment: () => void
    reset: () => void
    count: number
  }

  const count = ref(0)

  function increment() {
    count.value++
  }

  function reset() {
    count.value = 0
  }

  // TypeScript will enforce the exposed API
  defineExpose<ExposedAPI>({
    increment,
    reset,
    count: readonly(count),
  })
</script>
```

### D. Common Use Cases

#### 1. Form Controls (Focus Management)

```html
<!-- InputField.vue -->
<script setup>
  import { ref } from 'vue'

  const inputRef = ref()

  function focus() {
    inputRef.value?.focus()
  }

  function select() {
    inputRef.value?.select()
  }

  defineExpose({
    focus,
    select,
  })
</script>

<template>
  <input ref="inputRef" v-model="modelValue" />
</template>

<!-- Parent -->
<script setup>
  const inputRef = ref()

  onMounted(() => {
    inputRef.value?.focus() // Programmatically focus
  })
</script>

<template>
  <InputField ref="inputRef" />
</template>
```

#### 2. Modal/Dialog Controls

```html
<!-- Modal.vue -->
<script setup>
  import { ref } from 'vue'

  const isOpen = ref(false)

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  defineExpose({
    open,
    close,
    isOpen: readonly(isOpen),
  })
</script>

<template>
  <div v-if="isOpen" class="modal">
    <!-- modal content -->
    <button @click="close">Close</button>
  </div>
</template>

<!-- Parent -->
<script setup>
  const modalRef = ref()

  function showModal() {
    modalRef.value?.open()
  }
</script>

<template>
  <button @click="showModal">Show Modal</button>
  <Modal ref="modalRef" />
</template>
```

---

## 4. THOUGHT PURPOSE

- **Encapsulation:** Keeps component internals private by default, following the principle of least privilege.
- **Clean APIs:** Forces developers to think about what should be exposed, creating intentional component interfaces.
- **Type Safety:** Works seamlessly with TypeScript for compile-time guarantees.
- **Performance:** Prevents accidental exposure of reactive dependencies that could cause unnecessary re-renders.
- **Maintainability:** Makes component contracts explicit, easier to refactor internals without breaking parents.

---

## 5. 🏆 Best Practices

### ✅ 1. Expose Minimally

Only expose what's absolutely necessary. Less is more for component APIs.

```html
<script setup>
  // ✅ Good: Only expose public methods
  defineExpose({
    submit,
    reset,
  })

  // ❌ Avoid: Exposing internal state
  defineExpose({
    count,
    isLoading,
    internalData,
    submit,
    reset,
  })
</script>
```

### ✅ 2. Use Read-Only for Data

When exposing reactive data, consider using `readonly()` to prevent external mutation:

```html
<script setup>
  import { ref, readonly } from 'vue'

  const internalState = ref('private')

  defineExpose({
    // ✅ Allow reading but not writing
    state: readonly(internalState),
  })
</script>
```

### ✅ 3. Provide Clear Method Names

Use descriptive names that indicate the action:

```html
<script setup>
  // ✅ Good
  defineExpose({
    scrollToTop,
    focusFirstInput,
    validateAndSubmit,
  })

  // ❌ Avoid
  defineExpose({
    doIt,
    handle,
    process,
  })
</script>
```

### ✅ 4. Document Exposed APIs

Use JSDoc comments to document the exposed API:

```html
<script setup>
  /**
   * Exposed API for parent components
   * @property {Function} focus - Focuses the input field
   * @property {Function} validate - Validates the current value
   * @property {boolean} isValid - Current validation state
   */
  defineExpose({
    focus,
    validate,
    isValid: readonly(isValid),
  })
</script>
```

### ✅ 5. Prefer Props/Emits Over Expose

Use props and emits for declarative parent-child communication when possible:

```html
<script setup>
  // ✅ Preferred: Use props/emits for data flow
  const props = defineProps(['visible'])
  const emit = defineEmits(['close'])

  defineExpose({
    // Only expose imperative methods
    focus,
  })
</script>
```

### ✅ 6. TypeScript Interfaces

Define interfaces for exposed APIs in TypeScript:

```html
<script setup lang="ts">
  interface ModalAPI {
    open(): void
    close(): void
    readonly isOpen: boolean
  }

  defineExpose<ModalAPI>({
    open,
    close,
    isOpen: readonly(isOpen),
  })
</script>
```

---

## ⚡ Quick Summary Table

| Aspect               | Without `defineExpose` | With `defineExpose`                 |
| :------------------- | :--------------------- | :---------------------------------- |
| **Default Exposure** | Nothing exposed        | Selective exposure                  |
| **Encapsulation**    | Automatic              | Explicit control                    |
| **Parent Access**    | No access to internals | Controlled access                   |
| **TypeScript**       | No type safety         | Full type safety                    |
| **Best Practice**    | Good for most cases    | When parent needs imperative access |

---

## 🔄 Comparison with Options API

In Options API, everything in the component instance is exposed by default:

```html
<!-- Options API: Everything exposed -->
<script>
  export default {
    data() {
      return { count: 0 }
    },
    methods: {
      increment() {
        this.count++
      },
    },
  }
</script>

<!-- Parent can access everything -->
<script setup>
  const compRef = ref()
  // Can access compRef.value.count, compRef.value.increment, etc.
</script>
```

With `<script setup>` + `defineExpose`, you have full control:

```html
<!-- Composition API: Controlled exposure -->
<script setup>
  const count = ref(0)
  function increment() {
    count.value++
  }

  defineExpose({ increment }) // Only expose increment
</script>
```
