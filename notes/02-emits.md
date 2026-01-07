### 1. What is `defineEmits`?

It is a compiler macro used in Vue 3's `<script setup>` to declare what **custom events** a component can trigger.

Think of it as the component "shouting" up to its parent.

- **Props** = Parent giving instructions to Child.
- **Emits** = Child reporting back to Parent.

---

### 2. When to use it?

You use emits when **something happens inside the child that the parent needs to know about**.

1.  **User Interaction:** The user clicks a "Delete" button inside the Child. The Child holds the button, but the Parent holds the list of data. The Child must ask the Parent to delete the item.
2.  **Data Modification:** Since you cannot mutate props directly, if a child needs to change data, it emits an event asking the Parent to change it.
3.  **Form Submission:** A child form is filled out. When the user hits "Submit", the child emits an event containing the form data to the parent.

---

### 3. How to use it

#### A. In The Child (Declaring and Triggering)

**JavaScript (Simple)**
You define an array of event names.

```html
<script setup>
  // 1. Define the events this component can emit
  const emit = defineEmits(['delete', 'toggle-status'])

  const handleDeleteClick = () => {
    // 2. Trigger the event
    // You can pass a second argument (payload) like an ID or object
    emit('delete', 123)
  }
</script>

<template>
  <button @click="handleDeleteClick">Delete Me</button>
</template>
```

**TypeScript (Strict & Recommended)**
You define the event name and the type of payload (data) it carries.

```html
<script setup lang="ts">
  // 1. Define events with Payload Types
  // Format: (event: name, ...args: payload_types) => void
  const emit = defineEmits<{
    delete: [id: number] // Event 'delete' expects a number
    'update-title': [newTitle: string] // Event 'update-title' expects a string
  }>()

  const handleDelete = () => {
    // 2. TypeScript will warn you if you pass a string instead of a number
    emit('delete', 123)
  }
</script>
```

#### B. In The Parent (Listening)

The parent listens for the event exactly like it listens for `@click`.

```html
<script setup>
  import TaskItem from './TaskItem.vue'

  // This function runs when the child emits 'delete'
  const onDelete = (id) => {
    console.log('Parent received delete request for ID:', id)
  }
</script>

<template>
  <!-- Listen using @event-name -->
  <TaskItem @delete="onDelete" />
</template>
```

---

### 4. 🏆 Best Practices

#### ✅ 1. Use Descriptive Event Names

Don't use generic names like `click` or `change` (unless it's on a native input element). Use names that describe **what happened**, not just **how it happened**.

- ❌ Bad: `<TaskItem @click="doSomething" />` (Is it a UI click or a logical action?)
- ✅ Good: `<TaskItem @delete-task="removeTask" />` (Clear business logic)

#### ✅ 2. Naming Conventions (Kebab-case)

Always use **kebab-case** (hyphens) for event names in your HTML templates.

- **Emit:** `emit('update-value')`
- **Listen:** `<Comp @update-value="handler" />`

Why? HTML attributes are case-insensitive. `updateValue` might be interpreted as `updatevalue`, which creates bugs.

#### ✅ 3. Pass Minimal Data (Payloads)

When emitting, try to pass only what is necessary (usually an ID), rather than the entire complex object.

- **Okay:** Emitting the ID. Parent finds and deletes the item.
  ```js
  emit('delete', taskId)
  ```
- **Heavier (Avoid unless necessary):** Emitting the whole object.
  ```js
  emit('delete', wholeTaskObject)
  ```

#### ✅ 4. Always Define Your Emits

Even if Vue works technically without `defineEmits`, always declare them.

1.  It acts as **documentation** for other developers (shows what events are available).
2.  It provides **IntelliSense/Autocomplete** in TypeScript.
3.  It removes the "native event listener" warning from the console.

#### ✅ 5. The "v-model" Pattern (Two-way Binding Shortcut)

If you find yourself emitting an event just to update a prop, use `v-model`.

**Scenario:** Prop is `title`. You emit `update:title` to change it.

**The Shortcut:**

```html
<!-- Child -->
<script setup>
  const props = defineProps(['modelValue']) // or 'title'
  const emit = defineEmits(['update:modelValue']) // or 'update:title'
</script>

<template>
  <input :value="props.modelValue" @input="emit('update:modelValue', $event.target.value)" />
</template>

<!-- Parent -->
<!-- Now you can just use v-model -->
<MyComponent v-model="someData" />
```

### Summary Table

| Feature     | Child Logic                          | Parent Logic                   |
| :---------- | :----------------------------------- | :----------------------------- |
| **Declare** | `const emit = defineEmits(['save'])` | N/A                            |
| **Trigger** | `emit('save', data)`                 | N/A                            |
| **Listen**  | N/A                                  | `<Comp @save="handleSave" />`  |
| **Payload** | `emit('save', id, name)`             | `handleSave(id, name) { ... }` |
