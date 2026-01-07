Here are the perfect notes on **`useSlots` & `useAttrs`** in Vue.js, structured as a comprehensive cheat sheet for modern development (Vue 3).

---

# 📚 Vue.js `useSlots` & `useAttrs`: The Ultimate Cheat Sheet

## 1. WHAT are `useSlots` & `useAttrs`?

- **Definition:** Compiler macros in Vue 3's Composition API that provide programmatic access to a component's slots and fallthrough attributes (attributes not declared as props).
- **Analogy:** Think of `useSlots` as a way to "inspect" what content was passed into your component's slots. `useAttrs` is like catching any extra attributes that weren't claimed by props.
- **Core Concept:** In Composition API, slots and attributes aren't automatically available like in Options API. These utilities give you access to them for advanced use cases.

---

## 2. WHEN to use `useSlots` & `useAttrs`?

Use these utilities when:

1. **Dynamic Slot Rendering:** You need to render slots conditionally or programmatically based on runtime logic.
2. **Slot Inspection:** You want to check if certain slots are provided or access slot data.
3. **Attribute Passthrough:** You need to forward attributes to child elements (like in wrapper components).
4. **Higher-Order Components:** Building components that manipulate or proxy slots/attributes.
5. **Library Components:** Creating flexible, reusable components that need to handle arbitrary content and attributes.

❌ **Do NOT use when:** You can achieve the same result with template syntax. Prefer declarative approaches when possible.

---

## 3. HOW to use `useSlots` & `useAttrs`

### A. `useSlots()` - Accessing Slots Programmatically

`useSlots()` returns an object containing all slots passed to the component:

```html
<script setup>
  import { useSlots } from 'vue'

  const slots = useSlots()

  // Check if slots exist
  const hasHeader = !!slots.header
  const hasFooter = !!slots.footer

  // Render slots conditionally
  function renderContent() {
    return slots.default ? slots.default() : 'No content provided'
  }
</script>

<template>
  <div class="card">
    <header v-if="hasHeader">
      <slot name="header" />
    </header>

    <main>{{ renderContent() }}</main>

    <footer v-if="hasFooter">
      <slot name="footer" />
    </footer>
  </div>
</template>
```

### B. `useAttrs()` - Accessing Fallthrough Attributes

`useAttrs()` returns an object of attributes not consumed by props:

```html
<script setup>
  import { useAttrs } from 'vue'

  const props = defineProps(['title']) // 'class' and 'style' are not props
  const attrs = useAttrs()

  // attrs will contain: { class: 'my-class', style: 'color: red' }
</script>

<template>
  <!-- Pass through attributes to child element -->
  <div v-bind="attrs">
    <h1>{{ title }}</h1>
  </div>
</template>
```

### C. Combined Usage

Often used together for flexible wrapper components:

```html
<script setup>
  import { useSlots, useAttrs } from 'vue'

  const slots = useSlots()
  const attrs = useAttrs()
</script>

<template>
  <!-- Wrapper component that forwards everything -->
  <div class="wrapper" v-bind="attrs">
    <slot v-if="slots.default" />
    <div v-else>No content</div>
  </div>
</template>
```

### D. Advanced Slot Manipulation

Accessing slot properties and scoped slots:

```html
<script setup>
  import { useSlots } from 'vue'

  const slots = useSlots()

  function getHeaderContent() {
    if (slots.header) {
      // Call the slot function with props for scoped slots
      return slots.header({ level: 1 })
    }
    return null
  }
</script>

<template>
  <div>
    <component :is="getHeaderContent()" />
    <slot />
  </div>
</template>
```

### E. TypeScript Support

Full type safety with generics:

```html
<script setup lang="ts">
  import { useSlots, useAttrs } from 'vue'

  interface HeaderSlotProps {
    level: number
    title: string
  }

  const slots = useSlots<{
    default: () => any
    header: (props: HeaderSlotProps) => any
  }>()

  const attrs = useAttrs<{
    class: string
    style: string
  }>()
</script>
```

---

## 4. THOUGHT PURPOSE

- **Flexibility:** Enables dynamic, programmatic control over component content and styling.
- **Composition:** Allows building higher-order components that can manipulate or proxy their children.
- **Attribute Forwarding:** Essential for wrapper components that need to pass through styling and behavior.
- **Conditional Rendering:** Provides runtime checks for slot existence and content.
- **Advanced Patterns:** Supports complex component design patterns like renderless components.

---

## 5. 🏆 Best Practices

### ✅ 1. Prefer Template Syntax When Possible

Use slots and attrs in templates when you can:

```html
<script setup>
  // ✅ Good: Use in template
</script>

<template>
  <div v-bind="attrs">
    <slot name="header" />
    <slot />
  </div>
</template>
```

Only use `useSlots`/`useAttrs` for programmatic access:

```html
<script setup>
  const slots = useSlots()

  // ✅ Necessary: Programmatic access
  function renderDynamicContent() {
    return slots.content?.() || 'Default content'
  }
</script>
```

### ✅ 2. Check Slot Existence

Always check if slots exist before using them:

```html
<script setup>
  const slots = useSlots()

  // ✅ Good: Safe access
  const headerContent = slots.header?.()

  // ❌ Avoid: May throw error
  const headerContent = slots.header()
</script>
```

### ✅ 3. Use Proper Attribute Binding

When forwarding attributes, use `v-bind` correctly:

```html
<script setup>
  const attrs = useAttrs()
</script>

<template>
  <!-- ✅ Correct: Spread all attributes -->
  <input v-bind="attrs" />

  <!-- ❌ Wrong: Only spreads some attributes -->
  <input :class="attrs.class" :style="attrs.style" />
</template>
```

### ✅ 4. Handle Scoped Slots Carefully

When working with scoped slots, provide proper props:

```html
<script setup>
  const slots = useSlots()

  function renderItem(item) {
    // ✅ Provide expected props to scoped slot
    return slots.item?.({ item, index: 0 })
  }
</script>
```

### ✅ 5. TypeScript for Complex Cases

Use TypeScript interfaces for complex slot/attr structures:

```html
<script setup lang="ts">
  interface TableSlots {
    header: (props: { columns: string[] }) => any
    body: (props: { rows: any[] }) => any
    footer?: () => any
  }

  const slots = useSlots<TableSlots>()
</script>
```

### ✅ 6. Avoid Over-Manipulation

Don't over-engineer simple components:

```html
<script setup>
  // ✅ Simple: Let template handle it
</script>

<template>
  <div>
    <slot name="title" />
    <slot />
  </div>
</template>
```

### ✅ 7. Document Slot Expectations

Use JSDoc to document expected slots:

```html
<script setup>
  /**
   * @slot header - Optional header content
   * @slot default - Main content (required)
   * @slot footer - Optional footer content
   */
  const slots = useSlots()
</script>
```

---

## ⚡ Quick Summary Table

| Utility          | Purpose                       | Returns                          | Use Case                                  |
| :--------------- | :---------------------------- | :------------------------------- | :---------------------------------------- |
| **`useSlots()`** | Access component slots        | Object with slot functions       | Conditional rendering, dynamic slots      |
| **`useAttrs()`** | Access fallthrough attributes | Object with attribute key-values | Attribute passthrough, wrapper components |

---

## 🔄 Common Patterns

### Pattern 1: Wrapper Components

```html
<!-- ButtonWrapper.vue -->
<script setup>
  import { useAttrs } from 'vue'

  const attrs = useAttrs()
</script>

<template>
  <button class="btn" v-bind="attrs">
    <slot />
  </button>
</template>

<!-- Usage -->
<ButtonWrapper @click="handleClick" class="primary" type="submit"> Click me </ButtonWrapper>
```

### Pattern 2: Conditional Slots

```html
<!-- Card.vue -->
<script setup>
  import { useSlots } from 'vue'

  const slots = useSlots()
</script>

<template>
  <div class="card">
    <div v-if="slots.header" class="card-header">
      <slot name="header" />
    </div>

    <div class="card-body">
      <slot />
    </div>

    <div v-if="slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>
```

### Pattern 3: Renderless Components

```html
<!-- MouseTracker.vue (renderless) -->
<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'

  const x = ref(0)
  const y = ref(0)

  function updatePosition(e) {
    x.value = e.clientX
    y.value = e.clientY
  }

  onMounted(() => {
    document.addEventListener('mousemove', updatePosition)
  })

  onUnmounted(() => {
    document.removeEventListener('mousemove', updatePosition)
  })

  // Expose data for scoped slot
  defineExpose({ x, y })
</script>

<template>
  <slot :x="x" :y="y" />
</template>

<!-- Usage -->
<MouseTracker v-slot="{ x, y }"> Mouse position: {{ x }}, {{ y }} </MouseTracker>
```

### Pattern 4: Dynamic Component Rendering

```html
<!-- DynamicRenderer.vue -->
<script setup>
  import { useSlots } from 'vue'

  const slots = useSlots()

  function renderSlot(name) {
    return slots[name]?.()
  }
</script>

<template>
  <div>
    {{ renderSlot('before') }}
    <main>{{ renderSlot('main') }}</main>
    {{ renderSlot('after') }}
  </div>
</template>
```
