# User Management App (React + Vite)

A simple user management app built with React, Vite, Tailwind, and Zustand. It fetches users from JSONPlaceholder, lets you search/sort/paginate, and add/update/delete users locally with toasts.

## Features

- **Fetch users** from `jsonplaceholder.typicode.com`
- **Search** by name or email (case-insensitive)
- **Sort** by name or email, ascending/descending
- **Pagination** with page links and prev/next
- **Add user** (local entries appear at the top)
- **Update/Delete** existing users
- **Detail page** for viewing extended info
- **Toasts** for feedback using `sonner`

## Tech Stack

- React 19, Vite 7
- React Router 7
- Tailwind CSS 4
- Zustand (state management)
- Sonner (toasts)
- Radix UI primitives via custom components

## Getting Started

Prerequisites:
- Node.js 18+ recommended
- npm (or yarn/pnpm)

Install dependencies:
```bash
npm install
