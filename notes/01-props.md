Here are the perfect notes on **Props in Vue.js**, structured as a comprehensive cheat sheet for modern development (Vue 3).

---

# 📚 Vue.js Props: The Ultimate Cheat Sheet

## 1. WHAT are Props?

- **Definition:** Custom attributes you register on a component to pass data down.
- **Analogy:** Think of components like **Functions**. Props are the **Arguments**.

  ```js
  // Function Logic
  function greet(name) {
    return `Hello ${name}`
  }

  // Vue Component Logic
  ;<Greeting name="Alice" />
  ```

- **Core Concept:** **One-Way Data Flow**. Data flows from Parent ⬇️ Child. It cannot flow back up directly.

---

## 2. WHEN to use Props?

Use props when:

1.  **Reusability:** You want to use the same component (e.g., a Button) in different places with different content (e.g., "Submit", "Cancel", "Login").
2.  **Configuration:** The parent needs to control the child's behavior (e.g., disabling a button, changing its color).
3.  **Data Display:** The child needs to display data that belongs to the parent (e.g., a User Profile Card displaying user details from a database).

❌ **Do NOT use props when:** The data is purely local to the component (e.g., an input field being typed into, a toggle switch state). Use `ref` or `reactive` for that.

---

## 3. HOW to use Props

### A. In The Child (Receiving Data)

#### 🟢 JavaScript (Runtime Declaration)

Use the `defineProps` macro. You can define simple types or advanced validation objects.

```html
<script setup>
  // Option 1: Array of strings (Simple, no validation)
  const props = defineProps(['title', 'likes'])

  // Option 2: Object with types & validation (Recommended)
  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
  })
</script>
```

#### 🔵 TypeScript (Compile-time Types)

This provides **IntelliSense** and strict type checking.

```html
<script setup lang="ts">
  // 1. Define the interface
  interface PostProps {
    title: string
    likes?: number // The '?' makes it optional
  }

  // 2. Use Generic Syntax
  // 3. Use 'withDefaults' if you have default values
  const props = withDefaults(defineProps<PostProps>(), {
    likes: 0,
  })
</script>
```

---

### B. In The Parent (Sending Data)

#### 1. Static Props (Passing Strings)

If you are passing a hard-coded string, you don't need the colon `:`.

```html
<!-- The word "Welcome" is passed as a raw string -->
<MyComponent title="Welcome" />
```

#### 2. Dynamic Props (Passing Variables/Expressions)

If you are passing a number, boolean, array, object, or a JavaScript variable, **you MUST use the colon `:`** (which is short for `v-bind`).

```html
<script setup>
  import { ref } from 'vue'
  import MyComponent from './MyComponent.vue'

  const userName = ref('Alice')
  const userAge = ref(25)
</script>

<template>
  <!-- Pass the variable 'userName' -->
  <MyComponent :title="userName" />

  <!-- Pass the number 25 -->
  <MyComponent :age="userAge" />

  <!-- Pass a boolean (true) -->
  <MyComponent :is-active="true" />

  <!-- Pass an object -->
  <MyComponent :meta="{ id: 1, source: 'api' }" />
</template>
```

---

## 4. 🏆 Best Practices

To write clean, bug-free Vue code, follow these rules:

### ✅ 1. Naming Conventions

HTML attributes are case-insensitive, but JavaScript is case-sensitive.

- **In JavaScript/Template:** use **camelCase** (`myProp`).
- **In HTML (Parent):** use **kebab-case** (`my-prop`).
- _Vue automatically converts them for you._

```html
<!-- Child defines: userInfo -->
<UserCard :user-info="currentUser" />
```

### ✅ 2. Define Detailed Props

Don't just use `defineProps(['data'])`. Always define the `type` and set a `default` if possible. This acts as documentation for other developers.

```js
// Bad
const props = defineProps(['status'])

// Good
const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['active', 'pending', 'archived'].includes(value),
  },
})
```

### ✅ 3. The Golden Rule: Immutability

**NEVER mutate a prop inside the child component.**
If you try to change `props.user.name = 'Bob'`, Vue will throw a warning.

- **Why?** If the parent updates the data, the child's local change would be overwritten, causing bugs.
- **Solution:** If the child needs to work with that data, create a local copy using `computed` or `ref`.

```html
<script setup>
  const props = defineProps(['initialCount'])

  // ❌ WRONG: Don't mutate props.count++

  // ✅ CORRECT: Create a local reactive copy
  const localCount = ref(props.initialCount)

  // OR use a computed property if you just need to format it
  const doubleCount = computed(() => props.initialCount * 2)
</script>
```

### ✅ 4. Keep Props Simple

Avoid passing deeply nested objects if possible. It makes it hard to track which data changes caused a re-render. Pass specific IDs or primitive types when you can.

---

## ⚡ Quick Summary Table

| Feature           | Syntax Child                       | Syntax Parent              | Notes                   |
| :---------------- | :--------------------------------- | :------------------------- | :---------------------- |
| **Static String** | `defineProps(['msg'])`             | `<Comp msg="Hi" />`        | No colon needed         |
| **Variable**      | `defineProps(['msg'])`             | `<Comp :msg="myVar" />`    | Colon needed (`v-bind`) |
| **Boolean**       | `defineProps(['isOpen'])`          | `<Comp :is-open="true" />` | Colon needed            |
| **JS Object**     | `defineProps(['user'])`            | `<Comp :user="{id:1}" />`  | Colon needed            |
| **Required**      | `{ type: String, required: true }` | N/A                        | Throws error if missing |
| **Default**       | `{ type: Number, default: 0 }`     | N/A                        | Used if prop is missing |
