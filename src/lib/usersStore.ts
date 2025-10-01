import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Company {
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  company: Company;
  createdAt?: number;
  isLocal?: boolean;
}

interface UsersState {
  users: User[];
  setUsers: (list: User[]) => void;
  addUserAtTop: (user: Omit<User, "id"> & { id?: number }) => void;
  updateUser: (id: number, patch: Partial<Omit<User, "id">>) => void;
  deleteUser: (id: number) => void;
}

export const useUsersStore = create<UsersState>()(
  persist(
    (set) => ({
      users: [],
      setUsers: (list) => set({ users: list }),
      addUserAtTop: (user) =>
        set((state) => {
          const newId = user.id ?? Date.now();
          const newUser: User = {
            id: newId,
            name: user.name,
            email: user.email,
            company: user.company ?? { name: "—" },
            createdAt: Date.now(),
            isLocal: true,
          };
          return { users: [newUser, ...state.users] };
        }),
      updateUser: (id, patch) =>
        set((state) => ({
          users: state.users.map((user) => (user.id === id ? { ...user, ...patch } : user)),
        })),
      deleteUser: (id) =>
        set((state) => ({ users: state.users.filter((user) => user.id !== id) })),
    }),
    {
      name: "users-store",
      version: 1,
      partialize: (state) => ({ users: state.users }),
      storage: createJSONStorage(() => localStorage),
    }
  )
);
