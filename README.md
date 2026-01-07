# My Little Task Box

A simple and functional Vue.js task management application that demonstrates CRUD operations while focusing on modern Vue 3 Composition API concepts and best practices.

## ✨ Features

This project showcases the following Vue 3 features and patterns:

- **`<script setup>`** - The new syntax for Composition API components
- **`defineProps`** - Type-safe prop definitions with validation
- **`defineEmits`** - Explicit event declarations
- **`defineExpose`** - Controlled component API exposure
- **`useSlots` & `useAttrs`** - Advanced slot and attribute handling
- **Composables (Custom Hooks)** - Reusable logic extraction
- **Logic Reuse with Composables** - Clean separation of concerns

## 🚀 Tech Stack

- **Framework:** Vue 3.5.26
- **Build Tool:** Vite 7.3.0
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4.1.18
- **Linting:** ESLint
- **Formatting:** Prettier
- **Development Tools:** Vue DevTools

## 📋 Prerequisites

- Node.js ^20.19.0 || >=22.12.0
- npm or yarn

## 🛠️ Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd my-little-task-box
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5174`

## 📖 Usage

The application provides a simple task management interface with the following functionality:

- **Create** new tasks
- **Read** existing tasks
- **Update** task details
- **Delete** tasks

Explore the components to see how Vue 3 Composition API features are implemented:

- `TaskInput.vue` - Form component for adding new tasks
- `TaskList.vue` - Container component for displaying tasks
- `TaskItem.vue` - Individual task component with edit/delete actions
- `useTasks.ts` - Composable for task management logic

## 🏗️ Project Structure

```
src/
├── components/
│   ├── TaskInput.vue      # Task creation form
│   ├── TaskItem.vue       # Individual task display
│   └── TaskList.vue       # Task list container
├── composables/
│   └── useTasks.ts        # Task management logic
├── assets/
│   └── main.css           # Global styles with Tailwind
├── App.vue                # Root component
└── main.ts                # Application entry point

notes/
└── 01-props.md            # Educational notes on Vue props
```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Lint and fix code
- `npm run format` - Format code with Prettier

## 🎓 Learning Objectives

This project serves as a practical example for learning:

- Vue 3 Composition API patterns
- Component communication (props, emits, slots)
- Custom composables for logic reuse
- TypeScript integration in Vue
- Modern CSS with Tailwind CSS
- Project structure and organization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is for educational purposes. Feel free to use and modify as needed.

## 📚 Additional Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Vue Composition API Guide](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)
