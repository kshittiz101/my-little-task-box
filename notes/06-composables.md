Here are the perfect notes on **Composables (Custom Hooks)** in Vue.js, structured as a comprehensive cheat sheet for modern development (Vue 3).

---

# 📚 Vue.js Composables (Custom Hooks): The Ultimate Cheat Sheet

## 1. WHAT are Composables?

- **Definition:** Reusable functions that encapsulate reactive logic using Vue's Composition API. They're similar to React's custom hooks but designed specifically for Vue's reactivity system.
- **Analogy:** Think of composables as "logic recipes" that you can mix into any component. Just like how you reuse functions in programming, you reuse reactive logic with composables.
- **Core Concept:** Composables extract stateful logic from components, making it reusable across multiple components while maintaining reactivity.

---

## 2. WHEN to use Composables?

Use composables when:

1. **Code Reuse:** The same reactive logic is needed in multiple components (e.g., data fetching, form handling, animations).
2. **Logic Extraction:** A component is becoming too complex, and you want to separate concerns.
3. **Cross-Component State:** You need to share reactive state between components without prop drilling.
4. **API Integration:** Wrapping external APIs, local storage, or browser APIs with reactivity.
5. **Complex State Logic:** Managing complex state transitions, side effects, or lifecycle concerns.

❌ **Do NOT use composables when:** The logic is completely unique to one component and won't be reused. Keep it in the component.

---

## 3. HOW to use Composables

### A. Basic Structure

A composable is a function that uses Composition API utilities and returns reactive data:

```typescript
// useCounter.ts
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  const double = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  return {
    count,
    double,
    increment,
    decrement,
  }
}
```

### B. Using in Components

Import and use like any other function:

```html
<script setup>
  import { useCounter } from '@/composables/useCounter'

  const { count, double, increment, decrement } = useCounter(5)
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ double }}</p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
  </div>
</template>
```

### C. Advanced Patterns

#### 1. Async Data Fetching

```typescript
// useFetch.ts
import { ref, computed } from 'vue'

export function useFetch<T>(url: string) {
  const data = ref<T | null>(null)
  const error = ref<string | null>(null)
  const loading = ref(false)

  const fetchData = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(url)
      data.value = await response.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  return {
    data: readonly(data),
    error: readonly(error),
    loading: readonly(loading),
    fetchData,
  }
}
```

#### 2. Local Storage with Reactivity

```typescript
// useLocalStorage.ts
import { ref, watch } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const value = ref<T>(defaultValue)

  // Load from localStorage on mount
  const stored = localStorage.getItem(key)
  if (stored) {
    try {
      value.value = JSON.parse(stored)
    } catch {
      value.value = defaultValue
    }
  }

  // Save to localStorage when value changes
  watch(
    value,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    { deep: true },
  )

  return value
}
```

#### 3. Event Listener Management

```typescript
// useEventListener.ts
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target: EventTarget, event: string, callback: EventListener) {
  onMounted(() => {
    target.addEventListener(event, callback)
  })

  onUnmounted(() => {
    target.removeEventListener(event, callback)
  })
}
```

#### 4. Form Handling

```typescript
// useForm.ts
import { ref, reactive } from 'vue'

interface FormState {
  [key: string]: any
}

export function useForm<T extends FormState>(initialState: T) {
  const form = reactive({ ...initialState })
  const errors = reactive<Record<string, string>>({})
  const isSubmitting = ref(false)

  const setError = (field: string, message: string) => {
    errors[field] = message
  }

  const clearError = (field: string) => {
    delete errors[field]
  }

  const reset = () => {
    Object.assign(form, initialState)
    Object.keys(errors).forEach((key) => delete errors[key])
  }

  const submit = async (submitFn: (data: T) => Promise<void>) => {
    isSubmitting.value = true
    try {
      await submitFn(form)
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    form,
    errors,
    isSubmitting,
    setError,
    clearError,
    reset,
    submit,
  }
}
```

### D. TypeScript Support

Full type safety with generics:

```typescript
// useAsync.ts
import { ref, readonly } from 'vue'

export function useAsync<T>(asyncFn: () => Promise<T>) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)

  const execute = async () => {
    loading.value = true
    error.value = null

    try {
      data.value = await asyncFn()
    } catch (err) {
      error.value = err as Error
    } finally {
      loading.value = false
    }
  }

  return {
    data: readonly(data),
    error: readonly(error),
    loading: readonly(loading),
    execute,
  }
}
```

---

## 4. THOUGHT PURPOSE

- **Reusability:** Extract common patterns into shareable functions, reducing code duplication.
- **Separation of Concerns:** Keep components focused on presentation while logic lives in composables.
- **Testability:** Composables can be tested in isolation from components.
- **Composition:** Mix and match different composables to build complex component behavior.
- **Maintainability:** Changes to logic in one place affect all components using that composable.

---

## 5. 🏆 Best Practices

### ✅ 1. Naming Convention

Always prefix with `use` and use PascalCase for the file:

```typescript
// ✅ Good
// useCounter.ts
export function useCounter() { ... }

// useFetchData.ts
export function useFetchData() { ... }

// ❌ Avoid
// counter.ts
export function counterLogic() { ... }
```

### ✅ 2. Return Consistent Interface

Always return an object with reactive refs and methods:

```typescript
// ✅ Good: Consistent object return
export function useCounter() {
  return {
    count,
    increment,
    decrement,
  }
}

// ❌ Avoid: Inconsistent returns
export function useCounter() {
  return [count, increment, decrement] // Array
}
```

### ✅ 3. Use Readonly for External State

Protect internal state from external mutation:

```typescript
// ✅ Good: Expose as readonly
export function useCounter() {
  const count = ref(0)

  return {
    count: readonly(count), // External can't mutate
    increment: () => count.value++,
    decrement: () => count.value--,
  }
}
```

### ✅ 4. Handle Lifecycle Properly

Use proper lifecycle hooks in composables:

```typescript
// ✅ Good: Proper cleanup
export function useInterval(callback: () => void, delay: number) {
  let id: number

  onMounted(() => {
    id = setInterval(callback, delay)
  })

  onUnmounted(() => {
    clearInterval(id)
  })
}
```

### ✅ 5. Make Parameters Flexible

Accept parameters for customization:

```typescript
// ✅ Good: Configurable
export function useCounter(initial = 0, step = 1) {
  // ...
}

// ❌ Avoid: Hardcoded values
export function useCounter() {
  const count = ref(0) // Always starts at 0
  // ...
}
```

### ✅ 6. Document with JSDoc

Provide clear documentation:

```typescript
/**
 * Composable for managing a counter with increment/decrement functionality
 * @param initial - Initial count value
 * @param step - Amount to increment/decrement by
 * @returns Object with count state and control methods
 */
export function useCounter(initial = 0, step = 1) {
  // ...
}
```

### ✅ 7. Avoid Side Effects in Module Level

Don't execute code at import time:

```typescript
// ✅ Good: No side effects at import
export function useLocalStorage(key: string) {
  // Logic runs when called
}

// ❌ Avoid: Side effects on import
const stored = localStorage.getItem('key') // Runs on import!
export function useLocalStorage() {
  // ...
}
```

### ✅ 8. Compose Composables

Build complex logic by combining simpler composables:

```typescript
// ✅ Good: Composition
export function useUserProfile() {
  const { data: user, loading } = useFetch('/api/user')
  const preferences = useLocalStorage('user-prefs', {})

  return {
    user,
    preferences,
    loading,
  }
}
```

### ✅ 9. Error Handling

Include error states in your composables:

```typescript
// ✅ Good: Error handling
export function useFetch(url: string) {
  const error = ref(null)

  const fetchData = async () => {
    try {
      // ...
    } catch (err) {
      error.value = err
    }
  }

  return {
    error: readonly(error),
    fetchData,
  }
}
```

### ✅ 10. TypeScript Generics

Use generics for type-safe composables:

```typescript
// ✅ Good: Generic types
export function useList<T>(initial: T[] = []) {
  const list = ref<T[]>(initial)

  return {
    list: readonly(list),
    add: (item: T) => list.value.push(item),
    remove: (index: number) => list.value.splice(index, 1),
  }
}
```

---

## ⚡ Quick Summary Table

| Aspect         | Description                       | Example                     |
| :------------- | :-------------------------------- | :-------------------------- |
| **Purpose**    | Extract reusable reactive logic   | `useCounter`, `useFetch`    |
| **Naming**     | `use*` prefix                     | `useLocalStorage.ts`        |
| **Return**     | Object with reactive refs/methods | `{ data, loading, fetch }`  |
| **Parameters** | Configurable options              | `useCounter(initial, step)` |
| **Reactivity** | Uses Vue's reactive system        | `ref`, `computed`, `watch`  |

---

## 🔄 Real-World Examples

### Example 1: API Data Fetching

```typescript
// composables/usePosts.ts
import { ref, readonly } from 'vue'

export interface Post {
  id: number
  title: string
  body: string
}

export function usePosts() {
  const posts = ref<Post[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchPosts = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts')
      posts.value = await response.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch posts'
    } finally {
      loading.value = false
    }
  }

  const addPost = async (post: Omit<Post, 'id'>) => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify(post),
        headers: { 'Content-Type': 'application/json' },
      })
      const newPost = await response.json()
      posts.value.unshift(newPost)
    } catch (err) {
      error.value = 'Failed to add post'
    }
  }

  return {
    posts: readonly(posts),
    loading: readonly(loading),
    error: readonly(error),
    fetchPosts,
    addPost,
  }
}
```

### Example 2: Mouse Position Tracking

```typescript
// composables/useMouse.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function updatePosition(event: MouseEvent) {
    x.value = event.clientX
    y.value = event.clientY
  }

  onMounted(() => {
    document.addEventListener('mousemove', updatePosition)
  })

  onUnmounted(() => {
    document.removeEventListener('mousemove', updatePosition)
  })

  return {
    x: readonly(x),
    y: readonly(y),
  }
}
```

### Example 3: Debounced Search

```typescript
// composables/useDebounce.ts
import { ref, watch, readonly } from 'vue'

export function useDebounce<T>(value: T, delay: number) {
  const debouncedValue = ref<T>(value)

  let timeoutId: number

  watch(value, () => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      debouncedValue.value = value
    }, delay)
  })

  return readonly(debouncedValue)
}

// Usage in component
export function useSearch() {
  const query = ref('')
  const debouncedQuery = useDebounce(query, 300)

  const { data: results, loading } = useFetch(() => searchAPI(debouncedQuery.value))

  return {
    query,
    results,
    loading,
  }
}
```

### Example 4: Component Communication

```typescript
// composables/useEmitter.ts
import { reactive } from 'vue'

type EventMap = Record<string, any[]>

export function useEmitter<T extends EventMap = {}>() {
  const events = reactive<Record<string, Function[]>>({})

  const on = <K extends keyof T>(event: K, callback: (...args: T[K]) => void) => {
    if (!events[event as string]) {
      events[event as string] = []
    }
    events[event as string].push(callback)
  }

  const emit = <K extends keyof T>(event: K, ...args: T[K]) => {
    const callbacks = events[event as string]
    if (callbacks) {
      callbacks.forEach((cb) => cb(...args))
    }
  }

  const off = <K extends keyof T>(event: K, callback: Function) => {
    const callbacks = events[event as string]
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  return {
    on,
    emit,
    off,
  }
}
```
