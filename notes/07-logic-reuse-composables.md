Here are the perfect notes on **Logic Reuse with Composables - Clean Separation of Concerns** in Vue.js, structured as a comprehensive cheat sheet for modern development (Vue 3).

---

# 📚 Vue.js Logic Reuse with Composables: Clean Separation of Concerns

## 1. WHAT is Logic Reuse with Composables?

- **Definition:** A design pattern where composables are used to extract and isolate different types of logic (business logic, UI logic, side effects) from components, enabling clean separation of concerns while maintaining reusability.
- **Analogy:** Think of composables as specialized "departments" in your application. Each handles a specific responsibility: one for data fetching, another for user interactions, another for animations, etc. Components become "managers" that coordinate these departments.
- **Core Concept:** Instead of mixing data fetching, state management, event handling, and UI logic in one component, each concern is extracted into focused composables that can be reused and tested independently.

---

## 2. WHEN to use Logic Reuse with Composables?

Use this pattern when:

1. **Complex Components:** Components are doing too many things (data fetching + UI state + business logic).
2. **Cross-Cutting Concerns:** Logic that spans multiple components (authentication, theming, internationalization).
3. **Business Logic Extraction:** Separating domain logic from presentation logic.
4. **Side Effect Management:** Isolating async operations, timers, event listeners.
5. **State Management:** Complex state transitions that need to be predictable and testable.

❌ **Do NOT use when:** Components are simple and the logic is truly unique. Don't over-engineer simple cases.

---

## 3. HOW to Apply Logic Reuse with Composables

### A. Identify Concerns to Separate

Common concerns to extract:

1. **Data Logic:** API calls, data transformations, caching
2. **UI Logic:** Component state, animations, responsive behavior
3. **Business Logic:** Validation, calculations, workflow rules
4. **Side Effects:** Timers, event listeners, subscriptions
5. **Navigation Logic:** Routing, breadcrumbs, history management

### B. Layered Architecture Pattern

Organize composables in layers:

```typescript
// 📁 composables/
// ├── data/           // Data access layer
// ├── ui/            // UI interaction layer
// ├── business/      // Business logic layer
// ├── effects/       // Side effects layer
// └── shared/        // Cross-cutting concerns
```

#### 1. Data Layer Composables

Handle all data operations:

```typescript
// composables/data/usePosts.ts
import { ref, readonly } from 'vue'

export interface Post {
  id: number
  title: string
  content: string
}

export function usePosts() {
  const posts = ref<Post[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchPosts = async () => {
    loading.value = true
    try {
      const response = await fetch('/api/posts')
      posts.value = await response.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch'
    } finally {
      loading.value = false
    }
  }

  const createPost = async (post: Omit<Post, 'id'>) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      })
      const newPost = await response.json()
      posts.value.push(newPost)
      return newPost
    } catch (err) {
      error.value = 'Failed to create post'
      throw err
    }
  }

  return {
    posts: readonly(posts),
    loading: readonly(loading),
    error: readonly(error),
    fetchPosts,
    createPost,
  }
}
```

#### 2. UI Layer Composables

Manage component-specific UI state:

```typescript
// composables/ui/useModal.ts
import { ref, readonly } from 'vue'

export function useModal() {
  const isOpen = ref(false)
  const isAnimating = ref(false)

  const open = async () => {
    isAnimating.value = true
    isOpen.value = true
    // Wait for animation
    await new Promise((resolve) => setTimeout(resolve, 300))
    isAnimating.value = false
  }

  const close = async () => {
    isAnimating.value = true
    // Wait for animation
    await new Promise((resolve) => setTimeout(resolve, 300))
    isOpen.value = false
    isAnimating.value = false
  }

  return {
    isOpen: readonly(isOpen),
    isAnimating: readonly(isAnimating),
    open,
    close,
  }
}
```

#### 3. Business Logic Layer Composables

Handle domain rules and calculations:

```typescript
// composables/business/usePostValidation.ts
import { computed } from 'vue'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export function usePostValidation() {
  const validateTitle = (title: string): ValidationResult => {
    const errors: string[] = []

    if (!title.trim()) {
      errors.push('Title is required')
    } else if (title.length < 5) {
      errors.push('Title must be at least 5 characters')
    } else if (title.length > 100) {
      errors.push('Title must be less than 100 characters')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  const validateContent = (content: string): ValidationResult => {
    const errors: string[] = []

    if (!content.trim()) {
      errors.push('Content is required')
    } else if (content.length < 10) {
      errors.push('Content must be at least 10 characters')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  const validatePost = (title: string, content: string) => {
    const titleValidation = validateTitle(title)
    const contentValidation = validateContent(content)

    return {
      isValid: titleValidation.isValid && contentValidation.isValid,
      errors: [...titleValidation.errors, ...contentValidation.errors],
    }
  }

  return {
    validateTitle,
    validateContent,
    validatePost,
  }
}
```

#### 4. Side Effects Layer Composables

Manage external interactions:

```typescript
// composables/effects/useKeyboard.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useKeyboard() {
  const pressedKeys = ref<Set<string>>(new Set())

  const isPressed = (key: string) => pressedKeys.value.has(key.toLowerCase())

  const onKeyDown = (event: KeyboardEvent) => {
    pressedKeys.value.add(event.key.toLowerCase())
  }

  const onKeyUp = (event: KeyboardEvent) => {
    pressedKeys.value.delete(event.key.toLowerCase())
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
  })

  return {
    pressedKeys: readonly(pressedKeys),
    isPressed,
  }
}
```

#### 5. Shared/Cross-Cutting Composables

Handle application-wide concerns:

```typescript
// composables/shared/useAuth.ts
import { ref, computed, readonly } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

export function useAuth() {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      user.value = data.user
      token.value = data.token

      // Store in localStorage
      localStorage.setItem('auth-token', data.token)
    } catch (err) {
      throw new Error('Login failed')
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth-token')
  }

  // Auto-login on app start
  const storedToken = localStorage.getItem('auth-token')
  if (storedToken) {
    // Validate token and set user
    token.value = storedToken
  }

  return {
    user: readonly(user),
    token: readonly(token),
    isAuthenticated,
    isAdmin,
    login,
    logout,
  }
}
```

### C. Component Integration

Components become clean coordinators:

```html
<script setup>
  import { usePosts } from '@/composables/data/usePosts'
  import { useModal } from '@/composables/ui/useModal'
  import { usePostValidation } from '@/composables/business/usePostValidation'
  import { useAuth } from '@/composables/shared/useAuth'

  // Data layer
  const { posts, loading, error, fetchPosts, createPost } = usePosts()

  // UI layer
  const { isOpen, open, close } = useModal()

  // Business logic layer
  const { validatePost } = usePostValidation()

  // Shared layer
  const { isAuthenticated } = useAuth()

  // Component-specific state
  const newPostTitle = ref('')
  const newPostContent = ref('')

  const handleSubmit = async () => {
    const validation = validatePost(newPostTitle.value, newPostContent.value)

    if (!validation.isValid) {
      // Handle validation errors
      return
    }

    try {
      await createPost({
        title: newPostTitle.value,
        content: newPostContent.value,
      })

      newPostTitle.value = ''
      newPostContent.value = ''
      close()
    } catch (err) {
      // Handle creation error
    }
  }

  onMounted(() => {
    fetchPosts()
  })
</script>

<template>
  <div>
    <div v-if="error">{{ error }}</div>

    <div v-for="post in posts" :key="post.id">
      <h3>{{ post.title }}</h3>
      <p>{{ post.content }}</p>
    </div>

    <button v-if="isAuthenticated" @click="open">Create Post</button>

    <Modal :open="isOpen" @close="close">
      <form @submit.prevent="handleSubmit">
        <input v-model="newPostTitle" placeholder="Title" />
        <textarea v-model="newPostContent" placeholder="Content"></textarea>
        <button type="submit" :disabled="loading">Create</button>
      </form>
    </Modal>
  </div>
</template>
```

---

## 4. THOUGHT PURPOSE

- **Separation of Concerns:** Each composable has a single responsibility, making code easier to understand and maintain.
- **Testability:** Isolated logic can be unit tested independently of UI components.
- **Reusability:** Well-designed composables can be reused across different parts of the application.
- **Scalability:** As the application grows, new features can be added without cluttering existing components.
- **Developer Experience:** Clear boundaries make it easier for teams to work on different aspects simultaneously.

---

## 5. 🏆 Best Practices

### ✅ 1. Follow Single Responsibility Principle

Each composable should do one thing well:

```typescript
// ✅ Good: Single responsibility
export function useDataFetching() {
  /* API calls */
}
export function useFormValidation() {
  /* Validation logic */
}
export function useLocalStorage() {
  /* Storage logic */
}

// ❌ Avoid: Multiple responsibilities
export function useUserManagement() {
  // Data fetching + validation + storage + UI state
}
```

### ✅ 2. Use Clear Naming Conventions

Prefix composables by their layer/concern:

```typescript
// Data layer
export function usePosts() // API data
export function useUsers() // User data
export function useCache() // Caching logic

// UI layer
export function useModal() // Modal state
export function useDropdown() // Dropdown state
export function useTooltip() // Tooltip behavior

// Business layer
export function usePricing() // Price calculations
export function usePermissions() // Access control
export function useWorkflow() // Business processes
```

### ✅ 3. Keep Composables Focused

Limit composable size and complexity:

```typescript
// ✅ Good: Focused and small
export function useDebounce(value, delay) {
  // Simple debouncing logic
}

// ❌ Avoid: Kitchen sink composable
export function useEverything() {
  // Debouncing + API calls + validation + storage + ...
}
```

### ✅ 4. Define Clear Interfaces

Use TypeScript interfaces for composable contracts:

```typescript
interface PostData {
  id: number
  title: string
  content: string
}

interface UsePostsReturn {
  posts: readonly Ref<PostData[]>
  loading: readonly Ref<boolean>
  error: readonly Ref<string | null>
  fetchPosts: () => Promise<void>
  createPost: (post: Omit<PostData, 'id'>) => Promise<PostData>
}

export function usePosts(): UsePostsReturn {
  // Implementation
}
```

### ✅ 5. Handle Errors Appropriately

Each layer should handle its own errors:

```typescript
// Data layer: Handle API errors
export function usePosts() {
  const error = ref(null)
  // Handle network errors, parsing errors
}

// Business layer: Handle validation errors
export function useValidation() {
  // Handle business rule violations
}

// UI layer: Handle user interaction errors
export function useForm() {
  // Handle form submission errors
}
```

### ✅ 6. Avoid Circular Dependencies

Be careful with composable dependencies:

```typescript
// ✅ Good: Clear dependency flow
// useAuth -> (no dependencies)
export function useAuth() { ... }

// usePosts -> useAuth (depends on auth)
export function usePosts() {
  const { token } = useAuth()
  // Use token for API calls
}

// ❌ Avoid: Circular dependency
// useA depends on useB, useB depends on useA
```

### ✅ 7. Provide Sensible Defaults

Make composables easy to use out of the box:

```typescript
// ✅ Good: Sensible defaults
export function useFetch(url, options = {}) {
  const timeout = options.timeout ?? 5000
  const retries = options.retries ?? 3
  // ...
}

// ❌ Avoid: Require all parameters
export function useFetch(url, timeout, retries, headers) {
  // Must provide everything
}
```

### ✅ 8. Document Composables

Use JSDoc for clear documentation:

```typescript
/**
 * Data layer composable for post management
 * @param options - Configuration options
 * @param options.autoFetch - Whether to fetch posts on mount
 * @returns Object with posts state and CRUD methods
 */
export function usePosts(options: UsePostsOptions = {}) {
  // Implementation
}
```

### ✅ 9. Test Composables in Isolation

Write unit tests for each composable:

```typescript
// __tests__/useCounter.test.ts
import { useCounter } from '@/composables/useCounter'

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { count } = useCounter()
    expect(count.value).toBe(0)
  })

  it('should increment correctly', () => {
    const { count, increment } = useCounter(5)
    increment()
    expect(count.value).toBe(6)
  })
})
```

### ✅ 10. Version and Deprecate

When changing composables, use proper versioning:

```typescript
// v1 (deprecated)
export function usePosts() {
  /* old implementation */
}

// v2 (current)
export function usePostsV2() {
  /* new implementation */
}

// Or use export aliasing
export { usePostsV2 as usePosts }
```

---

## ⚡ Quick Summary Table

| Layer        | Responsibility                            | Example Composables           | Testing Focus                    |
| :----------- | :---------------------------------------- | :---------------------------- | :------------------------------- |
| **Data**     | API calls, caching, data transformations  | `usePosts`, `useUsers`        | API responses, error handling    |
| **UI**       | Component state, animations, interactions | `useModal`, `useDropdown`     | User interactions, state changes |
| **Business** | Validation, calculations, domain logic    | `usePricing`, `useValidation` | Business rules, edge cases       |
| **Effects**  | External interactions, subscriptions      | `useKeyboard`, `useInterval`  | Side effects, cleanup            |
| **Shared**   | Cross-cutting concerns                    | `useAuth`, `useTheme`         | Global state, integration        |

---

## 🔄 Migration Strategy

### From Mixed Components

**Before (Mixed Concerns):**

```html
<script setup>
  // Data + UI + Business + Effects all mixed
  const posts = ref([])
  const loading = ref(false)
  const showModal = ref(false)
  const errors = ref([])

  const validatePost = (post) => {
    /* validation */
  }
  const fetchPosts = async () => {
    /* API call */
  }
  const handleSubmit = () => {
    /* form logic */
  }

  onMounted(() => {
    fetchPosts()
  })
</script>
```

**After (Separated Concerns):**

```html
<script setup>
  // Each concern in its composable
  const { posts, loading, fetchPosts } = usePosts()
  const { isOpen, open, close } = useModal()
  const { validatePost } = usePostValidation()

  const handleSubmit = () => {
    if (validatePost(formData)) {
      // Submit logic
    }
  }

  onMounted(() => {
    fetchPosts()
  })
</script>
```

### Benefits Achieved

1. **Testability:** Test data logic without UI, test UI without data
2. **Reusability:** Use `usePosts` in any component that needs posts
3. **Maintainability:** Change validation rules in one place
4. **Readability:** Component code focuses on coordination, not implementation
5. **Scalability:** Add new features without modifying existing components

---

## 🚀 Advanced Patterns

### Pattern 1: Composable Composition

Build complex composables from simpler ones:

```typescript
export function usePostManager() {
  // Compose multiple composables
  const posts = usePosts()
  const validation = usePostValidation()
  const modal = useModal()

  const createPost = async (title: string, content: string) => {
    const validation = validation.validatePost(title, content)
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '))
    }

    modal.open()
    try {
      await posts.createPost({ title, content })
      modal.close()
    } catch (err) {
      modal.close()
      throw err
    }
  }

  return {
    ...posts,
    ...validation,
    ...modal,
    createPost,
  }
}
```

### Pattern 2: Plugin Architecture

Allow composables to be extended:

```typescript
interface Plugin {
  name: string
  setup: (context: any) => any
}

export function useComposableWithPlugins(baseComposable: Function, plugins: Plugin[]) {
  const base = baseComposable()

  const enhanced = { ...base }

  plugins.forEach((plugin) => {
    const result = plugin.setup({ ...enhanced })
    Object.assign(enhanced, result)
  })

  return enhanced
}
```

### Pattern 3: State Machines

Use composables to manage complex state transitions:

```typescript
export function usePostWorkflow() {
  const state = ref<'draft' | 'reviewing' | 'published' | 'archived'>('draft')

  const actions = {
    draft: { submit: 'reviewing' },
    reviewing: { approve: 'published', reject: 'draft' },
    published: { archive: 'archived' },
    archived: { restore: 'draft' },
  }

  const transition = (action: string) => {
    const currentActions = actions[state.value]
    const nextState = currentActions?.[action]
    if (nextState) {
      state.value = nextState
    }
  }

  return {
    state: readonly(state),
    transition,
    canTransition: (action: string) => !!actions[state.value]?.[action],
  }
}
```
