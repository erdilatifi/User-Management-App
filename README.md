# User Management App (React + Vite + TS)

Check out my project: [ Project ](https://user-management-app-eight-beta.vercel.app/)


A simple user management SPA built with React 19, Vite 7, and TypeScript. It fetches users from JSONPlaceholder and supports local add/update/delete, search, sort, and pagination. Routing is powered by React Router v7, state by Zustand, styling by Tailwind CSS v4, and Shadcn UI.

## Features

- **User list with server data**
  - Fetches from `https://jsonplaceholder.typicode.com/users`.
- **Local CRUD**
  - Add a user at the top of the list (validated email).
  - Update and delete users via modal dialogs.
  - Local users are prioritized in sort and shown first.
- **Search & sort**
  - Search by name/email.
  - Sort by name or email (asc/desc).
- **Pagination**
  - Client-side pagination with page controls.
- **Routing**
  - `/` main list.
  - `/:id` detail page with extended info.
- **State management**
  - Zustand store for `users`,
- **Styling + UI**
  - Tailwind CSS v4 and shadcn UI components (`button`, `card`, `dialog`, etc.).
  - Toasts via Sonner, spinner while loading.


## Tech Stack

- React 19, React Router DOM 7
- Vite 7, TypeScript 5.8
- Tailwind CSS 4, Shadcn UI
- Zustand (state)
- Sonner (toasts)
- lucide-react (icons)
- ESLint 9
